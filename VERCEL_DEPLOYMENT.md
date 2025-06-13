# Vercel 部署指南

## 🚀 概述

这个项目支持智能的存储切换机制：
- **无配置部署**: 直接部署到Vercel，使用内存存储
- **云端同步**: 配置Supabase环境变量，启用数据持久化

## 📋 快速部署步骤

### 方法1: 一键部署（内存模式）

1. 将项目推送到GitHub
2. 登录 [Vercel](https://vercel.com)
3. 点击 "Import Project"
4. 选择GitHub仓库
5. 点击 "Deploy"

**结果**: 应用将使用内存存储运行，功能完整但数据不持久

### 方法2: 配置云端同步

#### 步骤 1: 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 创建新项目
3. 等待项目初始化完成

#### 步骤 2: 获取配置信息

在Supabase项目中:
1. 进入 **Settings** → **API**
2. 复制以下信息:
   - **Project URL**
   - **anon public key**
   - **service_role key**

#### 步骤 3: 执行数据库初始化

1. 在Supabase中进入 **SQL Editor**
2. 创建新查询
3. 复制粘贴 `supabase-schema.sql` 的内容
4. 执行查询

#### 步骤 4: 在Vercel配置环境变量

1. 在Vercel项目中进入 **Settings** → **Environment Variables**
2. 添加以下变量:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon密钥
SUPABASE_SERVICE_ROLE_KEY=你的service_role密钥
```

3. 点击 **Save**

#### 步骤 5: 重新部署

1. 进入 **Deployments** 标签
2. 点击最新部署右侧的三个点
3. 选择 **Redeploy**

## 🔧 环境变量详细说明

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | 否* | Supabase项目URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 否* | 匿名访问密钥 |
| `SUPABASE_SERVICE_ROLE_KEY` | 否* | 服务端权限密钥 |

*注：如果不配置，系统将使用内存存储

## 📊 存储模式对比

| 特性 | 内存存储 | Supabase云端 |
|------|----------|--------------|
| 配置难度 | ✅ 无需配置 | ⚠️ 需要配置 |
| 数据持久化 | ❌ 重启丢失 | ✅ 永久保存 |
| 多设备同步 | ❌ 不支持 | ✅ 实时同步 |
| 扩展性 | ❌ 有限 | ✅ 无限扩展 |
| 成本 | ✅ 免费 | ✅ 免费额度充足 |

## 🔍 验证部署

部署完成后，访问您的应用主页，查看**存储状态**显示：

- 🚀 **云端数据库 (Supabase)** - 配置成功
- 💾 **内存数据库** - 使用临时存储

## 🚨 常见问题

### Q: 部署后显示环境变量错误
**A**: 
1. 检查Vercel环境变量是否正确设置
2. 确认变量名称拼写无误
3. 重新部署应用

### Q: Supabase连接失败
**A**: 
1. 检查Supabase项目是否正常运行
2. 确认API密钥是否正确
3. 检查数据库表是否已创建

### Q: 可以在生产环境使用内存存储吗？
**A**: 
- ✅ **演示用途**: 可以用于展示功能
- ❌ **生产环境**: 不建议，数据会丢失
- 🎯 **推荐**: 配置Supabase获得完整功能

## 🔄 切换存储模式

### 从内存存储升级到云端存储

1. 按照上述步骤配置Supabase
2. 在Vercel添加环境变量
3. 重新部署
4. 系统将自动切换到云端存储

### 从云端存储降级到内存存储

1. 在Vercel删除所有Supabase环境变量
2. 重新部署
3. 系统将回退到内存存储

## 📈 性能优化建议

### Supabase优化
- 选择离用户最近的Region
- 启用Connection Pooling
- 配置适当的RLS策略

### Vercel优化  
- 使用Vercel Analytics监控性能
- 启用Edge Functions（如需要）
- 配置合适的Cache Headers

## 🔐 安全最佳实践

1. **环境变量安全**:
   - 永远不要将密钥提交到Git
   - 定期轮换API密钥
   - 使用最小权限原则

2. **Supabase安全**:
   - 启用Row Level Security
   - 配置合适的访问策略
   - 监控API使用情况

3. **Vercel安全**:
   - 启用Domain Protection
   - 使用HTTPS
   - 配置CSP Headers

## 📞 技术支持

遇到问题时:
1. 查看应用主页的存储状态
2. 检查Vercel部署日志
3. 参考 `SUPABASE_SETUP.md`
4. 查看项目GitHub Issues

---

🎉 **您现在拥有一个可以智能适应不同环境的现代化电商系统！** 