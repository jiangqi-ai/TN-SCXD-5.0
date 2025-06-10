'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { Database } from '@/types/database'
import { useCart } from '@/store/cartStore'
import { useAuth } from '@/components/AuthProvider'
import { Mountain, Plus, Filter, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

type Product = Database['public']['Tables']['products']['Row']
type Category = Database['public']['Tables']['categories']['Row']

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const { addItem } = useCart()
  const { user } = useAuth()
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (data) {
      setCategories(data)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    let query = supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .eq('is_active', true)

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory)
    }

    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`)
    }

    const { data } = await query.order('created_at', { ascending: false })

    if (data) {
      setProducts(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [searchTerm, selectedCategory])

  const handleAddToCart = (product: Product) => {
    if (!user) {
      toast.error('请先登录')
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url || undefined,
      stock_quantity: product.stock_quantity
    })
    toast.success('已添加到购物车')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">产品中心</h1>
        
        {/* 搜索和筛选 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="搜索产品..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              className="input-field pl-10 pr-10 appearance-none bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">所有分类</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <Mountain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无产品</h3>
          <p className="text-gray-500">没有找到符合条件的产品</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="card group hover:shadow-lg transition-shadow">
              <Link href={`/products/${product.id}`}>
                <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <Mountain className="h-16 w-16 text-gray-400" />
                  )}
                </div>
              </Link>
              
              <Link href={`/products/${product.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary-600">
                  {formatPrice(product.price)}
                </span>
                
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock_quantity === 0}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {product.stock_quantity === 0 ? '缺货' : '加入购物车'}
                </button>
              </div>
              
              <div className="mt-2 text-sm text-gray-500">
                库存: {product.stock_quantity} 件
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 