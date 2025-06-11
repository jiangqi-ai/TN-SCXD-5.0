'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import AdminLayout from '@/components/AdminLayout'
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react'

interface Product {
  id: string
  name: string
  sku: string
  description: string
  specifications?: string
  price: number
  original_price?: number
  category_id: string | null
  stock_quantity: number
  min_stock_level: number
  weight?: number
  dimensions?: string
  image_url?: string
  gallery_images?: string[]
  is_active: boolean
  is_featured: boolean
  view_count: number
  sales_count: number
  tags?: string[]
  created_at: string
  updated_at: string
  category_name?: string
  categories?: {
    name: string
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const client = createSupabaseClient()
    try {
      const { data, error } = await client
        .from('products')
        .select(`
          *,
          categories!products_category_id_fkey (
            name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // 处理数据，添加分类名称
      const processedData = (data || []).map((product: any) => ({
        ...product,
        category_name: product.categories?.name || '未分类'
      }))
      
      setProducts(processedData)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('确定要删除这个产品吗？')) return

    const client = createSupabaseClient()
    try {
      const { error } = await client
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('删除产品失败')
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const client = createSupabaseClient()
    try {
      const { error } = await client
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      await fetchProducts()
    } catch (error) {
      console.error('Error updating product status:', error)
      alert('更新产品状态失败')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category_name === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(products.map(p => p.category_name))).filter(Boolean)

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
            <h1 className="text-2xl font-semibold text-gray-900">产品管理</h1>
            <p className="mt-2 text-sm text-gray-700">
              管理系统中的所有产品信息
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              添加产品
            </button>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索产品名称或描述..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">所有分类</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 产品列表 */}
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        产品信息
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        价格
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        库存
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        分类
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        创建时间
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">操作</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {product.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.stock_quantity === 0 
                              ? 'bg-red-100 text-red-800' 
                              : product.stock_quantity <= 10 
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {product.stock_quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.category_name || '未分类'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleActive(product.id, product.is_active)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.is_active 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {product.is_active ? '已启用' : '已停用'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(product.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-sm text-gray-500">
                      {searchTerm || selectedCategory !== 'all' ? '没有找到匹配的产品' : '暂无产品数据'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 