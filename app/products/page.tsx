'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { useCart } from '@/store/cartStore'
import Navigation from '@/components/Navigation'
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star,
  Heart,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown,
  Package,
  Truck,
  Shield,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price: number
  stock_quantity: number
  is_active: boolean
  image_url: string
  category_id: string
  sku: string
  weight: number
  dimensions: string
  material: string
  brand: string
  features: string[]
  rating: number
  review_count: number
  created_at: string
  categories?: {
    name: string
  }
  category_name?: string
}

interface Category {
  id: string
  name: string
  description: string
  product_count: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  
  const supabase = createSupabaseClient()
  const { addItem } = useCart()

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()])
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories!products_category_id_fkey (
            name
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      const processedData = (data || []).map(product => ({
        ...product,
        category_name: product.categories?.name || '未分类',
        features: product.features || [],
        rating: 4.5, // 模拟评分
        review_count: Math.floor(Math.random() * 100) + 1 // 模拟评论数
      }))
      
      setProducts(processedData)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('加载产品失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      
      // 为每个分类计算产品数量
      const categoriesWithCount = (data || []).map(category => ({
        ...category,
        product_count: 0 // 这里可以通过另一个查询获取实际数量
      }))
      
      setCategories(categoriesWithCount)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleAddToCart = (product: Product) => {
    if (product.stock_quantity === 0) {
      toast.error('商品暂时缺货')
      return
    }
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
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

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    )
  }

  // 筛选和排序逻辑
  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.category_name === selectedCategory
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand || '')
      
      return matchesSearch && matchesCategory && matchesPrice && matchesBrand
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'name':
          return a.name.localeCompare(b.name)
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  // 分页逻辑
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // 获取所有品牌
  const allBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)))

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="pt-16 min-h-screen bg-gray-50">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="pt-16 min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">产品中心</h1>
              <p className="text-xl text-primary-100 mb-8">
                发现最优质的攀岩装备，助您征服每一座山峰
              </p>
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索产品..."
                    className="w-full pl-12 pr-4 py-3 text-gray-900 bg-white rounded-lg shadow-lg focus:ring-2 focus:ring-primary-300 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 筛选和排序工具栏 */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  筛选
                </button>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">所有分类</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">排序:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="newest">最新上架</option>
                    <option value="price-low">价格从低到高</option>
                    <option value="price-high">价格从高到低</option>
                    <option value="rating">评分最高</option>
                    <option value="name">名称排序</option>
                  </select>
                </div>

                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 高级筛选面板 */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 价格范围 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      价格范围
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="最低价"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        placeholder="最高价"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 10000 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  {/* 品牌筛选 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      品牌
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {allBrands.map(brand => (
                        <label key={brand} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedBrands(prev => [...prev, brand])
                              } else {
                                setSelectedBrands(prev => prev.filter(b => b !== brand))
                              }
                              setCurrentPage(1)
                            }}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 重置筛选 */}
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedCategory('all')
                        setPriceRange({ min: 0, max: 10000 })
                        setSelectedBrands([])
                        setCurrentPage(1)
                      }}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      重置筛选
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 产品展示区域 */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                共找到 {filteredAndSortedProducts.length} 个产品
              </p>
            </div>
          </div>

          {viewMode === 'grid' ? (
            /* 网格视图 */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image_url || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.original_price > product.price && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        优惠
                      </div>
                    )}
                    {product.stock_quantity === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">暂时缺货</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="mb-3">
                      {renderStarRating(product.rating)}
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.review_count} 评论)
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-primary-600">
                          {formatPrice(product.price)}
                        </span>
                        {product.original_price > product.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {formatPrice(product.original_price)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        库存: {product.stock_quantity}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock_quantity === 0}
                      className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {product.stock_quantity === 0 ? '暂时缺货' : '加入购物车'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 列表视图 */
            <div className="space-y-4 mb-8">
              {paginatedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={product.image_url || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            {product.description}
                          </p>
                          
                          <div className="flex items-center gap-4 mb-3">
                            {renderStarRating(product.rating)}
                            <span className="text-sm text-gray-500">
                              ({product.review_count} 评论)
                            </span>
                            <span className="text-sm text-gray-500">
                              分类: {product.category_name}
                            </span>
                            <span className="text-sm text-gray-500">
                              库存: {product.stock_quantity}
                            </span>
                          </div>
                          
                          {product.features && product.features.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {product.features.slice(0, 3).map((feature, index) => (
                                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="mb-3">
                            <span className="text-2xl font-bold text-primary-600">
                              {formatPrice(product.price)}
                            </span>
                            {product.original_price > product.price && (
                              <div className="text-sm text-gray-500 line-through">
                                {formatPrice(product.original_price)}
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock_quantity === 0}
                            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-6 rounded-lg font-medium transition-colors flex items-center gap-2"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            {product.stock_quantity === 0 ? '暂时缺货' : '加入购物车'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg ${
                    page === currentPage
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          )}

          {/* 空状态 */}
          {paginatedProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">没有找到相关产品</h3>
              <p className="text-gray-600 mb-4">尝试调整搜索条件或筛选选项</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setPriceRange({ min: 0, max: 10000 })
                  setSelectedBrands([])
                  setCurrentPage(1)
                }}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                清除所有筛选条件
              </button>
            </div>
          )}
        </div>

        {/* 服务保障 */}
        <div className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Truck className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">免费配送</h3>
                <p className="text-gray-600">满199元免费配送</p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">品质保证</h3>
                <p className="text-gray-600">正品保证，七天无理由退换</p>
              </div>
              <div className="text-center">
                <RefreshCw className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">售后服务</h3>
                <p className="text-gray-600">专业的售后服务团队</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 