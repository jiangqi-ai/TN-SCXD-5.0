# 🚀 Supabase 配置指南

## ⚠️ 当前错误说明

您遇到的错误是因为 `.env.local` 文件中缺少有效的 Supabase 配置。

## 📋 解决步骤

### 步骤 1: 创建 Supabase 项目

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 如果没有账户，点击 **"Sign up"** 注册
3. 登录后，点击 **"New Project"** 创建新项目
4. 填写项目信息：
   - **Project Name**: `climbing-gear-store`
   - **Database Password**: 设置一个强密码（请记住）
   - **Region**: 选择离您最近的区域
5. 点击 **"Create new project"** 并等待创建完成

### 步骤 2: 获取配置信息

项目创建完成后：

1. 在项目主页，点击左侧菜单的 **"Settings"**
2. 点击 **"API"** 标签页
3. 复制以下信息：

```
Project URL: https://your-project-id.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 步骤 3: 配置环境变量

1. 打开 `.env.local` 文件
2. 替换为您的真实配置：

```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 网站配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 步骤 4: 设置数据库

1. 在 Supabase Dashboard 中，点击左侧的 **"SQL Editor"**
2. 创建一个新查询，复制粘贴 `database/enhanced_schema.sql` 的内容
3. 点击 **"Run"** 执行SQL
4. 等待所有表创建完成

### 步骤 5: 验证配置

1. 保存 `.env.local` 文件
2. 重启开发服务器：
   ```bash
   npm run dev
   ```
3. 访问 http://localhost:3000 验证项目正常运行

## 🔧 临时解决方案

如果您想快速测试，可以使用以下临时配置（仅用于开发）：

1. 打开 `lib/supabase.ts`
2. 临时注释掉错误检查：

```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'temp'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'temp'

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
// }
```

**注意**: 这只是临时方案，数据库功能将无法使用，请尽快配置真实的 Supabase 项目。

## 🆘 常见问题

### Q: 创建项目后找不到配置信息？
**A**: 确保项目已完全创建完成，然后在 Settings -> API 中查找。

### Q: 项目URL格式不对？
**A**: URL应该是 `https://项目ID.supabase.co` 格式。

### Q: 密钥太长了？
**A**: 这是正常的，JWT token 通常很长，确保完整复制。

### Q: 仍然报错？
**A**: 
1. 检查 `.env.local` 文件是否在项目根目录
2. 确保没有多余的空格或换行
3. 重启开发服务器
4. 检查环境变量名称是否正确

## 📞 需要帮助？

如果按照以上步骤仍有问题，请提供：
1. 错误信息截图
2. `.env.local` 文件内容（隐藏敏感信息）
3. Supabase 项目状态 