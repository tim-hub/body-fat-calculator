/**
 * U.S. Navy body fat formulas (measurements in inches internally).
 * UI uses cm; we convert to inches for the formula.
 */

const CM_TO_IN = 1 / 2.54

function cmToInches(cm: number): number {
  return cm * CM_TO_IN
}

export interface MeasurementsCm {
  gender: 'male' | 'female'
  heightCm: number | null | undefined
  weightKg: number | null | undefined
  neckCm: number | null | undefined
  abdomenCm?: number | null
  waistCm?: number | null
  hipCm?: number | null
}

function isPositive(n: number): boolean {
  return typeof n === 'number' && n > 0 && Number.isFinite(n)
}

/**
 * U.S. Navy body fat % for men: 86.010×log10(abdomen−neck)−70.041×log10(height)+36.76 (inches).
 */
export function navyBodyFatPercentMale(heightCm: number, abdomenCm: number, neckCm: number): number | null {
  const heightIn = cmToInches(heightCm)
  const abdomenIn = cmToInches(abdomenCm)
  const neckIn = cmToInches(neckCm)
  const diff = abdomenIn - neckIn
  if (!isPositive(heightIn) || !isPositive(diff)) return null
  const bf = 86.01 * Math.log10(diff) - 70.041 * Math.log10(heightIn) + 36.76
  return Number.isFinite(bf) ? Math.round(bf * 10) / 10 : null
}

/**
 * U.S. Navy body fat % for women: 163.205×log10(waist+hip−neck)−97.684×log10(height)−78.387 (inches).
 */
export function navyBodyFatPercentFemale(heightCm: number, waistCm: number, hipCm: number, neckCm: number): number | null {
  const heightIn = cmToInches(heightCm)
  const waistIn = cmToInches(waistCm)
  const hipIn = cmToInches(hipCm)
  const neckIn = cmToInches(neckCm)
  const sum = waistIn + hipIn - neckIn
  if (!isPositive(heightIn) || !isPositive(sum)) return null
  const bf = 163.205 * Math.log10(sum) - 97.684 * Math.log10(heightIn) - 78.387
  return Number.isFinite(bf) ? Math.round(bf * 10) / 10 : null
}

export function navyBodyFatPercent(m: MeasurementsCm): number | null {
  const { gender, heightCm, neckCm } = m
  if (!heightCm || !neckCm || !isPositive(heightCm) || !isPositive(neckCm)) return null
  if (gender === 'male') {
    const abdomen = m.abdomenCm
    if (abdomen == null || !isPositive(abdomen)) return null
    return navyBodyFatPercentMale(heightCm, abdomen, neckCm)
  }
  const { waistCm, hipCm } = m
  if (waistCm == null || hipCm == null || !isPositive(waistCm) || !isPositive(hipCm)) return null
  return navyBodyFatPercentFemale(heightCm, waistCm, hipCm, neckCm)
}

/**
 * BMI = weight (kg) / height (m)^2.
 */
export function bmi(weightKg: number, heightCm: number): number | null {
  if (!isPositive(weightKg) || !isPositive(heightCm)) return null
  const heightM = heightCm / 100
  const b = weightKg / (heightM * heightM)
  return Number.isFinite(b) ? Math.round(b * 10) / 10 : null
}
