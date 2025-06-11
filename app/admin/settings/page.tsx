'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import AdminLayout from '@/components/AdminLayout'
import { Setting, SettingInsert, SettingUpdate } from '@/types/database'
import { 
  Settings, 
  Database, 
  Globe, 
  Mail, 
  Truck, 
  DollarSign,
  Save,
  Plus,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface SettingCategory {
  name: string
  description: string
  icon: any
  settings: Setting[]
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSetting, setNewSetting] = useState<Partial<SettingInsert>>({
    key: '',
    value: '',
    description: '',
    category: 'general',
    data_type: 'string',
    is_public: false
  })
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .order('category', { ascending: true })
        .order('key', { ascending: true })

      if (error) throw error
      setSettings(data || [])
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('获取设置失败')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSetting = async (id: string, updates: SettingUpdate) => {
    try {
      const { error } = await supabase
        .from('settings')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      setSettings(prev => prev.map(setting => 
        setting.id === id ? { ...setting, ...updates } : setting
      ))
      setEditingId(null)
      toast.success('设置更新成功')
    } catch (error) {
      console.error('Error updating setting:', error)
      toast.error('更新设置失败')
    }
  }

  const handleAddSetting = async () => {
    try {
      if (!newSetting.key || !newSetting.value) {
        toast.error('请填写完整信息')
        return
      }

      const { data, error } = await supabase
        .from('settings')
        .insert([newSetting as SettingInsert])
        .select()
        .single()

      if (error) throw error

      setSettings(prev => [...prev, data])
      setNewSetting({
        key: '',
        value: '',
        description: '',
        category: 'general',
        data_type: 'string',
        is_public: false
      })
      setShowAddForm(false)
      toast.success('设置添加成功')
    } catch (error) {
      console.error('Error adding setting:', error)
      toast.error('添加设置失败')
    }
  }

  const handleDeleteSetting = async (id: string) => {
    if (!confirm('确定要删除这个设置吗？')) return

    try {
      const { error } = await supabase
        .from('settings')
        .delete()
        .eq('id', id)

      if (error) throw error

      setSettings(prev => prev.filter(setting => setting.id !== id))
      toast.success('设置删除成功')
    } catch (error) {
      console.error('Error deleting setting:', error)
      toast.error('删除设置失败')
    }
  }

  const groupSettingsByCategory = (): SettingCategory[] => {
    const categories = {
      general: { name: '常规设置', description: '网站基本信息配置', icon: Globe, settings: [] as Setting[] },
      user: { name: '用户设置', description: '用户注册和认证配置', icon: Settings, settings: [] as Setting[] },
      database: { name: '数据库配置', description: '数据库连接和性能参数', icon: Database, settings: [] as Setting[] },
      contact: { name: '联系信息', description: '客服联系方式配置', icon: Mail, settings: [] as Setting[] },
      shipping: { name: '配送设置', description: '配送费用和规则配置', icon: Truck, settings: [] as Setting[] },
      payment: { name: '支付设置', description: '支付方式和费率配置', icon: DollarSign, settings: [] as Setting[] },
      order: { name: '订单设置', description: '订单处理规则配置', icon: Settings, settings: [] as Setting[] }
    }

    settings.forEach(setting => {
      const category = setting.category as keyof typeof categories
      if (categories[category]) {
        categories[category].settings.push(setting)
      } else {
        categories.general.settings.push(setting)
      }
    })

    // 确保用户设置分类存在，即使没有设置项也显示
    return Object.values(categories)
  }

  const renderSettingValue = (setting: Setting) => {
    if (editingId === setting.id) {
      if (setting.data_type === 'boolean') {
        return (
          <div className="flex items-center space-x-2">
            <select
              defaultValue={setting.value}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={(e) => {
                handleUpdateSetting(setting.id, { value: e.target.value })
              }}
              autoFocus
            >
              <option value="true">是</option>
              <option value="false">否</option>
            </select>
            <button
              onClick={() => setEditingId(null)}
              className="text-gray-600 hover:text-gray-900"
            >
              取消
            </button>
          </div>
        )
      }

      return (
        <div className="flex items-center space-x-2">
          <input
            type={setting.data_type === 'number' ? 'number' : 'text'}
            defaultValue={setting.value}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdateSetting(setting.id, { value: e.currentTarget.value })
              }
              if (e.key === 'Escape') {
                setEditingId(null)
              }
            }}
            autoFocus
          />
          <button
            onClick={() => {
              const input = document.querySelector(`input[value="${setting.value}"]`) as HTMLInputElement
              if (input) {
                handleUpdateSetting(setting.id, { value: input.value })
              }
            }}
            className="text-green-600 hover:text-green-900"
          >
            <Save className="h-4 w-4" />
          </button>
          <button
            onClick={() => setEditingId(null)}
            className="text-gray-600 hover:text-gray-900"
          >
            取消
          </button>
        </div>
      )
    }

    // 对于布尔值，提供快速切换功能
    if (setting.data_type === 'boolean') {
      return (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${setting.value === 'true' ? 'text-green-600' : 'text-red-600'}`}>
              {setting.value === 'true' ? '已启用' : '已禁用'}
            </span>
            <button
              onClick={() => handleUpdateSetting(setting.id, { value: setting.value === 'true' ? 'false' : 'true' })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                setting.value === 'true' ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  setting.value === 'true' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setEditingId(setting.id)}
              className="text-blue-600 hover:text-blue-900"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeleteSetting(setting.id)}
              className="text-red-600 hover:text-red-900"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )
    }

    // 对于其他类型，显示值和编辑按钮
    return (
      <div className="flex items-center justify-between">
        <span className="text-gray-900">{setting.value}</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setEditingId(setting.id)}
            className="text-blue-600 hover:text-blue-900"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteSetting(setting.id)}
            className="text-red-600 hover:text-red-900"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
            <p className="mt-1 text-sm text-gray-500">
              管理系统配置参数和数据库设置
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            添加设置
          </button>
        </div>

        {/* 添加设置表单 */}
        {showAddForm && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">添加新设置</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">设置键名</label>
                <input
                  type="text"
                  value={newSetting.key}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, key: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">设置值</label>
                <input
                  type="text"
                  value={newSetting.value}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, value: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">分类</label>
                <select
                  value={newSetting.category}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, category: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="general">常规设置</option>
                  <option value="user">用户设置</option>
                  <option value="database">数据库配置</option>
                  <option value="contact">联系信息</option>
                  <option value="shipping">配送设置</option>
                  <option value="payment">支付设置</option>
                  <option value="order">订单设置</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">数据类型</label>
                <select
                  value={newSetting.data_type}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, data_type: e.target.value as any }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="string">字符串</option>
                  <option value="number">数字</option>
                  <option value="boolean">布尔值</option>
                  <option value="json">JSON</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">描述</label>
                <input
                  type="text"
                  value={newSetting.description || ''}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newSetting.is_public}
                    onChange={(e) => setNewSetting(prev => ({ ...prev, is_public: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-900">公开设置（前端可访问）</span>
                </label>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleAddSetting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                添加
              </button>
            </div>
          </div>
        )}

        {/* 设置分类列表 */}
        <div className="space-y-6">
          {groupSettingsByCategory().map((category) => (
            <div key={category.name} className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <category.icon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">{category.name}</h2>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {category.settings.map((setting) => (
                  <div key={setting.id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-sm font-medium text-gray-900">{setting.key}</h3>
                          {setting.is_public && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              公开
                            </span>
                          )}
                        </div>
                        {setting.description && (
                          <p className="mt-1 text-sm text-gray-500">{setting.description}</p>
                        )}
                        <div className="mt-2">
                          {renderSettingValue(setting)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 数据库状态信息 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">数据库配置说明</h3>
              <p className="mt-1 text-sm text-blue-700">
                数据库配置修改后需要重启应用生效。建议在维护时间窗口进行调整。
                关键设置如数据库连接参数应谨慎修改。
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 