import { rework } from './fonts'
import './globals.css'

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