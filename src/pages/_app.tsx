import { Auth } from '@/components/Auth';
import { defaultTheme } from '@/styles/theme';
import { trpc } from '@/utils/trpc';
import { MantineProvider } from '@mantine/core';
import { NextPage } from 'next';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import './../styles/styles.css';

export type NextPagePublic<P = unknown, IP = P> = NextPage<P, IP> & {
  public?: boolean;
};

type CustomAppProps = AppProps<{ session: Session }> & {
  Component: NextPagePublic;
};

const App = ({ Component, pageProps }: CustomAppProps) => {
  return (
    <>
      <Head>
        <title>DevTime</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="shortcut icon" href="/logo.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.svg" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo.svg" />
      </Head>
      <SessionProvider session={pageProps.session}>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={defaultTheme}>
          {Component.public ? (
            <Component {...pageProps} />
          ) : (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          )}
        </MantineProvider>
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(App);
