import { usePersistedBodyFatInputs } from '@/hooks/use-persisted-body-fat-inputs'
import {
  navyBodyFatPercent,
  bmi,
  type MeasurementsCm,
} from '@/lib/bodyfat'
import { getBodyFatStatus, getBmiStatus, type HealthStatus } from '@/lib/healthRanges'
import { cmToInches, inchesToCm, kgToLb, lbToKg } from '@/lib/units'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

function formatNum(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return '—'
  return String(value)
}

function statusClasses(status: HealthStatus | null): string {
  if (status === 'green') return 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400'
  if (status === 'yellow') return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
  if (status === 'red') return 'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400'
  return 'border-muted bg-muted/50 text-muted-foreground'
}

function App() {
  const [inputs, setInputs, isLoaded] = usePersistedBodyFatInputs()
  const isImperial = (inputs.unitPreference ?? 'metric') === 'imperial'

  const measurements: MeasurementsCm = {
    gender: inputs.gender ?? 'male',
    heightCm: inputs.heightCm ?? null,
    weightKg: inputs.weightKg ?? null,
    neckCm: inputs.neckCm ?? null,
    abdomenCm: inputs.abdomenCm ?? null,
    waistCm: inputs.waistCm ?? null,
    hipCm: inputs.hipCm ?? null,
  }
  const bodyFat = inputs.gender ? navyBodyFatPercent(measurements) : null
  const bmiVal =
    inputs.weightKg != null && inputs.heightCm != null
      ? bmi(inputs.weightKg, inputs.heightCm)
      : null
  const bfStatus = getBodyFatStatus(bodyFat ?? null, inputs.gender ?? 'male', inputs.age)
  const bmiStatus = getBmiStatus(bmiVal)

  const handleMetricChange = (key: 'heightCm' | 'weightKg' | 'neckCm' | 'abdomenCm' | 'waistCm' | 'hipCm') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      const value = raw === '' ? undefined : Number(raw)
      setInputs((prev) => ({ ...prev, [key]: value }))
    }

  const handleImperialChange =
    (
      key: 'heightCm' | 'weightKg' | 'neckCm' | 'abdomenCm' | 'waistCm' | 'hipCm',
      toMetric: (n: number) => number
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      const value = raw === '' ? undefined : toMetric(Number(raw))
      setInputs((prev) => ({ ...prev, [key]: value }))
    }

  const displayHeight = inputs.heightCm != null ? (isImperial ? round1(cmToInches(inputs.heightCm)) : inputs.heightCm) : ''
  const displayWeight = inputs.weightKg != null ? (isImperial ? round1(kgToLb(inputs.weightKg)) : inputs.weightKg) : ''
  const displayNeck = inputs.neckCm != null ? (isImperial ? round1(cmToInches(inputs.neckCm)) : inputs.neckCm) : ''
  const displayAbdomen = inputs.abdomenCm != null ? (isImperial ? round1(cmToInches(inputs.abdomenCm)) : inputs.abdomenCm) : ''
  const displayWaist = inputs.waistCm != null ? (isImperial ? round1(cmToInches(inputs.waistCm)) : inputs.waistCm) : ''
  const displayHip = inputs.hipCm != null ? (isImperial ? round1(cmToInches(inputs.hipCm)) : inputs.hipCm) : ''

  const handleGenderChange = (value: string) => {
    setInputs((prev) => ({ ...prev, gender: value === 'female' ? 'female' : 'male' }))
  }

  const handleUnitChange = (value: string) => {
    setInputs((prev) => ({ ...prev, unitPreference: value === 'imperial' ? 'imperial' : 'metric' }))
  }

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const value = raw === '' ? undefined : Number(raw)
    setInputs((prev) => ({ ...prev, age: value }))
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-muted-foreground text-sm">Loading…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-md">
        <ScrollArea className="h-[calc(100dvh-2rem)]">
          <Card>
            <CardHeader>
              <CardTitle>Body Fat Calculator</CardTitle>
              <CardDescription>
                U.S. Navy method. Values are saved locally.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FieldGroup>
                <Field>
                  <FieldLabel>Gender</FieldLabel>
                  <FieldContent>
                    <RadioGroup
                      value={inputs.gender ?? 'male'}
                      onValueChange={handleGenderChange}
                      className="flex gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                    </RadioGroup>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="age">Age</FieldLabel>
                  <FieldContent>
                    <Input
                      id="age"
                      type="number"
                      inputMode="numeric"
                      min={18}
                      max={120}
                      value={inputs.age ?? ''}
                      onChange={handleAgeChange}
                      placeholder="e.g. 25"
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Units</FieldLabel>
                  <FieldContent>
                    <RadioGroup
                      value={inputs.unitPreference ?? 'metric'}
                      onValueChange={handleUnitChange}
                      className="flex gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="metric" id="metric" />
                        <Label htmlFor="metric">Metric (cm / kg)</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="imperial" id="imperial" />
                        <Label htmlFor="imperial">Imperial (in / lb)</Label>
                      </div>
                    </RadioGroup>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="height">{isImperial ? 'Height (in)' : 'Height (cm)'}</FieldLabel>
                  <FieldContent>
                    <Input
                      id="height"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={isImperial ? 0.1 : 0.1}
                      value={displayHeight}
                      onChange={isImperial ? handleImperialChange('heightCm', inchesToCm) : handleMetricChange('heightCm')}
                      placeholder={isImperial ? 'e.g. 67' : 'e.g. 170'}
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="weight">{isImperial ? 'Weight (lb)' : 'Weight (kg)'}</FieldLabel>
                  <FieldContent>
                    <Input
                      id="weight"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={isImperial ? 0.1 : 0.1}
                      value={displayWeight}
                      onChange={isImperial ? handleImperialChange('weightKg', lbToKg) : handleMetricChange('weightKg')}
                      placeholder={isImperial ? 'e.g. 154' : 'e.g. 70'}
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="neck">{isImperial ? 'Neck (in)' : 'Neck (cm)'}</FieldLabel>
                  <FieldContent>
                    <Input
                      id="neck"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={0.1}
                      value={displayNeck}
                      onChange={isImperial ? handleImperialChange('neckCm', inchesToCm) : handleMetricChange('neckCm')}
                      placeholder={isImperial ? 'e.g. 15' : 'e.g. 38'}
                    />
                  </FieldContent>
                </Field>

                {inputs.gender === 'female' ? (
                  <>
                    <Field>
                      <FieldLabel htmlFor="waist">{isImperial ? 'Waist (in)' : 'Waist (cm)'}</FieldLabel>
                      <FieldContent>
                        <Input
                          id="waist"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step={0.1}
                          value={displayWaist}
                          onChange={isImperial ? handleImperialChange('waistCm', inchesToCm) : handleMetricChange('waistCm')}
                          placeholder={isImperial ? 'e.g. 30' : 'e.g. 75'}
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="hip">{isImperial ? 'Hip (in)' : 'Hip (cm)'}</FieldLabel>
                      <FieldContent>
                        <Input
                          id="hip"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step={0.1}
                          value={displayHip}
                          onChange={isImperial ? handleImperialChange('hipCm', inchesToCm) : handleMetricChange('hipCm')}
                          placeholder={isImperial ? 'e.g. 37' : 'e.g. 95'}
                        />
                      </FieldContent>
                    </Field>
                  </>
                ) : (
                  <Field>
                    <FieldLabel htmlFor="abdomen">{isImperial ? 'Abdomen (in)' : 'Abdomen (cm)'}</FieldLabel>
                    <FieldContent>
                      <Input
                        id="abdomen"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step={0.1}
                        value={displayAbdomen}
                        onChange={isImperial ? handleImperialChange('abdomenCm', inchesToCm) : handleMetricChange('abdomenCm')}
                        placeholder={isImperial ? 'e.g. 33' : 'e.g. 85'}
                      />
                    </FieldContent>
                  </Field>
                )}
              </FieldGroup>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 border-t pt-6">
              <div
                className={cn(
                  'w-full rounded-lg border px-4 py-3 text-sm font-medium',
                  statusClasses(bfStatus)
                )}
              >
                Body fat: {formatNum(bodyFat)}%
              </div>
              <div
                className={cn(
                  'w-full rounded-lg border px-4 py-3 text-sm font-medium',
                  statusClasses(bmiStatus)
                )}
              >
                BMI: {formatNum(bmiVal)}
              </div>
            </CardFooter>
          </Card>
        </ScrollArea>
      </div>
    </div>
  )
}

export default App
