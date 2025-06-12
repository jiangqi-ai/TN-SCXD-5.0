# 🔒 安全配置指南

## ⚠️ 重要安全提醒

**绝对不要将以下敏感信息推送到GitHub：**
- Supabase密钥
- 数据库连接字符串
- API密钥
- 任何包含密码的文件

## 📋 本地开发环境配置

### 1. 创建环境变量文件

在项目根目录创建 `.env.local` 文件（此文件已被 `.gitignore` 忽略）：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase 服务密钥（可选，用于管理员功能）
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# 网站 URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. 获取Supabase配置信息

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择您的项目
3. 进入 Settings > API
4. 复制以下信息：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

## 🚀 生产环境部署

### Vercel 部署配置

如果使用 Vercel 部署，请在 Vercel Dashboard 中设置环境变量：

1. 进入项目设置
2. 选择 "Environment Variables"
3. 添加以下变量：

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key-here
NEXT_PUBLIC_SITE_URL = https://your-domain.vercel.app
```

### 其他平台部署

对于其他部署平台（如 Netlify、Railway 等），请在相应平台的环境变量设置中配置这些值。

## 🔍 安全检查清单

在推送代码前，请确保：

- [ ] `.env.local` 文件不在版本控制中
- [ ] 没有硬编码任何密钥在代码中
- [ ] `env.example` 文件只包含示例值，不包含真实密钥
- [ ] 所有敏感配置都通过环境变量传递

## 🛡️ 最佳安全实践

1. **定期轮换密钥**：定期更新 Supabase 密钥
2. **最小权限原则**：只给应用必要的权限
3. **监控访问日志**：定期检查 Supabase 访问日志
4. **使用 RLS**：确保数据库行级安全策略正确配置
5. **HTTPS 部署**：生产环境必须使用 HTTPS

## 🚨 如果密钥泄露

如果不小心将密钥推送到了 GitHub：

1. **立即撤销密钥**：在 Supabase Dashboard 中重新生成密钥
2. **更新所有环境**：更新本地和生产环境的密钥
3. **清理 Git 历史**：使用 `git filter-branch` 或 BFG Repo-Cleaner 清理历史
4. **通知团队**：如果是团队项目，通知所有成员更新密钥

## 📞 支持

如果遇到安全相关问题，请：
1. 查看 Supabase 官方文档
2. 检查项目的安全配置
3. 联系技术支持

---

**记住：安全是第一位的！宁可多花时间配置，也不要冒险泄露密钥。** 