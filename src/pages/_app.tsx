import { MantineProvider } from '@mantine/core'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { ReactElement, ReactNode } from 'react'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'dark',
          fontFamily: 'Roboto, sans-serif',
          headings: {
            fontFamily: 'Roboto, sans-serif'
          },
          colors: {
            test: [
              '#E8F5E9',
              '#C8E6C9',
              '#A5D6A7',
              '#81C784',
              '#66BB6A',
              '#4CAF50',
              '#43A047',
              '#388E3C',
              '#2E7D32',
              '#1B5E20'
            ]
          }
        }}
      >
        {getLayout(<Component {...pageProps} />)}
      </MantineProvider>
    </>
  )
}
