import Link from 'next/link'
import { Mountain } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Mountain className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">页面未找到</h2>
          <p className="text-gray-600 mb-8">
            抱歉，您访问的页面不存在。可能页面已被移动或删除。
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            返回首页
          </Link>
          <Link
            href="/products"
            className="block w-full bg-white hover:bg-gray-50 text-primary-600 border border-primary-600 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            浏览产品
          </Link>
        </div>
      </div>
    </div>
  )
} 