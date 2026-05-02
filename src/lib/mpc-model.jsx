// Lightweight MPC simulation: 1st-order plant + simple receding-horizon QP-style controller.
// Used purely for visualization — not a real process model.

export const simulateMPC = ({
  steps = 200,
  dt = 1,
  setpoint = 70,            // % stack load
  tau = 8,                  // plant time constant
  K = 1,                    // plant gain
  noise = 0.4,
  disturbAt = 90,
  disturbMag = 18,
  horizon = 12,
  Q = 1.0, Rc = 0.05,
  uMin = 0, uMax = 100,
} = {}) => {
  const y = new Array(steps).fill(0);
  const u = new Array(steps).fill(0);
  const sp = new Array(steps).fill(setpoint);
  const dist = new Array(steps).fill(0);
  for (let k = disturbAt; k < steps; k++) dist[k] = disturbMag;
  // also slow ramp at 130 to test tracking
  for (let k = 130; k < steps; k++) sp[k] = setpoint - 18;

  let yk = 0;
  for (let k = 0; k < steps; k++) {
    // plan over horizon, gradient descent on quadratic cost
    let uPlan = u[Math.max(0, k - 1)];
    let bestU = uPlan;
    let bestCost = Infinity;
    for (let trial = 0; trial < 30; trial++) {
      const candidate = uPlan + (trial - 15) * 2.5;
      const ucl = Math.max(uMin, Math.min(uMax, candidate));
      let yp = yk;
      let cost = 0;
      for (let h = 0; h < horizon; h++) {
        yp = yp + (dt / tau) * (K * ucl - yp) + (k + h < steps ? dist[k + h] * 0.05 : 0);
        const target = sp[Math.min(steps - 1, k + h)];
        cost += Q * (yp - target) ** 2 + Rc * (ucl - u[Math.max(0, k - 1)]) ** 2;
      }
      if (cost < bestCost) { bestCost = cost; bestU = ucl; }
    }
    u[k] = bestU;
    // step plant
    yk = yk + (dt / tau) * (K * bestU - yk) + dist[k] * 0.05 + (Math.random() - 0.5) * noise;
    y[k] = yk;
  }
  return { sp, y, u, dist };
};
