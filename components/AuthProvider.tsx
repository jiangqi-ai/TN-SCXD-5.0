'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createSupabaseClient } from '@/lib/supabase'
import { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
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
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error('获取用户信息失败:', error)
          setLoading(false)
          return
        }
        
        setUser(user)
        
        if (user) {
          await refreshProfile()
        }
        
        setLoading(false)
      } catch (error) {
        console.error('AuthProvider 初始化失败:', error)
        setLoading(false)
      }
    }

    getUser()

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          try {
            setUser(session?.user ?? null)
            
            if (session?.user) {
              await refreshProfile()
            } else {
              setProfile(null)
            }
            
            setLoading(false)
          } catch (error) {
            console.error('认证状态变化处理失败:', error)
            setLoading(false)
          }
        }
      )

      return () => subscription.unsubscribe()
    } catch (error) {
      console.error('设置认证监听器失败:', error)
      setLoading(false)
    }
  }, [user?.id])

  const value = {
    user,
    profile,
    loading,
    signOut,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 