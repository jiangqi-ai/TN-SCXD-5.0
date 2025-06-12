'use client'

export default function ManualAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              👥 手动创建管理员账户
            </h1>
            <p className="text-gray-600">
              如果自动邀请失败，请按以下步骤手动创建管理员
            </p>
          </div>

          <div className="space-y-8">
            {/* 方法1：Supabase控制台 */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                Supabase控制台创建（推荐）
              </h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded">
                  <h3 className="font-semibold text-blue-800 mb-2">步骤：</h3>
                  <ol className="list-decimal list-inside space-y-2 text-blue-700">
                    <li>访问 <a href="https://supabase.com/dashboard" target="_blank" className="underline">Supabase控制台</a></li>
                    <li>选择您的项目</li>
                    <li>点击左侧 "Authentication" → "Users"</li>
                    <li>点击 "Invite user" 或 "Add user"</li>
                    <li>输入管理员邮箱</li>
                    <li>发送邀请或创建账户</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* 方法2：SQL创建 */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                SQL脚本创建
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-600">在Supabase SQL编辑器中执行以下脚本：</p>
                
                <div className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
                  <pre>{`-- 创建管理员用户（请修改邮箱和密码）
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  role
) VALUES (
  gen_random_uuid(),
  'admin@example.com',  -- 请修改为您的邮箱
  crypt('admin123456', gen_salt('bf')),  -- 请修改密码
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin", "full_name": "系统管理员"}',
  'authenticated'
);

-- 创建对应的profiles记录
INSERT INTO profiles (
  user_id,
  email,
  full_name,
  role
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@example.com'),
  'admin@example.com',
  '系统管理员',
  'admin'
);`}</pre>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ <strong>注意：</strong>请务必修改脚本中的邮箱和密码！
                  </p>
                </div>
              </div>
            </div>

            {/* 方法3：注册后升级 */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                注册后升级为管理员
              </h2>
              
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded">
                  <h3 className="font-semibold text-purple-800 mb-2">步骤：</h3>
                  <ol className="list-decimal list-inside space-y-2 text-purple-700">
                    <li>访问您的网站注册页面：<code className="bg-white px-2 py-1 rounded">/auth/login</code></li>
                    <li>注册一个新账户</li>
                    <li>在Supabase SQL编辑器中执行升级脚本：</li>
                  </ol>
                </div>
                
                <div className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
                  <pre>{`-- 将用户升级为管理员（请修改邮箱）
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';  -- 请修改为您的邮箱`}</pre>
                </div>
              </div>
            </div>

            {/* 验证管理员权限 */}
            <div className="border rounded-lg p-6 bg-green-50">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-green-800">
                <span className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">✓</span>
                验证管理员权限
              </h2>
              
              <div className="space-y-4">
                <p className="text-green-700">完成上述任一方法后，请验证管理员权限：</p>
                
                <ol className="list-decimal list-inside space-y-2 text-green-700">
                  <li>使用管理员账户登录网站</li>
                  <li>访问管理后台：<code className="bg-white px-2 py-1 rounded">/admin</code></li>
                  <li>确认可以访问所有管理功能</li>
                </ol>
              </div>
            </div>

            {/* 快捷链接 */}
            <div className="text-center space-y-4 pt-6 border-t">
              <h3 className="text-lg font-semibold">配置完成后</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a 
                  href="/auth/login" 
                  className="block bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                  🔑 管理员登录
                </a>
                <a 
                  href="/admin" 
                  className="block bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 transition-colors"
                >
                  ⚙️ 管理后台
                </a>
                <a 
                  href="/" 
                  className="block bg-purple-600 text-white py-3 px-4 rounded hover:bg-purple-700 transition-colors"
                >
                  🏪 查看商城
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 