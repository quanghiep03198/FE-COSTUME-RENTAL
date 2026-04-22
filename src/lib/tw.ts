import twImport from 'tailwind-styled-components'

type TwModule = {
  default?: typeof twImport
}

// SSR may expose this package as default.default; normalize it once here.
const tw = ((twImport as TwModule).default ?? twImport) as typeof twImport

export default tw
