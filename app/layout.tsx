import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navigation from '@/components/Navigation'
import { AuthProvider } from '@/components/AuthProvider'
import ErrorBoundary from '@/components/ErrorBoundary'

export const metadata = {
  title: '攀岩装备商城',
  description: '专业的攀岩装备在线商城，提供各类攀岩用品和装备。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <AuthProvider>
            <Navigation />
            <Toaster position="top-center" />
            <main className="min-h-screen pt-16">
              {children}
            </main>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
} 