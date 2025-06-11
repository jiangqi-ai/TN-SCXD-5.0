import Link from 'next/link'
import Image from 'next/image'
import { Mountain, Shield, Truck, Award } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: Shield,
      title: '安全可靠',
      description: '系统采用先进的安全技术，保障数据安全'
    },
    {
      icon: Truck,
      title: '快速部署',
      description: '简单配置即可快速部署，节省开发时间'
    },
    {
      icon: Award,
      title: '专业服务',
      description: '提供专业的技术支持和咨询服务'
    },
    {
      icon: Mountain,
      title: '稳定高效',
      description: '系统稳定可靠，性能优异，支持高并发'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-600">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            TN-SCXD-5.0
            <br />
            <span className="text-primary-300">系统模板</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            专业的系统开发模板，助您快速构建现代化应用
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/auth/login"
              className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              立即登录
            </Link>
            <Link href="/products" className="text-sm font-semibold leading-6 text-gray-900">
              浏览产品 <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">系统特点</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              我们致力于提供最优质的系统模板和开发服务
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

      {/* System Info Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">系统功能</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              完整的用户管理和系统配置功能
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">用户认证</h3>
              <p className="text-gray-600">完整的用户注册、登录和权限管理系统</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Mountain className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">数据库管理</h3>
              <p className="text-gray-600">灵活的数据库配置和管理功能</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">系统设置</h3>
              <p className="text-gray-600">全面的系统配置和管理界面</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">准备开始使用系统？</h2>
          <p className="text-xl text-primary-100 mb-8">
            立即登录账户，体验完整的系统功能
          </p>
          <Link
            href="/auth/login"
            className="bg-white hover:bg-gray-100 text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-block"
          >
            立即登录
          </Link>
        </div>
      </section>
    </div>
  )
} 