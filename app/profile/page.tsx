'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { createSupabaseClient } from '@/lib/supabase'
import { User, Mail, Phone, MapPin, Save, Edit } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface ProfileData {
  full_name: string
  phone: string
  address: string
  city: string
  postal_code: string
  country: string
}

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: '中国'
  })

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        postal_code: profile.postal_code || '',
        country: profile.country || '中国'
      })
    }
  }, [profile])

  const handleSave = async () => {
    if (!user) return

    setLoading(true)
    try {
      const supabase = createSupabaseClient()
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      await refreshProfile()
      setEditing(false)
      toast.success('个人资料更新成功！')
    } catch (error: any) {
      console.error('更新个人资料失败:', error)
      toast.error('更新失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        postal_code: profile.postal_code || '',
        country: profile.country || '中国'
      })
    }
    setEditing(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">请先登录</h1>
            <p className="text-gray-600 mb-8">您需要登录后才能查看个人资料</p>
            <Link
              href="/auth/login"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              立即登录
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="h-8 w-8 text-primary-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">个人资料</h1>
                  <p className="text-gray-600">管理您的个人信息</p>
                </div>
              </div>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  编辑
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  邮箱地址
                </label>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">邮箱地址不可修改</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  姓名
                </label>
                <input
                  type="text"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                  disabled={!editing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                    editing ? 'bg-white' : 'bg-gray-50 text-gray-500'
                  }`}
                  placeholder="请输入您的姓名"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  手机号码
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!editing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                    editing ? 'bg-white' : 'bg-gray-50 text-gray-500'
                  }`}
                  placeholder="请输入手机号码"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  城市
                </label>
                <input
                  type="text"
                  value={profileData.city}
                  onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                  disabled={!editing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                    editing ? 'bg-white' : 'bg-gray-50 text-gray-500'
                  }`}
                  placeholder="请输入所在城市"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  详细地址
                </label>
                <textarea
                  value={profileData.address}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                  disabled={!editing}
                  rows={3}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                    editing ? 'bg-white' : 'bg-gray-50 text-gray-500'
                  }`}
                  placeholder="请输入详细地址"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">邮政编码</label>
                <input
                  type="text"
                  value={profileData.postal_code}
                  onChange={(e) => setProfileData(prev => ({ ...prev, postal_code: e.target.value }))}
                  disabled={!editing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                    editing ? 'bg-white' : 'bg-gray-50 text-gray-500'
                  }`}
                  placeholder="请输入邮政编码"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">国家/地区</label>
                <input
                  type="text"
                  value={profileData.country}
                  onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                  disabled={!editing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                    editing ? 'bg-white' : 'bg-gray-50 text-gray-500'
                  }`}
                />
              </div>
            </div>

            {editing && (
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      保存
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">账户信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">用户角色:</span>
              <span className="ml-2 font-medium">
                {profile?.role === 'admin' ? '管理员' : '普通用户'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">注册时间:</span>
              <span className="ml-2 font-medium">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('zh-CN') : '-'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">最后登录:</span>
              <span className="ml-2 font-medium">
                {profile?.last_login_at ? new Date(profile.last_login_at).toLocaleDateString('zh-CN') : '-'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">账户状态:</span>
              <span className={`ml-2 font-medium ${profile?.is_active ? 'text-green-600' : 'text-red-600'}`}>
                {profile?.is_active ? '正常' : '已禁用'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 