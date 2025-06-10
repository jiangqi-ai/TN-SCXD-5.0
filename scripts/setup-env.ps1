# 环境变量安全设置脚本
# 使用方法: .\scripts\setup-env.ps1

Write-Host "🔐 攀岩装备商城 - 环境变量安全设置" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# 检查是否存在 .env.local 文件
if (Test-Path ".env.local") {
    Write-Host "⚠️  发现现有的 .env.local 文件" -ForegroundColor Yellow
    $backup = Read-Host "是否要备份现有文件？(y/N)"
    if ($backup -eq "y" -or $backup -eq "Y") {
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        Copy-Item ".env.local" ".env.local.backup.$timestamp"
        Write-Host "✅ 已备份为 .env.local.backup.$timestamp" -ForegroundColor Green
    }
}

# 复制模板文件
if (Test-Path "env.example") {
    Copy-Item "env.example" ".env.local"
    Write-Host "✅ 已复制环境变量模板" -ForegroundColor Green
} else {
    Write-Host "❌ 未找到 env.example 文件" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 下一步操作：" -ForegroundColor Cyan
Write-Host "1. 编辑 .env.local 文件" -ForegroundColor White
Write-Host "2. 访问 https://supabase.com/dashboard 获取密钥" -ForegroundColor White
Write-Host "3. 将占位符替换为真实值" -ForegroundColor White
Write-Host "4. 运行 npm run dev 启动项目" -ForegroundColor White

Write-Host ""
Write-Host "🔐 安全提醒：" -ForegroundColor Red
Write-Host "- 绝不要将 .env.local 提交到 Git" -ForegroundColor Red
Write-Host "- 只与信任的团队成员分享密钥" -ForegroundColor Red
Write-Host "- 定期轮换生产环境密钥" -ForegroundColor Red

Write-Host ""
Write-Host "📖 详细指南请查看: 环境变量安全配置指南.md" -ForegroundColor Blue

# 询问是否立即打开编辑器
$edit = Read-Host "是否现在打开 .env.local 进行编辑？(y/N)"
if ($edit -eq "y" -or $edit -eq "Y") {
    if (Get-Command code -ErrorAction SilentlyContinue) {
        code .env.local
    } elseif (Get-Command notepad -ErrorAction SilentlyContinue) {
        notepad .env.local
    } else {
        Write-Host "请手动编辑 .env.local 文件" -ForegroundColor Yellow
    }
} 