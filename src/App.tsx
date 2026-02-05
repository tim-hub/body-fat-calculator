import { usePersistedBodyFatInputs } from '@/hooks/use-persisted-body-fat-inputs'
import {
  navyBodyFatPercent,
  bmi,
  type MeasurementsCm,
} from '@/lib/bodyfat'
import { getBodyFatStatus, getBmiStatus, type HealthStatus } from '@/lib/healthRanges'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

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
  const bfStatus = getBodyFatStatus(bodyFat ?? null, inputs.gender ?? 'male')
  const bmiStatus = getBmiStatus(bmiVal)

  const handleChange = (key: keyof typeof inputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const value = raw === '' ? undefined : Number(raw)
    setInputs((prev) => ({ ...prev, [key]: value }))
  }

  const handleGenderChange = (value: string) => {
    setInputs((prev) => ({ ...prev, gender: value === 'female' ? 'female' : 'male' }))
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
                U.S. Navy method. Enter measurements in cm and kg; values are saved locally.
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
                  <FieldLabel htmlFor="height">Height (cm)</FieldLabel>
                  <FieldContent>
                    <Input
                      id="height"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={0.1}
                      value={inputs.heightCm ?? ''}
                      onChange={handleChange('heightCm')}
                      placeholder="e.g. 170"
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="weight">Weight (kg)</FieldLabel>
                  <FieldContent>
                    <Input
                      id="weight"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={0.1}
                      value={inputs.weightKg ?? ''}
                      onChange={handleChange('weightKg')}
                      placeholder="e.g. 70"
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="neck">Neck (cm)</FieldLabel>
                  <FieldContent>
                    <Input
                      id="neck"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={0.1}
                      value={inputs.neckCm ?? ''}
                      onChange={handleChange('neckCm')}
                      placeholder="e.g. 38"
                    />
                  </FieldContent>
                </Field>

                {inputs.gender === 'female' ? (
                  <>
                    <Field>
                      <FieldLabel htmlFor="waist">Waist (cm)</FieldLabel>
                      <FieldContent>
                        <Input
                          id="waist"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step={0.1}
                          value={inputs.waistCm ?? ''}
                          onChange={handleChange('waistCm')}
                          placeholder="e.g. 75"
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="hip">Hip (cm)</FieldLabel>
                      <FieldContent>
                        <Input
                          id="hip"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step={0.1}
                          value={inputs.hipCm ?? ''}
                          onChange={handleChange('hipCm')}
                          placeholder="e.g. 95"
                        />
                      </FieldContent>
                    </Field>
                  </>
                ) : (
                  <Field>
                    <FieldLabel htmlFor="abdomen">Abdomen (cm)</FieldLabel>
                    <FieldContent>
                      <Input
                        id="abdomen"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step={0.1}
                        value={inputs.abdomenCm ?? ''}
                        onChange={handleChange('abdomenCm')}
                        placeholder="e.g. 85"
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
