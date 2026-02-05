/**
 * Health status for body fat % (US Navy age limits) and BMI: green (within limit / normal), red (over / other).
 */

export type HealthStatus = 'green' | 'yellow' | 'red'

/** US Navy body fat limit by age: male %, female %. If age < 18 or missing, returns null (no limit). */
function getNavyLimit(age: number, gender: 'male' | 'female'): number | null {
  if (age == null || !Number.isFinite(age) || age < 18) return null
  if (age <= 21) return gender === 'male' ? 22 : 33
  if (age <= 29) return gender === 'male' ? 23 : 34
  if (age <= 39) return gender === 'male' ? 24 : 35
  return gender === 'male' ? 26 : 36
}

export function getBodyFatStatus(
  percent: number | null,
  gender: 'male' | 'female',
  age: number | null | undefined
): HealthStatus | null {
  if (percent == null || !Number.isFinite(percent)) return null
  const limit = age != null ? getNavyLimit(age, gender) : null
  if (limit == null) return null
  return percent <= limit ? 'green' : 'red'
}

/** BMI: Normal = green; Underweight, Overweight, Obesity = red. */
export function getBmiStatus(bmiValue: number | null): HealthStatus | null {
  if (bmiValue == null || !Number.isFinite(bmiValue)) return null
  if (bmiValue >= 18.5 && bmiValue <= 24.9) return 'green'
  return 'red'
}
