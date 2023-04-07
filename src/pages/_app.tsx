import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { PrismicProvider } from '@prismicio/react'
import { PrismicPreview } from '@prismicio/next'

import { Header } from '@/components/Header'

import '../styles/global.scss'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <PrismicProvider>
        <PrismicPreview repositoryName="Post">
          <Header />
          <Component {...pageProps} />
        </PrismicPreview>
      </PrismicProvider>
    </SessionProvider>
  )
}
