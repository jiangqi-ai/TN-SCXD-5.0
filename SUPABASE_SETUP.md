# Supabase 云端数据库配置指南

## 📋 概述

这个项目现在支持云端数据同步，使用 Supabase 作为后端数据库。这意味着：

- ✅ **数据持久化**: 服务器重启不会丢失数据
- ✅ **多设备同步**: 在任何设备上访问都是同一份数据
- ✅ **实时更新**: 支持实时数据同步
- ✅ **生产就绪**: 可部署到任何云平台

## 🚀 快速开始

### 步骤 1: 创建 Supabase 项目

1. 访问 [Supabase官网](https://supabase.com)
2. 点击 "Start your project" 或 "Sign Up"
3. 注册账户（支持GitHub登录）
4. 创建新项目：
   - Project Name: `climbing-gear-store`
   - Database Password: 设置一个强密码
   - Region: 选择离您最近的区域

### 步骤 2: 获取项目配置

项目创建完成后，进入项目仪表板：

1. 在左侧菜单中点击 "Settings" → "API"
2. 复制以下信息：
   - **Project URL** (类似: `https://xxx.supabase.co`)
   - **anon/public key**
   - **service_role key** (点击眼睛图标显示)

### 步骤 3: 配置环境变量

1. 在项目根目录创建 `.env.local` 文件
2. 复制 `env-example.txt` 的内容到 `.env.local`
3. 替换配置值：

```env
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon密钥
SUPABASE_SERVICE_ROLE_KEY=你的service_role密钥
```

### 步骤 4: 创建数据库表

1. 在 Supabase 仪表板中，点击左侧 "SQL Editor"
2. 点击 "New query"
3. 复制 `supabase-schema.sql` 文件的全部内容
4. 粘贴到 SQL 编辑器中
5. 点击 "Run" 执行

### 步骤 5: 启动应用

```bash
npm run dev
```

现在您的应用已经连接到云端数据库！

## 🔧 功能特性

### 数据同步
- 产品信息实时同步
- 购物车状态多设备共享
- 订单状态实时更新

### 安全性
- Row Level Security (RLS) 已启用
- 用户数据隔离
- API密钥权限控制

### 扩展性
- 支持无限用户
- 自动数据备份
- 99.9% 可用性保证

## 📊 数据库结构

| 表名 | 说明 |
|------|------|
| `products` | 产品信息 |
| `users` | 用户信息 |
| `cart_items` | 购物车项目 |
| `orders` | 订单 |
| `order_items` | 订单明细 |

## 🔍 验证设置

设置完成后，您可以通过以下方式验证：

1. **数据库连接**: 访问产品页面，查看是否显示产品
2. **数据写入**: 在管理后台添加新产品
3. **实时同步**: 在多个浏览器窗口中测试数据同步

## 🚨 故障排除

### 常见问题

**问题**: 页面显示 "获取数据失败"
**解决**: 
1. 检查 `.env.local` 文件是否存在且配置正确
2. 确认 Supabase 项目 URL 和密钥无误
3. 检查数据库表是否已创建

**问题**: API 请求返回 401 错误
**解决**: 
1. 检查 `service_role` 密钥是否正确
2. 确认 RLS 策略是否正确设置

**问题**: 某些功能无法使用
**解决**: 
1. 确认已执行完整的 `supabase-schema.sql`
2. 检查表结构是否完整

## 🔄 从内存存储迁移

如果您之前使用内存存储，现在切换到 Supabase：

1. 所有 API 路由已自动更新
2. 数据格式保持兼容
3. 现有功能无需修改

## 📈 生产部署

部署到生产环境时：

1. 使用生产环境的 Supabase 项目
2. 更新环境变量
3. 确保启用了适当的安全策略

## 💡 进阶功能

### 实时订阅
可以添加实时数据监听：

```typescript
supabase
  .channel('products')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'products' },
    (payload) => {
      console.log('产品数据更新:', payload)
    }
  )
  .subscribe()
```

### 文件存储
Supabase 还提供文件存储服务，可用于产品图片：

```typescript
const { data, error } = await supabase.storage
  .from('product-images')
  .upload('image.jpg', file)
```

## 📞 支持

如有问题，请：
1. 查看 [Supabase 文档](https://supabase.com/docs)
2. 检查项目的 GitHub Issues
3. 参考 Supabase 社区论坛

---

🎉 **恭喜！您现在拥有一个具有云端同步功能的完整电商系统！** 