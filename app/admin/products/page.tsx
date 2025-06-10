'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { Database } from '@/types/database'
import AdminLayout from '@/components/AdminLayout'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Mountain,
  X
} from 'lucide-react'

type Product = Database['public']['Tables']['products']['Row'] & {
  categories: {
    name: string
  } | null
}
type Category = Database['public']['Tables']['categories']['Row']

interface ProductForm {
  name: string
  description: string
  price: number
  category_id: string
  stock_quantity: number
  image_url?: string
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const supabase = createSupabaseClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProductForm>()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    let query = supabase
      .from('products')
      .select(`
        *,
        categories (
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`)
    }

    const { data } = await query
    if (data) {
      setProducts(data)
    }
    setLoading(false)
  }

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (data) {
      setCategories(data)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts()
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const openModal = (product?: Product) => {
    setEditingProduct(product || null)
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        category_id: product.category_id || '',
        stock_quantity: product.stock_quantity,
        image_url: product.image_url || ''
      })
    } else {
      reset({
        name: '',
        description: '',
        price: 0,
        category_id: '',
        stock_quantity: 0,
        image_url: ''
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    reset()
  }

  const onSubmit = async (data: ProductForm) => {
    try {
      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        category_id: data.category_id,
        stock_quantity: data.stock_quantity,
        image_url: data.image_url || null,
      }

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)

        if (error) throw error
        toast.success('产品更新成功')
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData)

        if (error) throw error
        toast.success('产品创建成功')
      }

      closeModal()
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('保存失败，请重试')
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('确定要删除这个产品吗？')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      toast.success('产品删除成功')
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('删除失败，请重试')
    }
  }

  const toggleProductStatus = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !product.is_active })
        .eq('id', product.id)

      if (error) throw error
      
      toast.success(`产品已${product.is_active ? '停用' : '启用'}`)
      fetchProducts()
    } catch (error) {
      console.error('Error updating product status:', error)
      toast.error('操作失败，请重试')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price)
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">产品管理</h1>
            <p className="mt-2 text-sm text-gray-700">
              管理商城的所有产品信息
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => openModal()}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              添加产品
            </button>
          </div>
        </div>

        {/* 搜索 */}
        <div className="mt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="搜索产品..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 产品表格 */}
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        产品
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        分类
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        价格
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        库存
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">操作</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          暂无产品
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                  {product.image_url ? (
                                    <img
                                      src={product.image_url}
                                      alt={product.name}
                                      className="h-12 w-12 object-cover rounded-lg"
                                    />
                                  ) : (
                                    <Mountain className="h-6 w-6 text-gray-400" />
                                  )}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                  {product.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.categories?.name || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPrice(product.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleProductStatus(product)}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                product.is_active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {product.is_active ? '已启用' : '已停用'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openModal(product)}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteProduct(product.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* 产品编辑模态框 */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal}></div>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {editingProduct ? '编辑产品' : '添加产品'}
                      </h3>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">产品名称</label>
                        <input
                          {...register('name', { required: '请输入产品名称' })}
                          className="input-field"
                          placeholder="请输入产品名称"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">产品描述</label>
                        <textarea
                          {...register('description', { required: '请输入产品描述' })}
                          rows={3}
                          className="input-field"
                          placeholder="请输入产品描述"
                        />
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">价格</label>
                          <input
                            {...register('price', { 
                              required: '请输入价格',
                              min: { value: 0, message: '价格不能为负数' }
                            })}
                            type="number"
                            step="0.01"
                            className="input-field"
                            placeholder="0.00"
                          />
                          {errors.price && (
                            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">库存数量</label>
                          <input
                            {...register('stock_quantity', { 
                              required: '请输入库存数量',
                              min: { value: 0, message: '库存不能为负数' }
                            })}
                            type="number"
                            className="input-field"
                            placeholder="0"
                          />
                          {errors.stock_quantity && (
                            <p className="mt-1 text-sm text-red-600">{errors.stock_quantity.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">产品分类</label>
                        <select
                          {...register('category_id', { required: '请选择产品分类' })}
                          className="input-field"
                        >
                          <option value="">请选择分类</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {errors.category_id && (
                          <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">产品图片URL</label>
                        <input
                          {...register('image_url')}
                          type="url"
                          className="input-field"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary sm:ml-3 disabled:opacity-50"
                    >
                      {isSubmitting ? '保存中...' : (editingProduct ? '更新' : '创建')}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="btn-secondary"
                    >
                      取消
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
} 