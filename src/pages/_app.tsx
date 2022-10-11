import { defaultTheme } from '@/styles/theme'
import { trpc } from '@/utils/trpc'
import { MantineProvider } from '@mantine/core'
import { NextPage } from 'next'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { ReactElement, ReactNode } from 'react'

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
        <title>DevTime</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <SessionProvider session={pageProps.session}>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={defaultTheme}>
          {getLayout(<Component {...pageProps} />)}
        </MantineProvider>
      </SessionProvider>
    </>
  )
}

export default trpc.withTRPC(App)
