import { RouteGuard } from '@/components/RouteGuard'
import TutorContext from '@/context/tutorContext'
import UserContext from '@/context/userContext'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }) {
  return (
    <UserContext>
      <TutorContext>
        <RouteGuard>
          <Component {...pageProps} />
        </RouteGuard>
      </TutorContext>
    </UserContext>
  )
}
