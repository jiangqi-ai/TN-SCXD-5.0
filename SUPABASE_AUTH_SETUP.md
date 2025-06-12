# 🔐 Supabase 认证设置指南

## AuthRetryableFetchError 解决方案

如果遇到 `AuthRetryableFetchError: Failed to fetch` 错误，请按以下步骤检查和配置：

### 1. 🔍 检查 Supabase 项目状态

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 确认项目状态为 **"Active"**（不是 "Paused"）
3. 如果项目已暂停，点击 **"Restore"** 恢复项目

### 2. ⚙️ 认证设置配置

在 Supabase Dashboard 中：

1. 进入 **Authentication** > **Settings**
2. 确认以下设置：

#### Site URL 设置
```
Site URL: http://localhost:3000
```

#### Additional Redirect URLs
```
http://localhost:3000/auth/callback
http://localhost:3000/setup
```

#### Email Auth 设置
- ✅ **Enable email confirmations**: 关闭（开发阶段）
- ✅ **Enable email change confirmations**: 关闭（开发阶段）
- ✅ **Enable secure email change**: 关闭（开发阶段）

### 3. 📧 SMTP 设置（可选）

如果需要邮件功能，在 **Authentication** > **Settings** > **SMTP Settings** 中配置：

```
SMTP Host: smtp.gmail.com (或其他SMTP服务)
SMTP Port: 587
SMTP Username: your-email@gmail.com
SMTP Password: your-app-password
```

**注意：开发阶段可以跳过SMTP配置**

### 4. 🛡️ 权限策略检查

确保已执行权限策略修复脚本：

```sql
-- 在 Supabase SQL Editor 中执行
-- 复制 database/fix-policies.sql 的全部内容
```

### 5. 🌐 网络问题排查

#### 检查网络连接
```bash
# 测试 Supabase 连接
curl -I https://your-project.supabase.co/rest/v1/
```

#### 防火墙设置
- 确保防火墙允许访问 `*.supabase.co`
- 如果在企业网络，可能需要配置代理

#### DNS 问题
- 尝试刷新 DNS: `ipconfig /flushdns` (Windows)
- 或使用不同的 DNS 服务器（如 8.8.8.8）

### 6. 🔧 代码层面的解决方案

#### 重试机制
已在代码中实现了重试机制，如果仍有问题，可以：

1. **清理浏览器存储**：
```javascript
// 在浏览器控制台执行
localStorage.clear();
sessionStorage.clear();
window.location.reload();
```

2. **检查网络状态**：
```javascript
// 检查网络连接
navigator.onLine
```

3. **手动测试连接**：
访问 `/setup/diagnostic` 页面进行全面诊断

### 7. 🆘 常见问题解决

#### 问题：项目暂停
**解决**：在 Supabase Dashboard 中恢复项目

#### 问题：认证配置错误
**解决**：检查 Site URL 和 Redirect URLs 设置

#### 问题：权限策略递归
**解决**：执行 `database/fix-policies.sql`

#### 问题：网络超时
**解决**：检查网络连接，可能需要重试

#### 问题：环境变量错误
**解决**：确认 `.env.local` 文件配置正确

### 8. 🔍 调试工具

#### 使用诊断页面
访问 `http://localhost:3000/setup/diagnostic` 进行全面检查

#### 浏览器开发者工具
1. 打开 F12 开发者工具
2. 查看 Network 选项卡的请求详情
3. 检查 Console 中的详细错误信息

#### Supabase 日志
在 Supabase Dashboard 的 **Logs** 部分查看详细日志

---

**完成这些设置后，创建管理员账户功能应该能正常工作。** 