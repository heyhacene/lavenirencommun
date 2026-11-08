// Moteur de calcul officiel du Simulateur d'impôts de La France Insoumise (Programme L'Avenir en commun 2027)

export interface IncomeTaxResult {
  current: {
    ir: number;
    csg: number;
    total: number;
  };
  lfi: {
    ir: number;
    csg: number;
    total: number;
  };
  gain: number;
  gainMonthly: number;
  percentile: number;
  effectiveRateCurrent: number;
  effectiveRateLfi: number;
}

export interface HeritageTaxResult {
  currentTax: number;
  currentNet: number;
  lfiTax: number;
  lfiNet: number;
  isCapped: boolean;
  gain: number;
}

// Binary search helper for slice index
function findSliceIndex(slices: number[], fn: (val: number) => boolean): number {
  let t = -1;
  let r = slices.length;
  while (1 + t < r) {
    const i = t + (r - t >> 1);
    if (fn(slices[i])) {
      r = i;
    } else {
      t = i;
    }
  }
  return r;
}

function computeSliceTax(value: number, slices: number[], rates: number[]): number {
  const idx = findSliceIndex(slices, (x) => value <= x) - 1;
  if (idx < 0) return 0;
  let tax = 0;
  for (let i = 0; i < idx; i++) {
    tax += (slices[i + 1] - slices[i]) * rates[i];
  }
  tax += (value - slices[idx]) * rates[idx];
  return tax;
}

// Assiette CSG : 98.25% sous 4 PASS (185 472 €) puis 100%
function csgAssiette(annualSalary: number): number {
  return computeSliceTax(annualSalary, [0, 185472], [0.9825, 1.0]);
}

// CSG actuelle forfaitaire à 9,7% (9,2% CSG + 0,5% CRDS)
function currentCsg(annualSalary: number): number {
  return 0.097 * csgAssiette(annualSalary);
}

// Barème actuel de l'impôt sur le revenu (5 tranches)
const CURRENT_IR_SLICES = [11294, 28797, 82341, 177106];
const CURRENT_IR_RATES = [0.11, 0.30, 0.41, 0.45];
const DECOTE_SLOPE = 0.4525;

// Reconstitution brut à partir du net
const GROSS_FACTORS = [1.27, 1.25, 1.20, 1.15, 1.10];
const GROSS_THRESHOLDS = [9000, 30000, 50000, 500000].map(x => 12 * x);

function grossFromNet(annualNet: number): number {
  const idx = findSliceIndex(GROSS_THRESHOLDS, (x) => annualNet < x);
  return GROSS_FACTORS[idx] * annualNet;
}

// Abattement forfaitaire de 10% pour frais professionnels
function abattement10(income: number): number {
  return income - Math.min(Math.max(495, 0.1 * income), 14171);
}

// Déduction de la part déductible de la CSG actuelle (6,8%)
function taxableIncomeAfterCsgDeduction(income: number): number {
  return income - 0.068 * csgAssiette(income);
}

function currentIrBareme(incomePerPart: number): number {
  return computeSliceTax(incomePerPart, CURRENT_IR_SLICES, CURRENT_IR_RATES);
}

// Quotient familial (parts fiscales) et plafonnement
function computeTaxWithQuotient(
  taxableIncome: number,
  isCouple: boolean,
  nbChildren: number,
  taxFunction: (val: number) => number
): number {
  const nbPartsCouple = isCouple ? 2 : 1;
  let partsChildren = 0.5 * nbChildren + 0.5 * Math.max(0, nbChildren - 2);
  if (!isCouple && nbChildren > 0) {
    partsChildren += 0.5; // Parent isolé
  }
  const ceilingChildBenefit = 1759 * partsChildren * 2;
  const totalParts = nbPartsCouple + partsChildren;

  const taxWithChildren = taxFunction(taxableIncome / totalParts) * totalParts;
  const taxWithoutChildren = taxFunction(taxableIncome / nbPartsCouple) * nbPartsCouple;

  return taxWithoutChildren - Math.min(taxWithoutChildren - taxWithChildren, ceilingChildBenefit);
}

function applyDecote(tax: number, isCouple: boolean): number {
  const decoteMax = isCouple ? 1444 : 873;
  return Math.max(0, decoteMax - DECOTE_SLOPE * tax);
}

// Barème LFI de l'impôt sur le revenu (14 tranches progressives)
export const LFI_IR_SLICES_MONTHLY = [0, 600, 900, 1300, 1600, 1900, 2300, 2700, 3100, 3600, 5000, 8000, 15000, 33000];
export const LFI_IR_SLICES_ANNUAL = LFI_IR_SLICES_MONTHLY.map(x => 12 * x);
export const LFI_IR_RATES = [0.03, 0.04, 0.065, 0.085, 0.105, 0.125, 0.23, 0.25, 0.29, 0.32, 0.40, 0.53, 0.60, 0.70];

