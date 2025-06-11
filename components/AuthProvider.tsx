'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createSupabaseClient, TypedSupabaseClient } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: Profile | null
  supabase: TypedSupabaseClient
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  supabase: createSupabaseClient(),
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseClient()

  const refreshProfile = async () => {
    if (!user) return
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    setProfile(profile)
  }

  const signOut = async () => {
    try {
      // 无论数据库是否可连接，都要清除本地状态
      setUser(null)
      setProfile(null)
      
      // 清除本地存储
      localStorage.clear()
      sessionStorage.clear()
      
      // 尝试调用 Supabase 登出
      try {
        await supabase.auth.signOut()
      } catch (error) {
        console.error('Supabase 登出失败:', error)
        // 即使 Supabase 登出失败，继续执行
      }
      
      // 强制重定向到登录页面
      window.location.href = '/auth/login'
      
    } catch (error) {
      console.error('退出登录时发生错误:', error)
      // 发生错误时也强制重定向
      window.location.href = '/auth/login'
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          setProfile(profile)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setProfile(profile)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, supabase, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 