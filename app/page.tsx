import Link from 'next/link'
import Image from 'next/image'
import { Mountain, Shield, Truck, Award } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: Shield,
      title: '品质保证',
      description: '所有产品均经过严格质量检测，确保攀岩安全'
    },
    {
      icon: Truck,
      title: '快速配送',
      description: '全国包邮，48小时内发货，让您尽快享受攀岩乐趣'
    },
    {
      icon: Award,
      title: '专业服务',
      description: '专业团队提供技术支持和产品咨询服务'
    },
    {
      icon: Mountain,
      title: '户外体验',
      description: '定期组织攀岩活动，与同好交流经验'
    }
  ]

  const categories = [
    {
      name: '攀岩鞋',
      image: '/images/climbing-shoes.jpg',
      description: '专业攀岩鞋，提供优异抓地力'
    },
    {
      name: '安全带',
      image: '/images/harness.jpg',
      description: '舒适安全带，保障攀岩安全'
    },
    {
      name: '头盔',
      image: '/images/helmet.jpg',
      description: '轻量化头盔，全方位头部保护'
    },
    {
      name: '绳索',
      image: '/images/rope.jpg',
      description: '高强度动力绳，值得信赖'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-600">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            攀登极限
            <br />
            <span className="text-primary-300">征服高峰</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            专业攀岩装备，助您安全攀登每一座山峰
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              浏览产品
            </Link>
            <Link
              href="/auth/register"
              className="bg-white hover:bg-gray-100 text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              立即注册
            </Link>

            <Link
              href="/init"
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              系统初始化
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">为什么选择我们</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              我们致力于为攀岩爱好者提供最优质的装备和服务
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">产品分类</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              从基础装备到专业器材，满足不同水平攀岩者的需求
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden group-hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <Mountain className="h-16 w-16 text-gray-400" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">准备开始您的攀岩之旅？</h2>
          <p className="text-xl text-primary-100 mb-8">
            加入我们的社区，获取专业指导和优质装备
          </p>
          <Link
            href="/products"
            className="bg-white hover:bg-gray-100 text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-block"
          >
            立即购买
          </Link>
        </div>
      </section>
    </div>
  )
} 