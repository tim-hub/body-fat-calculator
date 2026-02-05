import Dexie, { type Table } from 'dexie'

export interface BodyFatInputsRow {
  id: string
  gender?: 'male' | 'female'
  age?: number | null
  unitPreference?: 'metric' | 'imperial'
  heightCm?: number | null
  weightKg?: number | null
  neckCm?: number | null
  abdomenCm?: number | null
  waistCm?: number | null
  hipCm?: number | null
  updatedAt?: number
}

const DB_NAME = 'BodyFatCalculator'
const TABLE = 'bodyFatInputs'
const DEFAULT_ID = 'default'

class BodyFatDb extends Dexie {
  bodyFatInputs!: Table<BodyFatInputsRow, string>

  constructor() {
    super(DB_NAME)
    this.version(1).stores({
      [TABLE]: 'id, updatedAt',
    })
  }
}

const db = new BodyFatDb()

export type BodyFatInputs = Omit<BodyFatInputsRow, 'id' | 'updatedAt'>

export async function getInputs(): Promise<BodyFatInputsRow | undefined> {
  return db.bodyFatInputs.get(DEFAULT_ID)
}

export async function saveInputs(data: Partial<BodyFatInputs>): Promise<void> {
  const existing = await db.bodyFatInputs.get(DEFAULT_ID)
  const row: BodyFatInputsRow = {
    id: DEFAULT_ID,
    ...existing,
    ...data,
    updatedAt: Date.now(),
  }
  await db.bodyFatInputs.put(row)
}