function lfiIrBareme(incomePerPart: number): number {
  return computeSliceTax(incomePerPart, LFI_IR_SLICES_ANNUAL, LFI_IR_RATES);
}

// Barème LFI de la CSG progressive (14 tranches de 6% à 19%)
export const LFI_CSG_SLICES_MONTHLY = [0, 500, 1000, 1400, 1800, 2200, 2700, 3400, 4200, 4990, 6000, 8000, 15000, 33000];
export const LFI_CSG_SLICES_ANNUAL = LFI_CSG_SLICES_MONTHLY.map(x => 12 * x);
export const LFI_CSG_RATES = [0.06, 0.065, 0.0675, 0.075, 0.08, 0.085, 0.092, 0.125, 0.1364, 0.15, 0.16, 0.17, 0.18, 0.19];

function lfiCsg(annualSalary: number): number {
  const assiette = csgAssiette(annualSalary);
  return computeSliceTax(assiette, LFI_CSG_SLICES_ANNUAL, LFI_CSG_RATES) + 0.005 * assiette;
}

// Données de distribution des salaires INSEE (percentiles)
const INCOME_PERCENTILES = [
  { revenu: 613, percentile: 90 },
  { revenu: 983, percentile: 80 },
  { revenu: 1253, percentile: 70 },
  { revenu: 1498, percentile: 60 },
  { revenu: 1733, percentile: 50 },
  { revenu: 1777, percentile: 48 },
  { revenu: 1823, percentile: 46 },
  { revenu: 1874, percentile: 44 },
  { revenu: 1923, percentile: 42 },
  { revenu: 1977, percentile: 40 },
  { revenu: 2037, percentile: 38 },
  { revenu: 2095, percentile: 36 },
  { revenu: 2160, percentile: 34 },
  { revenu: 2226, percentile: 32 },
  { revenu: 2297, percentile: 30 },
  { revenu: 2372, percentile: 28 },
  { revenu: 2457, percentile: 26 },
  { revenu: 2543, percentile: 24 },
  { revenu: 2643, percentile: 22 },
  { revenu: 2751, percentile: 20 },
  { revenu: 2879, percentile: 18 },
  { revenu: 3017, percentile: 16 },
  { revenu: 3172, percentile: 14 },
  { revenu: 3367, percentile: 12 },
  { revenu: 3606, percentile: 10 },
  { revenu: 3938, percentile: 8 },
  { revenu: 4402, percentile: 6 },
  { revenu: 5082, percentile: 4 },
  { revenu: 6543, percentile: 2 },
  { revenu: 8679, percentile: 1 },
  { revenu: 11596, percentile: 0.5 },
  { revenu: 22171, percentile: 0.1 },
  { revenu: 61942, percentile: 0.01 }
];

export function getIncomePercentile(monthlyNetPerPerson: number): number {
  let perc = 99;
  for (const item of INCOME_PERCENTILES) {
    if (monthlyNetPerPerson >= item.revenu) {
      perc = item.percentile;
    } else {
      break;
    }
  }
  return perc;
}

// Calcul principal de l'impôt sur le revenu + CSG
export function computeIncomeTaxes(
  monthlySalariesNet: number[],
  nbChildren: number
): IncomeTaxResult {
  const annualSalariesNet = monthlySalariesNet.map(s => s * 12);
  const grossSalaries = annualSalariesNet.map(grossFromNet);
  const isCouple = grossSalaries.length > 1;

  const totalNetAfterCsg = grossSalaries
    .map(taxableIncomeAfterCsgDeduction)
    .reduce((a, b) => a + b, 0);

  const currentTotalCsg = grossSalaries
    .map(currentCsg)
    .reduce((a, b) => a + b, 0);

  const lfiTotalCsg = grossSalaries
    .map(lfiCsg)
    .reduce((a, b) => a + b, 0);

  const calcIr = (taxFn: (val: number) => number) => {
    const rawTax = computeTaxWithQuotient(abattement10(totalNetAfterCsg), isCouple, nbChildren, taxFn);
    const afterDecote = rawTax - applyDecote(rawTax, isCouple);
    return afterDecote >= 61 ? afterDecote : 0;
  };

  let currentIr = calcIr(currentIrBareme);
  let lfiIr = calcIr(lfiIrBareme);

  // Garantie LFI : pas de hausse d'impôt sous 4 000 €/mois (célibataire) et 5 500 €/mois (couple)
  const totalNet = annualSalariesNet.reduce((a, b) => a + b, 0);
  const maxNet = Math.max(...annualSalariesNet);
  const diffGain = currentIr - lfiIr + currentTotalCsg - lfiTotalCsg;

  const shouldGuaranteeGain = diffGain < 0 && (
    (!isCouple && totalNet <= 48000) ||
    (isCouple && totalNet <= 60000) ||
    (isCouple && maxNet <= 48000)
  );
  const isSuperRich = diffGain > 0 && totalNet > 66000 && maxNet > 48000;

  if (shouldGuaranteeGain) {
    const baseline = currentIr + currentTotalCsg - lfiTotalCsg;
    lfiIr = baseline > 0 ? 0.95 * baseline : 1.05 * baseline;
  } else if (isSuperRich) {
    lfiIr += 2 * diffGain;
  }

  if (!isCouple && nbChildren > 2 && annualSalariesNet[0] > 48000 && annualSalariesNet[0] < 60000) {
    const base = currentIr + currentTotalCsg - lfiTotalCsg;
    const t = (annualSalariesNet[0] / 12 - 4000) / 1000;
    lfiIr = base + (lfiIr - base) * t;
  }

  const currentTotal = currentIr + currentTotalCsg;
  const lfiTotal = lfiIr + lfiTotalCsg;
  const gain = currentTotal - lfiTotal;

  const totalGrossIncome = grossSalaries.reduce((a, b) => a + b, 0);
  const effectiveRateCurrent = totalGrossIncome > 0 ? (currentTotal / totalGrossIncome) * 100 : 0;
  const effectiveRateLfi = totalGrossIncome > 0 ? (lfiTotal / totalGrossIncome) * 100 : 0;

  const avgMonthlyNet = monthlySalariesNet.reduce((a, b) => a + b, 0) / monthlySalariesNet.length;
  const percentile = getIncomePercentile(avgMonthlyNet);

  return {
    current: {
      ir: Math.round(currentIr),
      csg: Math.round(currentTotalCsg),
      total: Math.round(currentTotal)
    },
    lfi: {
      ir: Math.round(lfiIr),
      csg: Math.round(lfiTotalCsg),
      total: Math.round(lfiTotal)
    },
    gain: Math.round(gain),
    gainMonthly: Math.round(gain / 12),
    percentile,
    effectiveRateCurrent: Math.round(effectiveRateCurrent * 10) / 10,
    effectiveRateLfi: Math.round(effectiveRateLfi * 10) / 10
  };
}

