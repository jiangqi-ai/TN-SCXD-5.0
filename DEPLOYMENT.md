# 🚀 攀岩装备商城 - 部署指南

## 📋 系统特点

✅ **无需外部数据库** - 使用内存存储，适合演示和小型应用  
✅ **无需环境变量配置** - 开箱即用  
✅ **完整的商城功能** - 产品管理、订单系统、用户认证  
✅ **现代化UI设计** - 基于Tailwind CSS的响应式界面  
✅ **一键部署到Vercel** - 支持GitHub集成自动部署  

## 🛠️ 本地开发

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 访问系统
打开浏览器访问 `http://localhost:3000`

## 🚀 部署到Vercel

### 方法一：通过GitHub（推荐）

1. **将代码推送到GitHub**
   ```bash
   git add .
   git commit -m "🚀 Ready for deployment"
   git push origin main
   ```

2. **连接Vercel**
   - 访问 [Vercel](https://vercel.com)
   - 点击 "New Project"
   - 选择你的GitHub仓库
   - 点击 "Deploy"

3. **自动部署**
   - Vercel会自动检测Next.js项目
   - 无需任何额外配置
   - 几分钟后即可访问在线系统

### 方法二：直接部署

```bash
# 安装Vercel CLI
npm i -g vercel

# 部署项目
vercel

# 按提示操作即可
```

## 👥 默认账户

系统包含以下测试账户：

### 管理员账户
- **邮箱**: admin@climbing.com  
- **密码**: admin123  
- **权限**: 产品管理、订单管理

### 客户账户  
- **邮箱**: customer@example.com  
- **密码**: customer123  
- **权限**: 浏览产品、下单

## 🏪 系统功能

### 管理员功能
- ✅ 产品管理（增删改查）
- ✅ 订单管理（查看、状态更新）
- ✅ 用户管理
- ✅ 实时数据统计

### 客户功能
- ✅ 浏览产品目录
- ✅ 按分类筛选
- ✅ 购物车管理
- ✅ 在线下单
- ✅ 订单跟踪

### 产品分类
- 🥾 攀岩鞋
- 🦺 安全带  
- ⛑️ 头盔
- 🪢 绳索
- 🔗 快挂
- ⚙️ 保护器

## 🔧 技术栈

- **框架**: Next.js 14
- **样式**: Tailwind CSS
- **认证**: JWT + HTTP-only Cookies
- **数据存储**: 内存数据库（可扩展为持久化存储）
- **部署**: Vercel
- **语言**: TypeScript

## 📝 重要说明

### 数据持久化
当前版本使用内存存储，重启应用后数据会重置。如需持久化存储，可以：

1. **集成数据库**
   - PostgreSQL (推荐用于生产环境)
   - MySQL
   - SQLite

2. **集成云服务**
   - Supabase
   - PlanetScale
   - Neon

### 生产环境建议

1. **更换JWT密钥**
   ```typescript
   // lib/auth.ts
   const secret = new TextEncoder().encode('your-production-secret-key')
   ```

2. **添加环境变量**
   ```bash
   JWT_SECRET=your-very-secure-secret-key
   NODE_ENV=production
   ```

3. **启用HTTPS**
   - Vercel自动提供SSL证书
   - 确保cookie设置为secure

## 🆘 故障排除

### 构建失败
```bash
# 清理缓存
rm -rf .next
npm run build
```

### 依赖问题
```bash
# 删除node_modules重新安装
rm -rf node_modules package-lock.json
npm install
```

### 部署问题
- 确保所有文件都已提交到Git
- 检查package.json中的scripts配置
- 查看Vercel部署日志

## 📞 支持

如有问题，可以：
1. 查看部署日志
2. 检查浏览器控制台错误
3. 参考Next.js和Vercel官方文档

## 🎯 下一步优化

- [ ] 集成真实数据库
- [ ] 添加图片上传功能
- [ ] 实现邮件通知
- [ ] 添加支付集成
- [ ] 用户注册功能
- [ ] 订单打印功能
- [ ] 数据导出功能

---

**祝您部署顺利！🎉** 