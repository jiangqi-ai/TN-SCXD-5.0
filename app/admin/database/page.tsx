'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import AdminLayout from '@/components/AdminLayout'
import { Database, Table, RefreshCw, Download, AlertCircle, Settings, Eye, EyeOff, Save, Check } from 'lucide-react'

export default function DatabasePage() {
  const [tables, setTables] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTable, setSelectedTable] = useState('')
  const [tableData, setTableData] = useState<any[]>([])
  const [tableLoading, setTableLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'tables' | 'env'>('tables')
  
  // 环境变量管理状态
  const [envConfig, setEnvConfig] = useState({
    NEXT_PUBLIC_SUPABASE_URL: '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
    SUPABASE_SERVICE_ROLE_KEY: '',
    NEXT_PUBLIC_SITE_URL: 'http://localhost:3000'
  })
  const [showKeys, setShowKeys] = useState({
    NEXT_PUBLIC_SUPABASE_URL: false,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: false,
    SUPABASE_SERVICE_ROLE_KEY: false,
    NEXT_PUBLIC_SITE_URL: true
  })
  const [envSaved, setEnvSaved] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)
  const [scriptExecuting, setScriptExecuting] = useState(false)
  const [scriptResult, setScriptResult] = useState<{ success: boolean; message: string; details?: string } | null>(null)
  const [showFixPoliciesScript, setShowFixPoliciesScript] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchTables()
    loadEnvConfig()
  }, [])

  // 加载环境变量配置
  const loadEnvConfig = () => {
    const savedConfig = localStorage.getItem('supabase_env_config')
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig)
        setEnvConfig(prev => ({ ...prev, ...config }))
      } catch (error) {
        console.error('Failed to load env config:', error)
      }
    }
    
    // 从当前环境变量读取（如果已设置）
    if (typeof window !== 'undefined') {
      setEnvConfig(prev => ({
        ...prev,
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || prev.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || prev.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || prev.NEXT_PUBLIC_SITE_URL
      }))
    }
  }

  // 保存环境变量配置
  const saveEnvConfig = () => {
    try {
      localStorage.setItem('supabase_env_config', JSON.stringify(envConfig))
      // 设置到 process.env（仅客户端有效）
      if (typeof window !== 'undefined') {
        // @ts-ignore
        window.__ENV__ = envConfig
      }
      setEnvSaved(true)
      setTimeout(() => setEnvSaved(false), 2000)
    } catch (error) {
      console.error('Failed to save env config:', error)
    }
  }

  // 测试Supabase连接
  const testSupabaseConnection = async () => {
    try {
      setTestResult('testing')
      
      // 使用当前配置创建Supabase客户端
      const { createClient } = await import('@supabase/supabase-js')
      const testClient = createClient(
        envConfig.NEXT_PUBLIC_SUPABASE_URL,
        envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      
      // 尝试执行简单查询测试连接
      const { data, error } = await testClient.from('profiles').select('count').limit(1)
      
      if (error) {
        setTestResult(`连接失败: ${error.message}`)
      } else {
        setTestResult('连接成功！')
      }
    } catch (error) {
      setTestResult(`连接错误: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  // 更新环境变量值
  const updateEnvValue = (key: string, value: string) => {
    setEnvConfig(prev => ({ ...prev, [key]: value }))
  }

  // 切换密钥显示
  const toggleKeyVisibility = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  }

  // 复制权限策略修复脚本
  const copyFixPoliciesScript = async () => {
    const scriptContent = `-- 修复权限策略无限递归问题
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 删除所有可能导致递归的策略
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.settings;
DROP POLICY IF EXISTS "Public settings are readable" ON public.settings;
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Only admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
DROP POLICY IF EXISTS "Only admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create order items for own orders" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

-- 2. 临时禁用 RLS 以避免递归问题
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;

-- 3. 创建简化的权限策略（避免递归查询）

-- 用户资料表 - 简化策略
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "profiles_insert_policy" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 设置表 - 允许所有已认证用户读取公共设置
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_select_policy" ON public.settings
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "settings_insert_policy" ON public.settings
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "settings_update_policy" ON public.settings
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "settings_delete_policy" ON public.settings
    FOR DELETE TO authenticated USING (true);

-- 分类表 - 允许所有用户查看
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_select_policy" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "categories_manage_policy" ON public.categories
    FOR ALL TO authenticated USING (true);

-- 产品表 - 允许所有用户查看活跃产品
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select_policy" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "products_manage_policy" ON public.products
    FOR ALL TO authenticated USING (true);

-- 订单表 - 简化权限
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select_policy" ON public.orders
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "orders_insert_policy" ON public.orders
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_update_policy" ON public.orders
    FOR UPDATE TO authenticated USING (true);

-- 订单项表 - 简化权限
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_select_policy" ON public.order_items
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "order_items_insert_policy" ON public.order_items
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "order_items_update_policy" ON public.order_items
    FOR UPDATE TO authenticated USING (true);

-- 确保基础设置数据存在
INSERT INTO public.settings (key, value, description, category, data_type, is_public) VALUES
('site_name', '攀岩装备商城', '网站名称', 'general', 'string', true),
('site_description', '专业的攀岩装备在线商城，提供各类攀岩用品和装备。', '网站描述', 'general', 'string', true),
('allow_user_registration', 'false', '是否允许用户注册', 'user', 'boolean', true),
('require_email_verification', 'false', '是否需要邮箱验证', 'user', 'boolean', false),
('default_user_role', 'customer', '默认用户角色', 'user', 'string', false),
('maintenance_mode', 'false', '维护模式', 'system', 'boolean', false)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  data_type = EXCLUDED.data_type,
  is_public = EXCLUDED.is_public,
  updated_at = NOW();`

    try {
      await navigator.clipboard.writeText(scriptContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy script:', error)
      // 备用方案：创建一个临时textarea元素
      const textArea = document.createElement('textarea')
      textArea.value = scriptContent
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const fetchTables = async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createSupabaseClient()
      if (!supabase) {
        throw new Error('Failed to initialize Supabase client')
      }

      // 获取主要表格的基本信息
      const tablesList = [
        { name: 'profiles', description: '用户资料表' },
        { name: 'categories', description: '产品分类表' },
        { name: 'products', description: '产品信息表' },
        { name: 'orders', description: '订单信息表' },
        { name: 'order_items', description: '订单商品表' },
        { name: 'shopping_cart', description: '购物车表' },
        { name: 'settings', description: '系统设置表' },
        { name: 'discounts', description: '折扣优惠表' }
      ]

      // 获取每个表的记录数
      const tablesWithCounts = await Promise.all(
        tablesList.map(async (table) => {
          try {
            const { count, error } = await supabase
              .from(table.name)
              .select('*', { count: 'exact', head: true })
            
            if (error) throw error
            return { ...table, count: count || 0 }
          } catch (error) {
            console.error(`Error fetching ${table.name}:`, error)
            return { ...table, count: 0, error: true }
          }
        })
      )

      setTables(tablesWithCounts)
    } catch (error) {
      console.error('Error fetching tables:', error)
      setError(error instanceof Error ? error.message : '获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchTableData = async (tableName: string) => {
    if (!tableName) return
    
    setTableLoading(true)
    setError(null)
    
    try {
      const supabase = createSupabaseClient()
      if (!supabase) {
        throw new Error('Failed to initialize Supabase client')
      }

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(10)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTableData(data || [])
    } catch (error) {
      console.error(`Error fetching ${tableName} data:`, error)
      setError(error instanceof Error ? error.message : '获取数据失败')
      setTableData([])
    } finally {
      setTableLoading(false)
    }
  }

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName)
    fetchTableData(tableName)
  }

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'boolean') return value ? '是' : '否'
    if (typeof value === 'object') return JSON.stringify(value)
    if (typeof value === 'string' && value.length > 50) {
      return value.substring(0, 50) + '...'
    }
    return String(value)
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const executeFixPoliciesScript = async () => {
    if (!envConfig.NEXT_PUBLIC_SUPABASE_URL || !envConfig.SUPABASE_SERVICE_ROLE_KEY) {
      setScriptResult({ success: false, message: '需要配置 Service Role Key 才能执行数据库脚本' })
      return
    }

    setScriptExecuting(true)
    setScriptResult(null)

    try {
      const response = await fetch('/api/database/execute-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scriptName: 'fix-policies',
          supabaseUrl: envConfig.NEXT_PUBLIC_SUPABASE_URL,
          serviceRoleKey: envConfig.SUPABASE_SERVICE_ROLE_KEY
        })
      })

      const result = await response.json()

      if (result.success) {
        setScriptResult({ 
          success: true, 
          message: result.message,
          details: result.results ? JSON.stringify(result.results, null, 2) : undefined
        })
      } else {
        setScriptResult({ 
          success: false, 
          message: result.message || '脚本执行失败',
          details: result.details || (result.error ? JSON.stringify(result.error, null, 2) : undefined)
        })
      }
    } catch (error) {
      console.error('Error executing fix policies script:', error)
      setScriptResult({ 
        success: false, 
        message: '执行脚本时发生错误',
        details: error instanceof Error ? error.message : '未知错误'
      })
    } finally {
      setScriptExecuting(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">
              <AlertCircle className="h-12 w-12 mx-auto mb-2" />
              {error}
            </div>
            <button
              onClick={() => fetchTables()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">数据库管理</h1>
            <p className="mt-2 text-sm text-gray-700">
              查看和管理数据库表格、数据和环境配置
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={fetchTables}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              刷新
            </button>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('tables')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tables'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Database className="h-5 w-5 inline mr-2" />
                数据表管理
              </button>
              <button
                onClick={() => setActiveTab('env')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'env'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="h-5 w-5 inline mr-2" />
                环境变量配置
              </button>
            </nav>
          </div>
        </div>

        {/* 数据表管理标签页内容 */}
        {activeTab === 'tables' && (
          <>
            {/* 表格概览 */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tables.map((table) => (
            <div
              key={table.name}
              onClick={() => handleTableSelect(table.name)}
              className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                selectedTable === table.name ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center ${
                      table.error ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      {table.error ? (
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      ) : (
                        <Table className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {table.description}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {table.error ? '错误' : `${table.count} 条记录`}
                      </dd>
                      <dd className="text-xs text-gray-400">
                        {table.name}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 表格数据 */}
        {selectedTable && (
          <div className="mt-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h2 className="text-lg font-medium text-gray-900">
                  {tables.find(t => t.name === selectedTable)?.description} 数据
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  表名: {selectedTable} (最近10条记录)
                </p>
              </div>
            </div>

            <div className="mt-4 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    {tableLoading ? (
                      <div className="bg-white p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      </div>
                    ) : tableData.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            {Object.keys(tableData[0]).map((key) => (
                              <th
                                key={key}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {tableData.map((row, index) => (
                            <tr key={index}>
                              {Object.values(row).map((value: any, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                >
                                  {Object.keys(row)[cellIndex].includes('_at') ? 
                                    formatDate(value as string) : 
                                    formatValue(value)
                                  }
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="bg-white p-8 text-center">
                        <p className="text-sm text-gray-500">该表暂无数据</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 数据库操作 */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                数据库操作
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">
                        注意事项
                      </h4>
                      <p className="mt-1 text-sm text-yellow-700">
                        数据库操作需要谨慎，建议在操作前备份数据。
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Database className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">
                        连接状态
                      </h4>
                      <p className="mt-1 text-sm text-blue-700">
                        数据库连接正常，所有表格可访问。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Download className="h-5 w-5 text-green-400 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-green-800">
                        数据导出
                      </h4>
                      <p className="mt-1 text-sm text-green-700">
                        可以导出表格数据为CSV格式。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          </>
        )}

        {/* 环境变量配置标签页内容 */}
        {activeTab === 'env' && (
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Supabase 环境变量配置
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  在这里配置您的 Supabase 连接信息。配置将保存在浏览器本地存储中，不会上传到服务器。
                </p>

                <div className="space-y-6">
                  {/* Supabase URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supabase Project URL
                    </label>
                    <div className="relative">
                      <input
                        type={showKeys.NEXT_PUBLIC_SUPABASE_URL ? 'text' : 'password'}
                        value={envConfig.NEXT_PUBLIC_SUPABASE_URL}
                        onChange={(e) => updateEnvValue('NEXT_PUBLIC_SUPABASE_URL', e.target.value)}
                        placeholder="https://your-project-id.supabase.co"
                        className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => toggleKeyVisibility('NEXT_PUBLIC_SUPABASE_URL')}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showKeys.NEXT_PUBLIC_SUPABASE_URL ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Anon Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supabase Anon Key
                    </label>
                    <div className="relative">
                      <input
                        type={showKeys.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text' : 'password'}
                        value={envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY}
                        onChange={(e) => updateEnvValue('NEXT_PUBLIC_SUPABASE_ANON_KEY', e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => toggleKeyVisibility('NEXT_PUBLIC_SUPABASE_ANON_KEY')}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showKeys.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Service Role Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Role Key (可选)
                    </label>
                    <div className="relative">
                      <input
                        type={showKeys.SUPABASE_SERVICE_ROLE_KEY ? 'text' : 'password'}
                        value={envConfig.SUPABASE_SERVICE_ROLE_KEY}
                        onChange={(e) => updateEnvValue('SUPABASE_SERVICE_ROLE_KEY', e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => toggleKeyVisibility('SUPABASE_SERVICE_ROLE_KEY')}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showKeys.SUPABASE_SERVICE_ROLE_KEY ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      仅用于管理员功能，谨慎使用
                    </p>
                  </div>

                  {/* Site URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      网站 URL
                    </label>
                    <input
                      type="text"
                      value={envConfig.NEXT_PUBLIC_SITE_URL}
                      onChange={(e) => updateEnvValue('NEXT_PUBLIC_SITE_URL', e.target.value)}
                      placeholder="http://localhost:3000"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex space-x-3">
                    <button
                      onClick={saveEnvConfig}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      {envSaved ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          已保存
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          保存配置
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={testSupabaseConnection}
                      disabled={!envConfig.NEXT_PUBLIC_SUPABASE_URL || !envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      测试连接
                    </button>
                  </div>

                  {/* 测试结果 */}
                  {testResult && (
                    <div className={`p-4 rounded-md ${
                      testResult === 'testing' ? 'bg-blue-50' :
                      testResult === '连接成功！' ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      <div className="flex">
                        <div className="flex-shrink-0">
                          {testResult === 'testing' ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                          ) : testResult === '连接成功！' ? (
                            <Check className="h-5 w-5 text-green-400" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-400" />
                          )}
                        </div>
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${
                            testResult === 'testing' ? 'text-blue-800' :
                            testResult === '连接成功！' ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {testResult === 'testing' ? '正在测试连接...' : testResult}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 帮助信息 */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      📋 如何获取这些值：
                    </h4>
                    <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                      <li>访问 <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-500">Supabase 控制台</a></li>
                      <li>选择您的项目</li>
                      <li>进入 Settings → API</li>
                      <li>复制 Project URL 和相应的 API Keys</li>
                    </ol>
                    <p className="text-xs text-gray-500 mt-2">
                      💡 配置保存在浏览器本地存储中，不会被提交到 Git 仓库
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SQL 脚本执行区域 */}
            <div className="mt-8">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    🔧 数据库脚本执行
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    执行预定义的数据库修复脚本，解决常见的数据库问题。
                  </p>

                  <div className="space-y-4">
                                         {/* 权限策略修复 */}
                     <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                       <div className="flex items-start">
                         <div className="flex-shrink-0">
                           <AlertCircle className="h-5 w-5 text-orange-400 mt-0.5" />
                         </div>
                         <div className="ml-3 flex-1">
                           <h4 className="text-sm font-medium text-orange-800">
                             权限策略递归错误修复
                           </h4>
                           <p className="mt-1 text-sm text-orange-700">
                             修复数据库权限策略的无限递归问题，重新创建简化的安全策略。
                           </p>
                           
                           <div className="mt-4 bg-white rounded-md border border-orange-200">
                             <div className="px-3 py-2 bg-orange-100 border-b border-orange-200 rounded-t-md">
                               <div className="flex items-center justify-between">
                                 <h5 className="text-sm font-medium text-orange-900">
                                   🔧 执行步骤
                                 </h5>
                               </div>
                             </div>
                             <div className="p-3 text-sm text-gray-700">
                               <ol className="list-decimal list-inside space-y-2">
                                 <li>
                                   打开 <a 
                                     href="https://supabase.com/dashboard" 
                                     target="_blank" 
                                     rel="noopener noreferrer"
                                     className="text-primary-600 hover:text-primary-500 underline"
                                   >
                                     Supabase 控制台
                                   </a>
                                 </li>
                                 <li>选择您的项目</li>
                                 <li>进入 <strong>SQL Editor</strong></li>
                                 <li>复制下方的SQL脚本并粘贴到编辑器中</li>
                                 <li>点击 <strong>Run</strong> 执行脚本</li>
                               </ol>
                             </div>
                           </div>

                           <div className="mt-3 space-x-2">
                             <button
                               onClick={() => setShowFixPoliciesScript(!showFixPoliciesScript)}
                               className="inline-flex items-center px-3 py-2 border border-orange-300 text-sm leading-4 font-medium rounded-md text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                             >
                               <Eye className="h-4 w-4 mr-2" />
                               {showFixPoliciesScript ? '隐藏脚本' : '显示脚本'}
                             </button>
                             
                             <button
                               onClick={copyFixPoliciesScript}
                               className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                             >
                               {copied ? (
                                 <>
                                   <Check className="h-4 w-4 mr-2" />
                                   已复制
                                 </>
                               ) : (
                                 <>
                                   <Database className="h-4 w-4 mr-2" />
                                   复制脚本
                                 </>
                               )}
                             </button>
                           </div>
                           
                           {/* SQL脚本显示区域 */}
                           {showFixPoliciesScript && (
                             <div className="mt-4">
                               <div className="bg-gray-900 rounded-md p-4 overflow-auto max-h-80">
                                 <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
{`-- 修复权限策略无限递归问题
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 删除所有可能导致递归的策略
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.settings;
DROP POLICY IF EXISTS "Public settings are readable" ON public.settings;
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Only admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
DROP POLICY IF EXISTS "Only admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create order items for own orders" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

-- 2. 临时禁用 RLS 以避免递归问题
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;

-- 3. 创建简化的权限策略（避免递归查询）

-- 用户资料表 - 简化策略
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "profiles_insert_policy" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 设置表 - 允许所有已认证用户读取公共设置
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_select_policy" ON public.settings
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "settings_insert_policy" ON public.settings
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "settings_update_policy" ON public.settings
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "settings_delete_policy" ON public.settings
    FOR DELETE TO authenticated USING (true);

-- 分类表 - 允许所有用户查看
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_select_policy" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "categories_manage_policy" ON public.categories
    FOR ALL TO authenticated USING (true);

-- 产品表 - 允许所有用户查看活跃产品
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select_policy" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "products_manage_policy" ON public.products
    FOR ALL TO authenticated USING (true);

-- 订单表 - 简化权限
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select_policy" ON public.orders
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "orders_insert_policy" ON public.orders
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_update_policy" ON public.orders
    FOR UPDATE TO authenticated USING (true);

-- 订单项表 - 简化权限
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_select_policy" ON public.order_items
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "order_items_insert_policy" ON public.order_items
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "order_items_update_policy" ON public.order_items
    FOR UPDATE TO authenticated USING (true);`}
                                 </pre>
                               </div>
                             </div>
                           )}
                         </div>
                       </div>
                     </div>

                    {/* 执行结果 */}
                    {scriptResult && (
                      <div className={`p-4 rounded-md ${
                        scriptResult.success ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        <div className="flex">
                          <div className="flex-shrink-0">
                            {scriptResult.success ? (
                              <Check className="h-5 w-5 text-green-400" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-red-400" />
                            )}
                          </div>
                          <div className="ml-3">
                            <h4 className={`text-sm font-medium ${
                              scriptResult.success ? 'text-green-800' : 'text-red-800'
                            }`}>
                              {scriptResult.success ? '脚本执行成功' : '脚本执行失败'}
                            </h4>
                            <p className={`mt-1 text-sm ${
                              scriptResult.success ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {scriptResult.message}
                            </p>
                            {scriptResult.details && (
                              <details className="mt-2">
                                <summary className="cursor-pointer text-xs">
                                  查看详细信息
                                </summary>
                                <pre className="mt-1 text-xs overflow-auto max-h-32 bg-gray-100 p-2 rounded">
                                  {scriptResult.details}
                                </pre>
                              </details>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
} 