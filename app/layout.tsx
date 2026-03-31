import type { Metadata } from 'next'
import { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { MobileOverlay } from '@/components/MobileOverlay'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Axel Klecki | PM & Design Strategist',
  description: 'Portfolio de Axel Klecki — PM y diseñador. Preguntame lo que quieras sobre mi experiencia, proyectos y forma de trabajar.',
  metadataBase: new URL('https://axelklecki.site'),
  openGraph: {
    title: 'Axel Klecki | PM & Design Strategist',
    description: 'Portfolio de Axel Klecki — PM y diseñador. Preguntame lo que quieras sobre mi experiencia, proyectos y forma de trabajar.',
    url: 'https://axelklecki.site',
    siteName: 'Axel Klecki Portfolio',
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Axel Klecki | PM & Design Strategist',
    description: 'Portfolio de Axel Klecki — PM y diseñador. Preguntame lo que quieras sobre mi experiencia, proyectos y forma de trabajar.',
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <MobileOverlay />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
