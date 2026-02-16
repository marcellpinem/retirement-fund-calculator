// ============================================================================
// FORMATTING UTILITIES
// ============================================================================

export const formatRupiah = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "0";

  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatShort = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "0";

  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 1_000_000_000) {
    return sign + (absValue / 1_000_000_000).toFixed(2) + "M";
  }

  if (absValue >= 1_000_000) {
    return sign + (absValue / 1_000_000).toFixed(2) + "jt";
  }

  if (absValue >= 1_000) {
    return sign + (absValue / 1_000).toFixed(0) + "rb";
  }

  return value.toString();
};

// ============================================================================
// RETIREMENT FUND CALCULATIONS
// ============================================================================

export const calculateYearsToRetirement = (currentAge, retirementAge) => {
  return Math.max(0, retirementAge - currentAge);
};

export const calculateRetirementFund = (currentAge, retirementAge, annualInflationRate, monthlyExpenses) => {
  if (monthlyExpenses <= 0 || annualInflationRate < 0) return 0;

  const yearsToRetirement = retirementAge - currentAge;
  if (yearsToRetirement <= 0) return 0;

  const annualExpenses = monthlyExpenses * 12;
  const futureAnnualExpenses = annualExpenses * Math.pow(1 + annualInflationRate / 100, yearsToRetirement);

  // Using 4% withdrawal rule (safe withdrawal rate)
  return futureAnnualExpenses / 0.04;
};

export const calculateProgressPercentage = (targetAmount, currentAmount) => {
  if (targetAmount <= 0) return 0;
  return Math.min(100, (currentAmount / targetAmount) * 100);
};

export const calculateMonthlySavings = (targetAmount, annualReturnRate, years) => {
  if (targetAmount <= 0 || years <= 0) return 0;
  if (annualReturnRate < 0) return 0;

  const r = annualReturnRate / 100;

  // If no return, simple division
  if (r === 0) {
    return Math.floor(targetAmount / (years * 12));
  }

  // Future value of annuity formula: FV = PMT × [(1 + r)^n - 1] / r
  // Solving for PMT: PMT = FV × r / [(1 + r)^n - 1]
  const annualPayment = targetAmount / ((Math.pow(1 + r, years) - 1) / r);
  const monthlyPayment = annualPayment / 12;

  return Math.floor(monthlyPayment);
};

// ============================================================================
// EDUCATION FUND CALCULATIONS
// ============================================================================

export const calculateFutureEnrollmentFee = (yearsUntilEnrollment, currentFee, annualInflationRate) => {
  if (currentFee <= 0 || annualInflationRate < 0 || yearsUntilEnrollment < 0) return 0;

  return Math.floor(currentFee * Math.pow(1 + annualInflationRate / 100, yearsUntilEnrollment));
};

export const calculateTotalTuitionCost = (
  tuitionPerPeriod,
  annualInflationRate,
  yearsUntilEnrollment,
  educationDurationYears,
  paymentPeriod,
) => {
  // Validation
  if (tuitionPerPeriod <= 0 || annualInflationRate < 0 || yearsUntilEnrollment < 0 || educationDurationYears <= 0) {
    return 0;
  }

  const S = Number(tuitionPerPeriod);
  const i = Number(annualInflationRate / 100);
  const t = Number(yearsUntilEnrollment);
  const n = Number(educationDurationYears);

  // Convert to annual basis
  let annualTuitionCurrent;
  switch (paymentPeriod) {
    case "bulan":
      annualTuitionCurrent = 12 * S;
      break;
    case "semester":
      annualTuitionCurrent = 2 * S;
      break;
    case "tahun":
      annualTuitionCurrent = S;
      break;
    default:
      annualTuitionCurrent = 12 * S; // Default to monthly
  }

  // Calculate growth factor
  const growthFactor = i === 0 ? n : (Math.pow(1 + i, n) - 1) / i;

  // Total cost adjusted for inflation at enrollment time
  const totalCost = annualTuitionCurrent * Math.pow(1 + i, t) * growthFactor;

  return Math.floor(totalCost);
};

// ============================================================================
// LEGACY ALIASES (for backward compatibility)
// ============================================================================

export const hitungSelisihUsia = calculateYearsToRetirement;
export const hitungDanaPensiun = calculateRetirementFund;
export const hitungProgress = calculateProgressPercentage;
export const hitungTabunganBulanan = calculateMonthlySavings;
export const hitungFVUangPangkal = calculateFutureEnrollmentFee;
export const hitungTotalSPP = calculateTotalTuitionCost;
