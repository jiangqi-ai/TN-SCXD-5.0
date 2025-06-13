# 数据库配置与生产部署指南

## 🎯 概述

本系统采用智能存储切换架构，支持两种运行模式：
- **演示模式**：内存存储，零配置，数据不持久化
- **生产模式**：Supabase 云数据库，数据持久化，多设备同步

## 📋 快速部署选项

### 选项 1: 演示部署（推荐用于测试）
```bash
# 克隆项目
git clone <your-repo-url>
cd climbing-gear-store

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```
✅ **优点**：零配置，立即可用  
⚠️ **限制**：数据不持久化，重启后丢失

### 选项 2: 生产部署（推荐用于正式环境）
需要配置 Supabase 数据库，详见下方完整指南。

## 🚀 生产数据库配置

### 步骤 1: 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并注册账户
2. 点击 "New Project" 创建新项目
3. 填写项目信息：
   - **组织**：选择或创建组织
   - **项目名称**：例如 "climbing-gear-store"
   - **数据库密码**：设置强密码（保存好）
   - **区域**：选择离用户最近的区域
4. 等待项目创建完成（约 2-3 分钟）

### 步骤 2: 获取数据库配置

在 Supabase 项目控制台中：

1. 进入 **Settings** → **API**
2. 找到并复制以下信息：

#### 必需的环境变量
```env
# Supabase 项目 URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co

# Supabase 匿名密钥（公开安全）
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase 服务角色密钥（可选，用于管理员操作）
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 步骤 3: 初始化数据库架构

1. 在 Supabase 控制台中进入 **SQL Editor**
2. 创建新查询
3. 复制并执行项目根目录的 `supabase-schema.sql` 文件内容
4. 点击 "Run" 执行 SQL 脚本

### 步骤 4: 配置环境变量

#### 对于本地开发
1. 在项目根目录创建 `.env.local` 文件
2. 添加环境变量：
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
3. 重启开发服务器：`npm run dev`

#### 对于 Vercel 部署
1. 在 Vercel 控制台选择您的项目
2. 进入 **Settings** → **Environment Variables**
3. 添加以上三个环境变量
4. 重新部署项目

#### 对于 Docker 部署
1. 在 `docker-compose.yml` 中添加环境变量
2. 或创建 `.env` 文件（不要提交到 Git）
3. 重新构建容器：`docker-compose up --build`

## 🔧 部署平台配置

### Vercel 部署（推荐）

1. **自动部署**：
   ```bash
   # 推送到 GitHub
   git push origin main
   
   # 在 Vercel 中导入 GitHub 仓库
   # 配置环境变量
   # 部署完成
   ```

2. **手动部署**：
   ```bash
   # 安装 Vercel CLI
   npm i -g vercel
   
   # 部署
   vercel
   
   # 配置环境变量
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   
   # 重新部署
   vercel --prod
   ```

### Docker 部署

1. **构建镜像**：
   ```bash
   docker build -t climbing-gear-store .
   ```

2. **运行容器**：
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_SUPABASE_URL=your-url \
     -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
     climbing-gear-store
   ```

3. **使用 Docker Compose**：
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
         - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
         - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
   ```

## 🧪 验证配置

### 方法 1: 系统设置页面
1. 访问 `/admin/settings`
2. 查看存储状态部分
3. 点击"重新检测"按钮

### 方法 2: API 接口测试
```bash
# 检查存储信息
curl http://localhost:3000/api/storage-info

# 测试数据库连接
curl http://localhost:3000/api/database-test
```

### 方法 3: 浏览器控制台
```javascript
// 打开浏览器开发者工具，执行：
fetch('/api/storage-info')
  .then(res => res.json())
  .then(data => console.log(data))
```

## 🔍 故障排除

### 问题 1: 连接失败
**症状**：显示"连接失败"或使用内存存储  
**解决**：
1. 检查环境变量是否正确设置
2. 验证 Supabase 项目状态
3. 确认网络连接
4. 检查 Supabase 服务状态

### 问题 2: 权限错误
**症状**：API 调用返回权限错误  
**解决**：
1. 检查 RLS（行级安全）策略
2. 确认匿名访问权限
3. 验证服务角色密钥

### 问题 3: 数据库表不存在
**症状**：查询表时报错"表不存在"  
**解决**：
1. 重新执行 `supabase-schema.sql`
2. 检查 SQL 脚本是否完整执行
3. 确认在正确的数据库中执行

## 📊 性能优化

### 1. 连接池配置
Supabase 自动管理连接池，无需额外配置。

### 2. 查询优化
- 使用索引字段进行查询
- 避免 N+1 查询问题
- 使用分页减少数据传输

### 3. 缓存策略
```typescript
// 示例：产品列表缓存
const products = await fetch('/api/products', {
  next: { revalidate: 60 } // 60秒缓存
})
```

## 🔐 安全最佳实践

### 1. 环境变量管理
- ✅ 使用平台环境变量配置
- ❌ 不要在代码中硬编码密钥
- ❌ 不要提交 `.env` 文件到 Git

### 2. 数据库安全
- ✅ 启用 RLS（行级安全）
- ✅ 设置适当的访问策略
- ✅ 定期轮换密钥

### 3. API 安全
- ✅ 验证输入参数
- ✅ 实现速率限制
- ✅ 记录审计日志

## 📚 相关资源

- [Supabase 文档](https://supabase.com/docs)
- [Vercel 部署指南](https://vercel.com/docs)
- [Next.js 生产部署](https://nextjs.org/docs/deployment)
- [Docker 部署最佳实践](https://docs.docker.com/develop/dev-best-practices/)

## 🆘 支持与帮助

如果遇到问题：
1. 查看系统设置页面的状态信息
2. 检查浏览器控制台的错误日志
3. 参考本文档的故障排除部分
4. 联系技术支持团队 