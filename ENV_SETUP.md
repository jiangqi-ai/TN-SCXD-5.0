# 环境变量配置指南

## 🔧 快速配置

### 1. 创建本地环境变量文件

```bash
# 复制模板文件
cp env.example .env.local
```

### 2. 获取 Supabase 配置

1. 访问 [Supabase 控制台](https://supabase.com/dashboard)
2. 选择您的项目
3. 进入 **Settings** -> **API**
4. 复制以下值：

```
Project URL: https://your-project-id.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. 配置 .env.local 文件

编辑 `.env.local` 文件，替换以下值：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-real-anon-key-here

# 服务密钥（可选，用于管理员功能）
SUPABASE_SERVICE_ROLE_KEY=your-real-service-role-key-here

# 网站 URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🔐 安全注意事项

- ✅ `.env.local` 已在 `.gitignore` 中，不会被提交到 Git
- ✅ 使用 `env.example` 作为模板文件
- ❌ **绝对不要**将真实密钥提交到 GitHub
- ❌ **绝对不要**在公共聊天或文档中分享密钥

## 🚀 部署到 Vercel

在 Vercel 部署时，您需要在 Vercel 控制台中设置环境变量：

1. 进入 Vercel 项目设置
2. 选择 **Environment Variables**
3. 添加以下变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## 📋 检查配置

运行以下命令检查配置是否正确：

```bash
npm run dev
```

如果看到 Supabase 连接错误，请检查环境变量是否正确配置。

## 🛠️ 替代方案：数据库调试

如果您想在开发过程中动态配置环境变量，可以考虑：

1. **环境变量管理组件**：创建一个管理面板来设置和查看环境变量
2. **本地存储方案**：将配置存储在浏览器本地存储中
3. **配置文件方案**：使用 JSON 配置文件（确保在 .gitignore 中）

需要我帮您实现任何一种方案吗？ 