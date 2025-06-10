# 🚀 项目配置指南

## ⚠️ 解决配置错误

您遇到的错误已经修复！请按照以下步骤完成配置：

## 📋 必需步骤

### 1. 创建环境变量文件

```bash
# 复制示例文件
cp env.example .env.local
```

### 2. 配置 Supabase

在 `.env.local` 文件中填入您的 Supabase 配置：

```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 网站配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. 获取 Supabase 配置信息

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择您的项目（如果没有，请创建新项目）
3. 点击左侧菜单的 **Settings** → **API**
4. 复制以下信息：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### 4. 设置数据库

在 Supabase SQL 编辑器中执行：

```sql
-- 方式一：使用增强版结构（推荐）
\i database/enhanced_schema.sql

-- 方式二：使用原始结构
\i database/schema.sql
```

## 🔧 已修复的问题

### ✅ Next.js 配置
- 移除了过时的 `experimental.appDir` 配置
- Next.js 14 默认支持 App Router

### ✅ Supabase 配置
- 添加了环境变量检查
- 更好的错误提示
- 集成了新的类型定义

### ✅ 类型系统
- 统一的 TypeScript 类型定义
- 完整的数据库类型支持

## 🚀 启动项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 📱 验证配置

启动成功后，您应该能够：

1. **访问首页** - http://localhost:3000
2. **用户注册/登录** - 无错误提示
3. **数据库连接** - 能够加载产品和分类

## 🆘 常见问题

### Q: 仍然显示 "supabaseUrl is required" 错误？
**A:** 确保 `.env.local` 文件在项目根目录，且环境变量名称完全正确。

### Q: Supabase 项目如何创建？
**A:** 
1. 注册 [Supabase](https://supabase.com)
2. 点击 "New Project"
3. 选择组织和数据库密码
4. 等待项目创建完成

### Q: 数据库表不存在？
**A:** 在 Supabase Dashboard → SQL Editor 中执行 `database/enhanced_schema.sql`

### Q: 权限错误？
**A:** 确保已在 Supabase 中启用 Row Level Security (RLS) 策略。

## 📞 技术支持

如果仍有问题，请检查：

1. **环境变量** - 确保格式正确，无多余空格
2. **Supabase 项目** - 确保项目正常运行
3. **网络连接** - 确保能访问 Supabase 服务

---

配置完成后，您的攀岩装备系统就可以正常运行了！🎉 