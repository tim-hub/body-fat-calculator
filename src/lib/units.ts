/** 1 in = 2.54 cm */
const CM_PER_IN = 2.54
/** 1 kg ≈ 2.20462 lb */
const LB_PER_KG = 2.20462

export function cmToInches(cm: number): number {
  return cm / CM_PER_IN
}

export function inchesToCm(inches: number): number {
  return inches * CM_PER_IN
}

export function kgToLb(kg: number): number {
  return kg * LB_PER_KG
}

export function lbToKg(lb: number): number {
  return lb / LB_PER_KG
}
