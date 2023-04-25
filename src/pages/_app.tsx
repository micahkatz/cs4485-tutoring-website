import UserContext from '@/context/userContext'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }) {
  return <UserContext>
    <Component {...pageProps} />
  </UserContext>
}
