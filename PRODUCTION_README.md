# 攀岩装备商城 - 生产环境部署指南

## 项目概述

这是一个基于 Next.js 14 的攀岩装备电商平台，具备完整的用户注册、产品管理、订单处理和管理后台功能。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI 框架**: Tailwind CSS
- **状态管理**: Zustand
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **部署平台**: Vercel

## 项目结构

```
├── app/                    # Next.js 13+ App Router
│   ├── admin/             # 管理后台页面
│   ├── api/               # API 路由
│   ├── auth/              # 认证页面
│   ├── cart/              # 购物车
│   ├── checkout/          # 结账页面
│   ├── init/              # 系统初始化
│   ├── orders/            # 订单页面
│   ├── products/          # 产品页面
│   └── not-found.tsx      # 404页面
├── components/            # React 组件
├── lib/                   # 工具库
├── store/                 # Zustand 状态管理
├── types/                 # TypeScript 类型定义
├── database/              # 数据库schema
└── scripts/               # 脚本文件
```

## 部署步骤

### 1. 环境变量配置

复制 `env.example` 到 `.env.local` 并配置以下变量：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. 数据库设置

在 Supabase 中执行以下 SQL 文件：
1. `database/enhanced_schema.sql` - 完整数据库schema
2. `scripts/init-user-settings.sql` - 初始设置数据

### 3. 系统初始化

部署后访问 `/init` 页面进行系统初始化：
- 创建首个管理员账户
- 初始化基本系统设置
- 配置用户注册控制

### 4. Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

## 核心功能

### 用户功能
- ✅ 用户注册/登录
- ✅ 产品浏览和搜索
- ✅ 购物车管理
- ✅ 订单提交和查看

### 管理功能
- ✅ 用户注册控制
- ✅ 产品管理
- ✅ 订单管理
- ✅ 用户管理
- ✅ 系统设置
- ✅ 数据库配置

### 系统特性
- ✅ 响应式设计
- ✅ 安全的环境变量处理
- ✅ 完整的错误处理
- ✅ TypeScript 支持
- ✅ 生产环境优化

## 管理员账户创建

有三种方式创建管理员账户：

1. **系统初始化页面** (推荐)
   - 访问 `/init`
   - 按照向导创建

2. **API自动提升**
   - 首个注册用户自动成为管理员

3. **数据库直接操作**
   - 在 Supabase 中手动修改用户角色

## 生产环境检查清单

- [ ] 环境变量已正确配置
- [ ] 数据库已初始化
- [ ] 首个管理员账户已创建
- [ ] 用户注册设置已配置
- [ ] SSL证书已配置
- [ ] 性能监控已设置

## 安全考虑

- 环境变量不包含在代码仓库中
- 使用 Supabase RLS (Row Level Security)
- API 路由有适当的权限检查
- 用户输入已验证和清理

## 维护

### 日常维护
- 监控系统性能
- 检查错误日志
- 定期备份数据库

### 更新流程
1. 在开发环境测试
2. 更新版本号
3. 部署到生产环境
4. 验证功能正常

## 联系信息

- 项目仓库: [GitHub链接]
- 技术支持: [联系邮箱]
- 部署文档: `VERCEL_DEPLOY.md`

---

**构建状态**: ✅ 成功 (23页面)
**最后更新**: $(Get-Date)
**版本**: 1.0.0 