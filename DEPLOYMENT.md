# 攀岩装备在线下单系统 - 部署指南

## 🚀 快速部署到 Vercel + Supabase

### 1. 准备工作

确保您有以下账号：
- [GitHub](https://github.com) 账号
- [Vercel](https://vercel.com) 账号
- [Supabase](https://supabase.com) 账号

### 2. 设置 Supabase 数据库

#### 2.1 创建 Supabase 项目
1. 访问 [supabase.com](https://supabase.com)
2. 点击 "New Project"
3. 选择组织，输入项目名称和密码
4. 选择地区（建议选择 Singapore 以获得更好的国内访问速度）
5. 等待项目创建完成

#### 2.2 配置数据库
1. 在 Supabase 控制台，进入 "SQL Editor"
2. 复制 `database/schema.sql` 文件的全部内容
3. 粘贴到 SQL 编辑器中并执行
4. 确认所有表和策略都创建成功

#### 2.3 获取 API 密钥
1. 进入项目的 "Settings" → "API"
2. 复制以下信息：
   - Project URL
   - anon public key
   - service_role key (仅用于服务端操作)

### 3. 部署到 Vercel

#### 3.1 准备代码仓库
1. 将代码推送到 GitHub 仓库
2. 确保所有文件都已提交

#### 3.2 连接 Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Import Project"
3. 选择您的 GitHub 仓库
4. 项目设置：
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### 3.3 配置环境变量
在 Vercel 项目设置中添加以下环境变量：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 站点 URL
NEXT_PUBLIC_SITE_URL=your_vercel_domain
```

#### 3.4 部署
1. 点击 "Deploy" 开始部署
2. 等待构建和部署完成
3. 获取您的 Vercel 域名

### 4. 配置 Supabase 认证

#### 4.1 设置重定向 URL
1. 在 Supabase 控制台，进入 "Authentication" → "Settings"
2. 在 "Site URL" 中设置您的 Vercel 域名
3. 在 "Redirect URLs" 中添加：
   ```
   https://your-domain.vercel.app/auth/callback
   https://your-domain.vercel.app/**
   ```

#### 4.2 配置邮箱模板（可选）
1. 进入 "Authentication" → "Email Templates"
2. 自定义注册确认邮件和重置密码邮件模板

### 5. 创建管理员账户

#### 5.1 注册第一个管理员
1. 访问您的网站
2. 注册一个新账户
3. 确认邮箱（检查垃圾邮件文件夹）

#### 5.2 设置管理员权限
1. 在 Supabase 控制台，进入 "Table Editor"
2. 找到 `profiles` 表
3. 找到您刚注册的用户记录
4. 将 `role` 字段从 `user` 改为 `admin`
5. 保存更改

### 6. 测试系统功能

#### 6.1 基础功能测试
- [ ] 用户注册/登录
- [ ] 产品浏览
- [ ] 购物车功能
- [ ] 订单创建

#### 6.2 管理功能测试
- [ ] 管理后台访问
- [ ] 产品管理
- [ ] 订单管理
- [ ] 用户管理

### 7. 生产环境优化

#### 7.1 域名配置
1. 在 Vercel 中添加自定义域名
2. 配置 DNS 记录
3. 更新环境变量中的 `NEXT_PUBLIC_SITE_URL`

#### 7.2 数据库优化
1. 在 Supabase 中配置数据库备份
2. 设置监控和告警
3. 考虑升级到 Pro 计划以获得更好的性能

#### 7.3 安全设置
1. 定期检查 RLS 策略
2. 监控 API 使用情况
3. 设置速率限制

### 8. 监控和维护

#### 8.1 性能监控
- 使用 Vercel Analytics 监控网站性能
- 在 Supabase 控制台监控数据库性能
- 设置错误追踪

#### 8.2 数据备份
- 启用 Supabase 自动备份
- 定期导出重要数据
- 测试恢复流程

#### 8.3 更新流程
1. 在本地测试新功能
2. 推送到 GitHub
3. Vercel 自动部署
4. 验证生产环境

## 🔧 常见问题

### Q: 部署后无法访问管理后台？
A: 确保您已经将用户角色设置为 `admin`，并且清除浏览器缓存重新登录。

### Q: 邮箱验证邮件收不到？
A: 检查垃圾邮件文件夹，或在 Supabase 认证设置中关闭邮箱验证（仅开发环境）。

### Q: 图片上传不了？
A: 当前版本使用外部图片链接，请确保图片 URL 可以正常访问。

### Q: 数据库连接错误？
A: 检查环境变量是否正确设置，特别是 Supabase URL 和 API 密钥。

## 📞 技术支持

如果遇到问题，请：
1. 检查 Vercel 和 Supabase 的日志
2. 确认环境变量配置正确
3. 查看浏览器控制台错误信息
4. 参考官方文档：
   - [Next.js 文档](https://nextjs.org/docs)
   - [Supabase 文档](https://supabase.com/docs)
   - [Vercel 文档](https://vercel.com/docs)

---

🎉 恭喜！您的攀岩装备在线下单系统已成功部署！ 