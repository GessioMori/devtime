import { createStyles, MantineThemeOverride } from '@mantine/core'

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
  },
  components: {
    Button: {
      defaultProps: {
        variant: 'outline'
      }
    }
  }
}

export const useStyles = createStyles((theme) => ({
  responsiveTimer: {
    fontSize: '500%',
    color: theme.colors.cyan[3],
    backgroundColor: theme.colors.dark[6],
    borderRadius: '8px',

    [theme.fn.smallerThan('sm')]: {
      fontSize: '300%'
    }
  },
  taskInfo: {
    fontSize: theme.fontSizes.lg,
    span: {
      fontWeight: 'bold'
    }
  }
}))
