import './globals.css' // adjust path if needed
import { Inter } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

import 'antd/dist/reset.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'Open Letter | Sign & Stand Together',
  description: 'Add your signature to this open letter and make your voice heard.',
  openGraph: {
    title: 'Open Letter | Sign & Stand Together',
    description: 'Add your signature to this open letter.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - var(--nav-height) - 200px)', paddingTop: 'var(--nav-height)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}