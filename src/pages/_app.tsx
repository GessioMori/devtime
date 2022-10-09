import { MantineProvider } from '@mantine/core'
import { NextPage } from 'next'
import { Session } from 'next-auth'
import { getSession, SessionProvider } from 'next-auth/react'
import { AppProps, AppType } from 'next/app'
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

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps
}) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    session: await getSession(ctx)
  }
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

export default trpc.withTRPC(MyApp)
