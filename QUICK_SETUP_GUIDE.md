# 🚀 快速设置指南

## 当前问题解决方案

您遇到的错误表明需要完成以下设置步骤：

### 1. 🔧 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase 服务密钥
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# 网站 URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. 📊 获取 Supabase 配置

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 创建新项目或选择现有项目
3. 进入 **Settings** → **API**
4. 复制以下信息：
   - **Project URL** (类似 `https://xxxxxx.supabase.co`)
   - **anon public key** (以 `eyJhbGciOiJIUzI1NiI...` 开头)
   - **service_role key** (以 `eyJhbGciOiJIUzI1NiI...` 开头)

### 3. 🗄️ 初始化数据库

在 Supabase Dashboard 中：

1. 进入 **SQL Editor**
2. 创建新查询
3. 复制并执行 `database/init-basic-fixed.sql` 的内容
4. 再复制并执行 `database/init-policies-and-data.sql` 的内容

### 4. 🔄 重启开发服务器

完成以上步骤后：

```bash
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
npm run dev
```

## 📋 故障排除

### 连接失败 (ERR_CONNECTION_CLOSED)
- 检查 Supabase 项目是否已暂停（免费项目会在不活动后暂停）
- 确认 Project URL 正确
- 检查网络连接

### 数据库表结构不完整
- 确保在 Supabase SQL Editor 中执行了两个初始化脚本
- 检查脚本是否执行成功（无错误信息）

### 多个 GoTrueClient 实例警告
- 这个警告已经修复，重启服务器后应该消失
- 如果仍然出现，清除浏览器存储再试

## 🔍 验证设置

设置完成后，您应该能够：

1. **访问设置页面** - `http://localhost:3000/setup`
2. **连接数据库成功** - 看到绿色的连接成功提示
3. **创建管理员账户** - 在设置页面完成系统配置

## 🆘 需要帮助？

如果仍然有问题：

1. 检查 `.env.local` 文件是否在项目根目录
2. 确认 Supabase 项目状态是 "Active"
3. 验证复制的密钥没有多余的空格
4. 检查浏览器控制台的详细错误信息

完成这些步骤后，系统应该能够正常连接到数据库。 