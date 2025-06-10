# 攀岩装备商城 - TN-SCXD-5.0

🏔️ 现代化攀岩装备电商平台，基于 Next.js 14 构建，提供完整的电商解决方案。

[![构建状态](https://img.shields.io/badge/build-passing-brightgreen)](.) 
[![版本](https://img.shields.io/badge/version-1.0.0-blue)](.)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-enabled-green)](https://supabase.com/)

## ✨ 功能特性

### 🛍️ 用户端
- **产品浏览** - 专业攀岩装备分类展示
- **智能购物车** - 实时更新的购物体验
- **订单管理** - 完整的订单流程追踪
- **用户系统** - 安全注册登录机制
- **响应式设计** - 完美适配所有设备

### 🛡️ 管理端
- **用户注册控制** - 灵活的注册策略管理
- **产品管理** - 完整的商品CRUD操作
- **订单处理** - 高效的订单状态管理
- **系统设置** - 可配置的平台参数
- **权限控制** - 基于角色的访问管理

## 🚀 快速开始

### 📋 环境要求
- Node.js ≥ 18.17.0
- npm 或 yarn

### ⚡ 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### 🔧 本地开发

```bash
# 1. 克隆项目
git clone [your-repo-url]
cd TN-SCXD-5.0

# 2. 安装依赖
npm install

# 3. 环境配置
cp env.example .env.local
# 编辑 .env.local 配置 Supabase 连接

# 4. 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 🎉

### 🗄️ 数据库设置

在 Supabase 中执行以下 SQL 文件：
1. `database/enhanced_schema.sql`
2. `scripts/init-user-settings.sql`

### 👨‍💼 系统初始化

访问 `/init` 页面完成系统初始化和管理员账户创建。

## 🏗️ 技术栈

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Tailwind CSS, Lucide Icons
- **State**: Zustand
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deploy**: Vercel

## 📁 项目结构

```
TN-SCXD-5.0/
├── 📱 app/                 # Next.js App Router
│   ├── 👨‍💼 admin/          # 管理后台
│   ├── 🔌 api/            # API 接口
│   ├── 🔐 auth/           # 用户认证
│   ├── 🛒 cart/           # 购物车
│   └── 📦 products/       # 产品展示
├── 🧩 components/         # 组件库
├── 📚 lib/               # 工具函数
├── 🗃️ store/             # 状态管理
└── 📄 database/          # 数据库Schema
```

## 📖 文档中心

- 📋 [生产环境部署指南](PRODUCTION_README.md)
- 🚀 [Vercel 部署文档](VERCEL_DEPLOY.md)
- ⚙️ [环境变量配置](VERCEL_ENV_SETUP.md)
- 👨‍💼 [管理员设置指南](管理员账户创建指南.md)
- 🔧 [用户注册控制指南](管理后台用户注册控制使用指南.md)

## 🛠️ 开发命令

```bash
npm run dev     # 开发模式
npm run build   # 生产构建
npm run start   # 生产服务器
npm run lint    # 代码检查
```

## 🔒 安全特性

- ✅ 安全的环境变量处理
- ✅ Supabase RLS 行级安全
- ✅ JWT 认证机制
- ✅ 输入验证与清理
- ✅ CSRF 攻击防护

## 🤝 贡献指南

欢迎提交 Issues 和 Pull Requests！

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 发起 Pull Request

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 了解详情

---

<div align="center">

**🎯 项目状态**: 生产就绪 | **📊 构建状态**: 通过 (23页面) | **🏷️ 版本**: 1.0.0

如果这个项目对你有帮助，请给它一个 ⭐️！

</div> 