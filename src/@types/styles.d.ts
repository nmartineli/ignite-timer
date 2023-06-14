// d significa que nesse arquivo só tem códigos de definição do typescript => arquivo de definição de tipos.

import 'styled-components'
import { defaultTheme } from '../styles/themes/default'

type ThemeType = typeof defaultTheme

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
