import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navigation from '@/components/Navigation'
import ErrorBoundary from '@/components/ErrorBoundary'
import StatusIndicator from '@/components/StatusIndicator'

export const metadata = {
  title: '攀岩装备在线订购系统',
  description: '一个简单的攀岩装备在线订购系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>
        <ErrorBoundary>
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster />
          <StatusIndicator />
        </ErrorBoundary>
      </body>
    </html>
  )
} 