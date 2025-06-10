# 攀岩装备在线下单系统

一个基于 Next.js + Supabase 构建的现代化攀岩装备电商平台，支持产品展示、在线下单、订单管理和后台管理功能。

## 功能特性

### 🛍️ 产品中心
- 产品分类浏览
- 产品详情展示
- 购物车功能
- 实时库存管理

### 📋 订单中心
- 订单创建与支付
- 订单状态跟踪
- 订单历史查看
- 配送地址管理

### ⚙️ 管理后台
- 产品管理（增删改查）
- 订单管理
- 用户管理
- 数据统计

### 🔐 用户系统
- 邮箱注册/登录
- 用户资料管理
- 角色权限控制

## 技术栈

- **前端**: Next.js 14, React, TypeScript, Tailwind CSS
- **后端**: Supabase (PostgreSQL + Auth + Real-time)
- **状态管理**: Zustand
- **表单处理**: React Hook Form
- **UI组件**: Lucide React Icons
- **通知**: React Hot Toast
- **部署**: Vercel

## 快速开始

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd climbing-gear-store
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
复制 `env.example` 为 `.env.local` 并填入 Supabase 配置：

```bash
cp env.example .env.local
```

在 `.env.local` 中填入：
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. 设置 Supabase 数据库

在 Supabase 控制台的 SQL 编辑器中执行 `database/schema.sql` 文件中的 SQL 语句来创建数据表。

### 5. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## Supabase 配置

### 1. 创建 Supabase 项目
1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目
3. 获取项目 URL 和 API Keys

### 2. 配置认证
在 Supabase 控制台 -> Authentication -> Settings 中：
- 启用邮箱确认
- 配置重定向 URLs

### 3. 设置 RLS (Row Level Security)
数据库表已配置行级安全策略，确保数据安全。

## 部署到 Vercel

### 1. 连接 GitHub
将代码推送到 GitHub 仓库。

### 2. 导入到 Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 导入 GitHub 仓库
3. 配置环境变量
4. 部署

### 3. 配置环境变量
在 Vercel 项目设置中添加：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL` (你的 Vercel 域名)

## 项目结构

```
├── app/                    # Next.js App Router
│   ├── auth/              # 认证页面
│   ├── products/          # 产品相关页面
│   ├── orders/            # 订单相关页面
│   ├── admin/             # 管理后台
│   └── cart/              # 购物车页面
├── components/            # 可复用组件
├── lib/                   # 工具库
│   └── supabase.ts       # Supabase 配置
├── store/                 # 状态管理
├── database/              # 数据库脚本
└── public/               # 静态资源
```

## 主要功能模块

### 认证系统
- 基于 Supabase Auth
- 支持邮箱注册/登录
- 用户角色管理（用户/管理员）

### 产品管理
- 产品分类
- 产品CRUD操作
- 图片上传
- 库存管理

### 订单系统
- 购物车功能
- 订单创建
- 状态跟踪
- 配送管理

### 管理后台
- 仅管理员可访问
- 数据统计
- 全面的管理功能

## 开发指南

### 添加新页面
1. 在 `app/` 目录下创建新路由
2. 实现页面组件
3. 添加必要的类型定义

### 数据库操作
1. 使用 Supabase 客户端
2. 遵循 TypeScript 类型定义
3. 处理错误情况

### 样式规范
- 使用 Tailwind CSS
- 遵循组件化设计
- 响应式布局

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 许可证

MIT License

## 技术支持

如有问题，请创建 Issue 或联系开发团队。 