import { MantineProvider } from '@mantine/core'
import { NextPage } from 'next'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { ReactElement, ReactNode } from 'react'
import { trpc } from '../utils/trpc'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayoutAndContext = AppProps & {
  Component: NextPageWithLayout
  pageProps: any
}

function App({ Component, pageProps }: AppPropsWithLayoutAndContext) {
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
      <SessionProvider session={pageProps.session}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: 'dark',
            fontFamily: 'Roboto, sans-serif',
            headings: {
              fontFamily: 'Roboto, sans-serif'
            }
          }}
        >
          {getLayout(<Component {...pageProps} />)}
        </MantineProvider>
      </SessionProvider>
    </>
  )
}

export default trpc.withTRPC(App)
