# Vercel 部署指南

## 🚀 快速部署

### 1. 准备工作
- 确保代码已推送到 GitHub 仓库
- 注册 [Vercel](https://vercel.com) 账户
- 准备 Supabase 项目信息

### 2. 部署步骤

#### Step 1: 连接 GitHub
1. 登录 Vercel Dashboard
2. 点击 "New Project"
3. 选择您的 GitHub 仓库 `TN-SCXD-5.0`

#### Step 2: 配置项目
- **Framework Preset**: Next.js
- **Root Directory**: `./` (根目录)
- **Build Command**: `npm run build` (自动检测)
- **Output Directory**: `.next` (自动检测)

#### Step 3: 环境变量配置
在 Vercel 项目设置中添加以下环境变量：

```bash
# Supabase 配置 (必需)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 网站配置 (必需)
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

#### Step 4: 部署
1. 点击 "Deploy" 按钮
2. 等待构建完成（约 2-3 分钟）
3. 访问生成的 Vercel 域名

### 3. 配置 Supabase

#### 设置认证重定向 URL
在 Supabase Dashboard → Authentication → URL Configuration 中添加：
- Site URL: `https://your-project.vercel.app`
- Redirect URLs: `https://your-project.vercel.app/auth/callback`

### 4. 常见问题解决

#### 构建失败
- 检查环境变量是否正确设置
- 确保 Node.js 版本 >= 18.17.0
- 查看构建日志中的具体错误信息

#### 运行时错误
- 检查 Supabase URL 和密钥是否有效
- 确认数据库表结构是否正确创建
- 查看 Vercel Functions 日志

### 5. 性能优化建议

#### 启用 Edge Functions
- API 路由会自动部署为 Vercel Functions
- 静态页面会部署到 Edge Network

#### 缓存配置
项目已配置 Next.js 优化构建，包括：
- 静态页面预渲染
- 代码分割
- 图片优化

### 6. 监控和维护

#### Vercel Analytics
- 在项目设置中启用 Analytics
- 监控页面性能和用户行为

#### 自动部署
- 推送到 `main` 分支会自动触发部署
- 预览部署会为 PR 创建临时环境

---

## 📋 部署检查清单

- [ ] GitHub 仓库已更新
- [ ] Vercel 项目已创建
- [ ] 环境变量已配置
- [ ] Supabase 重定向 URL 已设置
- [ ] 构建成功完成
- [ ] 网站可正常访问
- [ ] 数据库连接正常
- [ ] 用户注册/登录功能正常

部署成功后，您的攀岩装备商店将在 `https://your-project.vercel.app` 上线！ 