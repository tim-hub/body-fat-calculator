/**
 * Health status for body fat % and BMI: green (healthy), yellow (warning), red (unhealthy).
 */

export type HealthStatus = 'green' | 'yellow' | 'red'

export function getBodyFatStatus(percent: number | null, gender: 'male' | 'female'): HealthStatus | null {
  if (percent == null || !Number.isFinite(percent)) return null
  if (gender === 'male') {
    if (percent >= 8 && percent <= 19) return 'green'
    if (percent >= 20 && percent <= 24) return 'yellow'
    return 'red'
  }
  if (percent >= 21 && percent <= 32) return 'green'
  if (percent >= 33 && percent <= 38) return 'yellow'
  return 'red'
}

export function getBmiStatus(bmiValue: number | null): HealthStatus | null {
  if (bmiValue == null || !Number.isFinite(bmiValue)) return null
  if (bmiValue >= 18.5 && bmiValue <= 24.9) return 'green'
  if ((bmiValue >= 17 && bmiValue < 18.5) || (bmiValue > 24.9 && bmiValue < 30)) return 'yellow'
  return 'red'
}
