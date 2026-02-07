# [Body Fat Calculator](https://body-fat-calculator.bai.uno/)

Based on the US Navy Method.



- Auto calculation after input the values
- Save the values to local Indexed DB for further use, no server, no sharing information to others


Body Fat US Navy Estimate Method:

```js
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

# https://github.com/tim-hub/body-fat-calculator/blob/1d9cf98e8f739a949e32ad2433ca041934c9e11e/src/lib/bodyfat.ts#L26C1-L52C1
```


> The U.S. Navy body fat method estimates body fat percentage using measurements of neck, waist, and for women, hip circumference, along with height. This method is convenient and provides a reasonably accurate estimate, typically within 3-4% of actual body fat percentage.
> 
> From AI Wikepedia Summary


