import { useCallback, useEffect, useState } from 'react'
import { getInputs, saveInputs, type BodyFatInputsRow } from '@/lib/db'

export type BodyFatInputsState = Partial<Omit<BodyFatInputsRow, 'id' | 'updatedAt'>>

export function usePersistedBodyFatInputs(): [BodyFatInputsState, (arg: BodyFatInputsState | ((prev: BodyFatInputsState) => BodyFatInputsState)) => void, boolean] {
  const [inputs, setState] = useState<BodyFatInputsState>({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    getInputs().then((row) => {
      if (row) {
        setState({
          gender: row.gender,
          age: row.age ?? undefined,
          unitPreference: row.unitPreference ?? undefined,
          heightCm: row.heightCm ?? undefined,
          weightKg: row.weightKg ?? undefined,
          neckCm: row.neckCm ?? undefined,
          abdomenCm: row.abdomenCm ?? undefined,
          waistCm: row.waistCm ?? undefined,
          hipCm: row.hipCm ?? undefined,
        })
      }
      setIsLoaded(true)
    })
  }, [])

  const setInputs = useCallback((arg: BodyFatInputsState | ((prev: BodyFatInputsState) => BodyFatInputsState)) => {
    setState((prev) => {
      const next = typeof arg === 'function' ? arg(prev) : { ...prev, ...arg }
      saveInputs(next)
      return next
    })
  }, [])

  return [inputs, setInputs, isLoaded]
}
