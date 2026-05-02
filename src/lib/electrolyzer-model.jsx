// Simplified semi-empirical alkaline electrolyzer cell model.
// U(j, T, p) = U_rev(T,p) + r(T)*j + s(T,p) * log10(t(T,p)*j + 1)
// j in mA/cm², U in V, T in °C, p in bar.
const F = 96485;
const R = 8.314;

export const Urev = (T, p) => {
  const T_K = T + 273.15;
  const U0 = 1.229 - 0.0009 * (T_K - 298);
  const pTerm = ((R * T_K) / (2 * F)) * Math.log(p);
  return U0 + pTerm * 0.5;
};
export const r = (T) => 0.00018 - (T - 25) * 1e-6;
export const s = (T, p) => 0.16 + (p === 1 ? 0 : -0.02) - (T - 25) * 0.0008;
export const tcoef = (T, p) => 25 + (p === 1 ? 0 : 8) - (T - 25) * 0.15;

export const cellVoltage = (j, T, p) =>
  Urev(T, p) + r(T) * j + s(T, p) * Math.log10((tcoef(T, p) * j) / 1000 + 1);

export const polarizationCurve = (T, p, n = 101) => {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const j = (i / (n - 1)) * 1000;
    pts.push([j, cellVoltage(j, T, p)]);
  }
  return pts;
};

export const efficiencyHHV = (u) => (1.481 / u) * 100; // % at cell level
export const powerDensity = (u, j) => (u * j) / 1000; // W/cm²
export const specificEnergy = (u) => u * 2.39; // approx kWh / m³_H2
