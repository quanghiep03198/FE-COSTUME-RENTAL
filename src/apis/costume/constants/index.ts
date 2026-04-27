export enum CostumeGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UNISEX = 'UNISEX',
}

export enum CostumeUnit {
  SET = 'SET',
  PIECE = 'PIECE',
}

export const COSTUME_GENDER_LABEL_MAP = new Map<CostumeGender, string>([
  [CostumeGender.MALE, 'Nam'],
  [CostumeGender.FEMALE, 'Nữ'],
  [CostumeGender.UNISEX, 'Unisex'],
])

export const COSTUME_UNIT_LABEL_MAP = new Map<CostumeUnit, string>([
  [CostumeUnit.SET, 'Bộ'],
  [CostumeUnit.PIECE, 'Chiếc'],
])

export enum CostumeSize {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
  XXXL = 'XXXL',
}

export const SIZE_RUN = [
  { value: 'XS', label: 'XS', sortOrder: 1 },
  { value: 'S', label: 'S', sortOrder: 2 },
  { value: 'M', label: 'M', sortOrder: 3 },
  { value: 'L', label: 'L', sortOrder: 4 },
  { value: 'XL', label: 'XL', sortOrder: 5 },
  { value: 'XXL', label: 'XXL', sortOrder: 6 },
  { value: 'XXXL', label: 'XXXL', sortOrder: 7 },
]

export const COSTUME_UNIT = [
  { value: CostumeUnit.SET, label: COSTUME_UNIT_LABEL_MAP.get(CostumeUnit.SET) },
  { value: CostumeUnit.PIECE, label: COSTUME_UNIT_LABEL_MAP.get(CostumeUnit.PIECE) },
]
