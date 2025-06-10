import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import Navigation from '@/components/Navigation'
import AuthProvider from '@/components/AuthProvider'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '攀岩装备商城',
  description: '专业攀岩装备在线购买平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <Navigation />
            <main className="min-h-screen pt-16">
              {children}
            </main>
            <Toaster position="top-right" />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
} 