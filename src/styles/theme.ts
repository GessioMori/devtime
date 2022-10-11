import { MantineThemeOverride } from '@mantine/core'

export const defaultTheme: MantineThemeOverride = {
  colorScheme: 'dark',
  fontFamily: 'Roboto, sans-serif',
  headings: {
    fontFamily: 'Roboto, sans-serif'
  },
  primaryColor: 'cyan',
  colors: {
    red: [
      '#fff5f5',
      '#ffe3e3',
      '#ffc9c9',
      '#ffa8a8',
      '#ff8787',
      '#ff6b6b',
      '#fa5252',
      '#f03e3e',
      '#ff6b6b', // overrides default red.8 to get a brighter error color
      '#c92a2a'
    ]
  }
}
