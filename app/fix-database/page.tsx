'use client'

import { useState } from 'react'

export default function FixDatabasePage() {
  const [message, setMessage] = useState('')
  const [showScript, setShowScript] = useState(false)

  const fixScript = `-- 修复数据库结构脚本
-- 请在Supabase SQL编辑器中执行以下脚本

-- 1. 检查profiles表是否存在，如果不存在则创建
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. 如果表已存在但缺少列，则添加缺少的列
DO $$ 
BEGIN
  -- 添加user_id列（如果不存在）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- 添加email列（如果不存在）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email TEXT;
  END IF;

  -- 添加full_name列（如果不存在）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN full_name TEXT;
  END IF;

  -- 添加role列（如果不存在）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
  END IF;

  -- 添加created_at列（如果不存在）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;

  -- 添加updated_at列（如果不存在）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;
END $$;

-- 3. 创建其他必要的表

-- 创建categories表（攀岩装备分类）
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 创建products表（攀岩装备产品）
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  stock_quantity INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 创建orders表（订单）
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  shipping_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 创建order_items表（订单项目）
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. 设置行级安全策略（简化版本）
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 创建简单的RLS策略
CREATE POLICY "Allow all authenticated users" ON profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all authenticated users" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all authenticated users" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all authenticated users" ON orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all authenticated users" ON order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. 插入攀岩装备基础数据
INSERT INTO categories (name, description) VALUES
  ('攀岩绳索', '动力绳、静力绳、辅绳等各种攀岩绳索')
ON CONFLICT DO NOTHING;

INSERT INTO categories (name, description) VALUES
  ('保护装备', '安全带、头盔、保护器等安全保护装备')
ON CONFLICT DO NOTHING;

INSERT INTO categories (name, description) VALUES
  ('攀登硬件', '岩钉、快挂、岩塞、铁锁等攀登硬件')
ON CONFLICT DO NOTHING;

INSERT INTO categories (name, description) VALUES
  ('攀岩鞋', '各种类型的专业攀岩鞋')
ON CONFLICT DO NOTHING;

INSERT INTO categories (name, description) VALUES
  ('训练装备', '指力板、训练器材等室内训练装备')
ON CONFLICT DO NOTHING;

-- 6. 创建触发器更新updated_at字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为相关表创建更新触发器
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 完成！
SELECT 'Database structure fixed successfully!' as result;`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fixScript).then(() => {
      setMessage('✅ SQL脚本已复制到剪贴板！')
    }).catch(() => {
      setMessage('❌ 复制失败，请手动选择复制')
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🔧 数据库结构修复
            </h1>
            <p className="text-gray-600">
              修复profiles表缺少user_id列的问题
            </p>
          </div>

          <div className="space-y-6">
            {/* 问题说明 */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-red-800 mb-3">
                ❌ 检测到的问题
              </h2>
              <div className="text-red-700">
                <p className="mb-2">错误信息：</p>
                <code className="bg-red-100 px-2 py-1 rounded text-sm">
                  column "user_id" of relation "profiles" does not exist
                </code>
                <p className="mt-3">
                  这说明数据库中的profiles表结构不完整，缺少必要的字段。
                </p>
              </div>
            </div>

            {/* 解决方案 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-800 mb-3">
                ✅ 解决方案
              </h2>
              <div className="text-blue-700 space-y-3">
                <p>我已经为您准备了完整的数据库修复脚本，包括：</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>修复profiles表结构</li>
                  <li>创建攀岩装备商城所需的所有表</li>
                  <li>设置合适的权限策略</li>
                  <li>插入攀岩装备基础分类数据</li>
                </ul>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="text-center space-y-4">
              <button
                onClick={() => setShowScript(!showScript)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showScript ? '隐藏' : '显示'} SQL修复脚本
              </button>

              {showScript && (
                <button
                  onClick={copyToClipboard}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors ml-4"
                >
                  📋 复制脚本到剪贴板
                </button>
              )}
            </div>

            {/* SQL脚本显示 */}
            {showScript && (
              <div className="space-y-4">
                <div className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">
                  <pre className="text-xs whitespace-pre-wrap">{fixScript}</pre>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">📋 执行步骤：</h3>
                  <ol className="list-decimal list-inside space-y-2 text-yellow-700">
                    <li>复制上面的SQL脚本</li>
                    <li>访问 <a href="https://supabase.com/dashboard" target="_blank" className="underline">Supabase控制台</a></li>
                    <li>选择您的项目</li>
                    <li>点击左侧 "SQL Editor"</li>
                    <li>粘贴脚本并点击 "Run" 执行</li>
                    <li>确认看到 "Database structure fixed successfully!" 消息</li>
                  </ol>
                </div>
              </div>
            )}

            {/* 消息显示 */}
            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message}
              </div>
            )}

            {/* 执行完成后的操作 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-green-800 mb-3">
                🎯 执行完成后
              </h2>
              <div className="text-green-700 space-y-3">
                <p>数据库修复完成后，您可以：</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a 
                    href="/quick-config" 
                    className="block bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 text-center"
                  >
                    🔧 返回快速配置
                  </a>
                  <a 
                    href="/manual-admin" 
                    className="block bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 text-center"
                  >
                    👥 创建管理员账户
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 