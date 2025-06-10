'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import AdminLayout from '@/components/AdminLayout'
import { Settings, Users, Calendar, Shield, Save, RefreshCw } from 'lucide-react'

interface UserStats {
  totalUsers: number
  todayRegistrations: number
  registrationEnabled: boolean
}

interface RegistrationSettings {
  registration_enabled: boolean
  email_verification_required: boolean
  max_daily_registrations: number
  custom_registration_message: string
}

export default function UserSettingsPage() {
  const [settings, setSettings] = useState<RegistrationSettings>({
    registration_enabled: true,
    email_verification_required: false,
    max_daily_registrations: 100,
    custom_registration_message: ''
  })
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    todayRegistrations: 0,
    registrationEnabled: true
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const supabase = createSupabaseClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      await Promise.all([loadSettings(), loadStats()])
    } catch (error) {
      console.error('Error loading data:', error)
      setMessage({ type: 'error', text: '加载数据失败，请刷新页面重试' })
    } finally {
      setLoading(false)
    }
  }

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', [
          'registration_enabled',
          'email_verification_required', 
          'max_daily_registrations',
          'custom_registration_message'
        ])

      if (error) throw error

      const settingsMap = data.reduce((acc, item) => {
        acc[item.key] = item.value
        return acc
      }, {} as Record<string, string>)

      setSettings({
        registration_enabled: settingsMap.registration_enabled === 'true',
        email_verification_required: settingsMap.email_verification_required === 'true',
        max_daily_registrations: parseInt(settingsMap.max_daily_registrations) || 100,
        custom_registration_message: settingsMap.custom_registration_message || ''
      })
    } catch (error) {
      console.error('Error loading settings:', error)
      throw error
    }
  }

  const loadStats = async () => {
    try {
      // 获取总用户数
      const { count: totalUsers, error: totalError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      if (totalError) throw totalError

      // 获取今日注册数
      const today = new Date().toISOString().split('T')[0]
      const { count: todayRegistrations, error: todayError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today)
        .lt('created_at', today + 'T23:59:59.999Z')

      if (todayError) throw todayError

      setStats({
        totalUsers: totalUsers || 0,
        todayRegistrations: todayRegistrations || 0,
        registrationEnabled: settings.registration_enabled
      })
    } catch (error) {
      console.error('Error loading stats:', error)
      throw error
    }
  }

  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ key, value }, { onConflict: 'key' })

      if (error) throw error
    } catch (error) {
      console.error(`Error updating ${key}:`, error)
      throw error
    }
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      setMessage(null)

      await Promise.all([
        updateSetting('registration_enabled', settings.registration_enabled.toString()),
        updateSetting('email_verification_required', settings.email_verification_required.toString()),
        updateSetting('max_daily_registrations', settings.max_daily_registrations.toString()),
        updateSetting('custom_registration_message', settings.custom_registration_message)
      ])

      // 刷新统计数据
      await loadStats()

      setMessage({ type: 'success', text: '设置保存成功！' })
      
      // 3秒后清除消息
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: '保存设置失败，请重试' })
    } finally {
      setSaving(false)
    }
  }

  const handleToggleRegistration = async () => {
    const newValue = !settings.registration_enabled
    setSettings(prev => ({ ...prev, registration_enabled: newValue }))
    
    try {
      await updateSetting('registration_enabled', newValue.toString())
      await loadStats()
      setMessage({ 
        type: 'success', 
        text: newValue ? '用户注册已启用' : '用户注册已禁用' 
      })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      // 如果更新失败，回滚状态
      setSettings(prev => ({ ...prev, registration_enabled: !newValue }))
      setMessage({ type: 'error', text: '更新失败，请重试' })
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">用户注册控制</h1>
          <p className="mt-1 text-sm text-gray-500">
            管理用户注册设置和查看注册统计信息
          </p>
        </div>

        {/* 消息提示 */}
        {message && (
          <div className={`rounded-md p-4 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      总用户数
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalUsers}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      今日注册
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.todayRegistrations}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className={`h-6 w-6 ${settings.registration_enabled ? 'text-green-400' : 'text-red-400'}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      注册状态
                    </dt>
                    <dd className={`text-lg font-medium ${settings.registration_enabled ? 'text-green-600' : 'text-red-600'}`}>
                      {settings.registration_enabled ? '已启用' : '已禁用'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 注册设置 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              注册设置
            </h3>
            
            <div className="space-y-6">
              {/* 启用/禁用注册 */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">启用用户注册</h4>
                  <p className="text-sm text-gray-500">控制是否允许新用户注册账户</p>
                </div>
                <button
                  onClick={handleToggleRegistration}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    settings.registration_enabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.registration_enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* 邮箱验证 */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">要求邮箱验证</h4>
                  <p className="text-sm text-gray-500">新用户注册后需要验证邮箱才能登录</p>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ 
                    ...prev, 
                    email_verification_required: !prev.email_verification_required 
                  }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    settings.email_verification_required ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.email_verification_required ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* 每日注册限制 */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  每日注册上限
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={settings.max_daily_registrations}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      max_daily_registrations: parseInt(e.target.value) || 100 
                    }))}
                    className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <span className="text-sm text-gray-500">人/天</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  限制每天允许注册的新用户数量（1-1000）
                </p>
              </div>

              {/* 自定义注册消息 */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  自定义注册页面消息
                </label>
                <textarea
                  rows={3}
                  value={settings.custom_registration_message}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    custom_registration_message: e.target.value 
                  }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="在注册页面显示的自定义消息（可选）"
                />
                <p className="mt-1 text-sm text-gray-500">
                  该消息将显示在注册页面顶部，用于向用户展示注册说明或公告
                </p>
              </div>
            </div>

            {/* 保存按钮 */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={loadData}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新数据
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {saving ? '保存中...' : '保存设置'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 