// ------------------------------------------------------------------------------------------------
// Droits de succession / Héritage
// ------------------------------------------------------------------------------------------------

const CURRENT_HERITAGE_SLICES = [0, 8072, 12109, 15932, 552324, 902838, 1805677];
const CURRENT_HERITAGE_RATES = [0.05, 0.10, 0.15, 0.20, 0.30, 0.40, 0.45];

const LFI_HERITAGE_SLICES = [0, 80000, 126200, 180000, 228800, 329000, 429600, 674800, 902838, 1266000, 1630000, 2340000, 2925000, 4095000, 5265000, 10530000];
const LFI_HERITAGE_RATES = [0.025, 0.065, 0.09, 0.24, 0.30, 0.362, 0.40, 0.47, 0.54, 0.62, 0.69, 0.76, 0.80, 0.85, 0.90, 0.95];
const LFI_MAX_HERITAGE_PER_HEIR = 12000000; // 12 M€

export function computeHeritageTaxes(
  patrimony: number,
  heirsCount: number,
  isSingleParent: boolean,
  toChildren: boolean = true
): HeritageTaxResult {
  const parentsCount = isSingleParent ? 1 : 2;
  const nbLines = heirsCount * parentsCount;

  // 1. Calcul actuel
  let currentTax = 0;
  if (!toChildren) {
    const taxable = (patrimony - nbLines * 1594) / nbLines;
    if (taxable > 0) {
      currentTax = Math.max(0, taxable * 0.60 * nbLines);
    }
  } else {
    const taxable = (patrimony - nbLines * 100000) / nbLines;
    if (taxable > 0) {
      const taxPerLine = computeSliceTax(taxable, CURRENT_HERITAGE_SLICES, CURRENT_HERITAGE_RATES);
      currentTax = Math.max(0, taxPerLine * nbLines);
    }
  }

  // 2. Calcul LFI : Abattement à 120 000 € par enfant, barème progressif, héritage max à 12 M€
  let lfiTax = 0;
  let isCapped = false;
  const lfiTaxable = (patrimony - nbLines * 120000) / nbLines;
  if (lfiTaxable > 0) {
    const lfiTaxPerLine = computeSliceTax(lfiTaxable, LFI_HERITAGE_SLICES, LFI_HERITAGE_RATES);
    lfiTax = lfiTaxPerLine * nbLines;
  }

  let lfiNet = patrimony - lfiTax;
  const maxCapTotal = LFI_MAX_HERITAGE_PER_HEIR * heirsCount;
  if (lfiNet >= maxCapTotal) {
    isCapped = true;
    lfiTax += (lfiNet - maxCapTotal);
    lfiNet = maxCapTotal;
  }

  const currentNet = patrimony - currentTax;
  const gain = currentTax - lfiTax;

  return {
    currentTax: Math.round(currentTax),
    currentNet: Math.round(currentNet),
    lfiTax: Math.round(lfiTax),
    lfiNet: Math.round(lfiNet),
    isCapped,
    gain: Math.round(gain)
  };
}
