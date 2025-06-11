'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  
  useEffect(() => {
    const supabase = createSupabaseClient()
    
    // 处理认证回调
    supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (event === 'SIGNED_IN') {
        // 用户已登录，重定向到首页或之前的页面
        router.push('/')
      } else if (event === 'SIGNED_OUT') {
        // 用户已登出，重定向到登录页
        router.push('/auth/login')
      }
    })
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">正在处理认证...</p>
      </div>
    </div>
  )
} 