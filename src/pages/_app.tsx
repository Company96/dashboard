import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto, Open_Sans } from 'next/font/google';
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import Mobile from "@/components/Mobile";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import axios from 'axios';
import { SessionProvider } from "next-auth/react";
import { onError } from '@apollo/client/link/error';
import { parseCookies } from 'nookies'; 
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import Head from 'next/head';
import { ThemeProvider, useTheme } from "next-themes";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
// import {AppContext} from '@/utils/AppContext'

interface MyJwtPayload extends JwtPayload {
  userId: string;
}

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto'
});

const openSans = Open_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-open-sans'
});

const SERVER_URL = process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT;

const httpLink = createHttpLink({
  uri: SERVER_URL,
});

const authLink = setContext((_, { headers }) => {
  const cookies = parseCookies();
  const token = cookies.token || '';

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const client = new ApolloClient({
  link: authLink.concat(errorLink).concat(httpLink),
  cache: new InMemoryCache(),
});

axios.defaults.baseURL = SERVER_URL;
const cookies = parseCookies();
const token = cookies.token || '';

interface MyJwtPayload extends JwtPayload {
  userID: string;
}

const decodedToken = token ? jwtDecode<MyJwtPayload>(token) : null;
const authenticatedUserID = decodedToken ? decodedToken.userID : '';

const verifyEmail = async () => {
  const response = await axios.get('/api/verify-email');
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const path = usePathname();
  const isAuthPath = path === '/auth/login' || path === '/auth/signup' || path === '/auth/welcome_back' || path === '/auth/reset_password' || path === '/auth/join';

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.type = 'text/javascript';
      script.async = true;
      document.body.appendChild(script);
    };
  
    const initGoogleTranslate = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en' },
          'google_translate_element'
        );
      }
    };
  
    window.googleTranslateElementInit = initGoogleTranslate;
    addGoogleTranslateScript();
  
    const addSmartsuppScript = () => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = `
        var _smartsupp = _smartsupp || {};
        _smartsupp.key = '${process.env.NEXT_PUBLIC_SMARTSUPP}';
        window.smartsupp||(function(d) {
          var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
          s=d.getElementsByTagName('script')[0];c=d.createElement('script');
          c.type='text/javascript';c.charset='utf-8';c.async=true;
          c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
        })(document);
      `;
      const style = document.body.appendChild(script);
      style.innerHTML = `
      #smartsupp-chat {
        display: none !important;
      }
    `;
    };
  
    addSmartsuppScript();
    
    
  }, []);
  

  return (
    <div className={`text-black ${roboto.variable} ${openSans.variable} font-sans`}>
      <Head>
        <title>Aramco</title>
      </Head>
      <ApolloProvider client={client}>
        <SessionProvider session={session}>
            <ThemeProvider attribute="class" defaultTheme="system">
              {/* <AppContext> */}
              <main className="flex">
                {!isAuthPath && (
                  <section>
                    <div className="hidden md:flex">
                      <Sidebar authenticatedUserID={authenticatedUserID} />
                    </div>
                    <div className="flex md:hidden">
                      <Mobile authenticatedUserID={authenticatedUserID} />
                    </div>
                  </section>
                )}
                <section className="w-full z-10">
                  {!isAuthPath && <Header authenticatedUserID={authenticatedUserID} />}
                  <div className={`overflow-y-auto ${isAuthPath ? 'h-full' : 'h-[90svh]'}`}>
                    <Component {...pageProps} authenticatedUserID={authenticatedUserID} />
                  </div>
                  <SpeedInsights />
                  <Analytics />
                </section>
              </main>
              {/* </AppContext> */}
            </ThemeProvider>
        </SessionProvider>
      </ApolloProvider>
      <div id="google_translate_element" style={{ display: 'none' }}></div>
    </div>
  );
  }
