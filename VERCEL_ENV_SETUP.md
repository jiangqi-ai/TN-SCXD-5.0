# Vercel 环境变量设置指南

## 🎯 **快速修复部署问题**

您的部署失败是因为缺少环境变量。按照以下步骤设置：

### **Step 1: 获取 Supabase 信息**

1. **登录 Supabase Dashboard**
   - 访问 [supabase.com](https://supabase.com)
   - 选择您的项目

2. **获取项目信息**
   - 进入 Settings → API
   - 复制以下信息：
     - **Project URL** (例如: `https://abc123.supabase.co`)
     - **anon public** key
     - **service_role** key (可选，用于管理功能)

### **Step 2: 在 Vercel 中设置环境变量**

1. **访问 Vercel Dashboard**
   - 登录 [vercel.com](https://vercel.com)
   - 找到您的项目 `TN-SCXD-5.0`

2. **导航到环境变量设置**
   ```
   Project → Settings → Environment Variables
   ```

3. **添加以下环境变量**

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your_anon_key_here` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `your_service_role_key_here` | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` | Production, Preview, Development |

### **Step 3: 重新部署**

1. **触发新部署**
   - 在 Vercel Dashboard 中点击 "Redeploy"
   - 或者推送新的代码到 GitHub

2. **验证部署**
   - 等待构建完成
   - 访问您的 Vercel 域名测试功能

## 🔧 **环境变量说明**

### **必需变量**
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 项目 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 匿名密钥
- `NEXT_PUBLIC_SITE_URL`: 您的网站 URL

### **可选变量**
- `SUPABASE_SERVICE_ROLE_KEY`: 管理功能密钥（用于后台管理）

## 🛠️ **故障排除**

### **常见错误 1: 环境变量值错误**
```
Error: Invalid JWT
```
**解决方案**: 检查密钥是否正确复制，确保没有多余空格

### **常见错误 2: URL 格式错误**
```
Error: Invalid URL
```
**解决方案**: 确保 URL 以 `https://` 开头，格式正确

### **常见错误 3: 权限错误**
```
Error: Insufficient permissions
```
**解决方案**: 确认使用的是正确的 `service_role` 密钥

## 🚀 **快速检查清单**

- [ ] Supabase 项目已创建
- [ ] 获取了项目 URL 和密钥
- [ ] 在 Vercel 中添加了所有环境变量
- [ ] 环境变量值正确无误
- [ ] 触发了新的部署
- [ ] 构建成功完成
- [ ] 网站可以正常访问

## 📱 **手机快速设置步骤**

1. **在手机上打开 Vercel app**
2. **找到项目 → Settings**
3. **添加环境变量**
4. **重新部署**

---

## 🎉 **完成后的效果**

设置完成后，您将拥有：
- ✅ 成功部署的网站
- ✅ 功能完整的用户认证系统
- ✅ 可以正常使用的管理后台
- ✅ 自动化的 CI/CD 流程

**需要帮助？** 请检查 Vercel 构建日志中的详细错误信息。 