import type { Metadata } from 'next'
import { rework } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Langscape - Enterprise GEO Command Center',
  description: 'AI-native platform for optimizing content across ChatGPT, Claude, Perplexity, and Google AI search results',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={rework.variable}>
      <body className={rework.className}>{children}</body>
    </html>
  )
}