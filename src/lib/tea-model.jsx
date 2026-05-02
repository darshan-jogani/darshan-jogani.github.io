// Simple LCOH (Levelized Cost of Hydrogen) waterfall calc.
// Inputs roughly aligned with industry estimates; for illustration, not policy.

export const lcohBreakdown = ({
  capex = 1200,           // €/kW
  capacityFactor = 0.55,  // 0..1
  electricityPrice = 60,  // €/MWh
  efficiency = 0.62,      // HHV system
  stackLifetime = 80000,  // hours
  oAndMRate = 0.03,       // fraction of capex/yr
  waterCost = 0.05,       // €/kg H2
  discountRate = 0.07,
  plantLife = 20,         // years
  fcrAdj = 1.0,
} = {}) => {
  const fcr = (discountRate * Math.pow(1 + discountRate, plantLife)) /
              (Math.pow(1 + discountRate, plantLife) - 1) * fcrAdj;
  const hoursYear = capacityFactor * 8760;
  // hydrogen: 1 kg H2 needs ~39.4 kWh / efficiency
  const energyPerKg = 39.4 / efficiency; // kWh/kg
  const h2PerKwYr = hoursYear / energyPerKg; // kg/kW/yr

  const capexComp = (capex * fcr) / h2PerKwYr;
  const oamComp   = (capex * oAndMRate) / h2PerKwYr;
  const elecComp  = (electricityPrice / 1000) * energyPerKg;
  const stackComp = (capex * 0.4) / stackLifetime * energyPerKg / efficiency * 0.6; // rough stack replacement
  const waterComp = waterCost;

  const total = capexComp + oamComp + elecComp + stackComp + waterComp;
  return {
    capex: capexComp,
    oam: oamComp,
    electricity: elecComp,
    stack: stackComp,
    water: waterComp,
    total,
  };
};
