import { useState } from 'react';
import NextApp, { AppProps, AppContext } from 'next/app';
import { getCookie, setCookie } from 'cookies-next';
import Head from 'next/head';
import { MantineProvider, ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { SessionProvider } from 'next-auth/react';
import { ConversationProvider } from '../context/ConversationContext';
import '../global.css';

export default function App(props: AppProps & { colorScheme: ColorScheme, session: any }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  return (
    <>
      <Head>
        <title>ghola</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>

      <SessionProvider session={props.session}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={{ colorScheme, white: '#F8F9FA' }} withGlobalStyles withNormalizeCSS>
            <NotificationsProvider>
              <ConversationProvider>
                <Component {...pageProps} />
              </ConversationProvider>
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </SessionProvider>
    </>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie('mantine-color-scheme', appContext.ctx) || 'dark',
  };
};
