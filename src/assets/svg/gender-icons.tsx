import { CostumeGender } from '@/apis/costume/constants'

export const GenderFemaleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    strokeWidth={2}
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill-rule="evenodd"
      d="M8 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8M3 5a5 5 0 1 1 5.5 4.975V12h2a.5.5 0 0 1 0 1h-2v2.5a.5.5 0 0 1-1 0V13h-2a.5.5 0 0 1 0-1h2V9.975A5 5 0 0 1 3 5"
    />
  </svg>
)

export const GenderMaleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    strokeWidth={2}
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill-rule="evenodd"
      d="M9.5 2a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V2.707L9.871 6.836a5 5 0 1 1-.707-.707L13.293 2zM6 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8"
    />
  </svg>
)

export const GenderUnisexIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    strokeWidth={2}
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill-rule="evenodd"
      d="M11.5 1a.5.5 0 0 1 0-1h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-3.45 3.45A4 4 0 0 1 8.5 10.97V13H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V14H6a.5.5 0 0 1 0-1h1.5v-2.03a4 4 0 1 1 3.471-6.648L14.293 1zm-.997 4.346a3 3 0 1 0-5.006 3.309 3 3 0 0 0 5.006-3.31z"
    />
  </svg>
)

export const GENDER_ICONS: ReadonlyMap<CostumeGender, React.FC<React.SVGProps<SVGSVGElement>>> = new Map([
  [CostumeGender.MALE, GenderMaleIcon],
  [CostumeGender.FEMALE, GenderFemaleIcon],
  [CostumeGender.UNISEX, GenderUnisexIcon],
])
