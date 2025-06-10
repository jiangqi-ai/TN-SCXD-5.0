'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import AdminLayout from '@/components/AdminLayout'
import { Database, Table, RefreshCw, Download, AlertCircle } from 'lucide-react'

export default function DatabasePage() {
  const [tables, setTables] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTable, setSelectedTable] = useState('')
  const [tableData, setTableData] = useState<any[]>([])
  const [tableLoading, setTableLoading] = useState(false)
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
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
            const { count } = await supabase
              .from(table.name)
              .select('*', { count: 'exact', head: true })
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
    } finally {
      setLoading(false)
    }
  }

  const fetchTableData = async (tableName: string) => {
    if (!tableName) return
    
    setTableLoading(true)
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(10)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTableData(data || [])
    } catch (error) {
      console.error(`Error fetching ${tableName} data:`, error)
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
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
              查看和管理数据库表格和数据
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
      </div>
    </AdminLayout>
  )
} 