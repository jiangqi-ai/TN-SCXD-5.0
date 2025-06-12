# Git 提交前安全检查脚本 (PowerShell 版本)
# 用于检测可能的密钥泄露

Write-Host "🔍 执行安全检查..." -ForegroundColor Cyan

# 检查是否有 .env.local 文件被意外添加
$stagedFiles = git diff --cached --name-only
if ($stagedFiles -match "\.env\.local") {
    Write-Host "❌ 错误：.env.local 文件不应该被提交！" -ForegroundColor Red
    Write-Host "请运行：git reset HEAD .env.local" -ForegroundColor Yellow
    exit 1
}

# 检查是否有真实的 Supabase URL 格式
$stagedContent = git diff --cached
if ($stagedContent -match "https://[a-z0-9]{20}\.supabase\.co") {
    Write-Host "❌ 错误：检测到可能的真实 Supabase URL！" -ForegroundColor Red
    Write-Host "请确保没有硬编码真实的项目URL" -ForegroundColor Yellow
    exit 1
}

# 检查是否有真实的 JWT 密钥（长度超过100的eyJ开头字符串）
if ($stagedContent -match "eyJ[A-Za-z0-9_-]{100,}") {
    Write-Host "❌ 错误：检测到可能的真实 JWT 密钥！" -ForegroundColor Red
    Write-Host "请确保没有硬编码真实密钥" -ForegroundColor Yellow
    exit 1
}

# 检查是否有其他敏感信息
$sensitivePatterns = @(
    "password.*=.*[^example]",
    "secret.*=.*[^example]",
    "key.*=.*[^example]",
    "token.*=.*[^example]"
)

foreach ($pattern in $sensitivePatterns) {
    if ($stagedContent -match $pattern) {
        Write-Host "⚠️  警告：检测到可能的敏感信息模式：$pattern" -ForegroundColor Yellow
        Write-Host "请确认这不是真实的密钥或密码" -ForegroundColor Yellow
        $response = Read-Host "继续提交吗？(y/N)"
        if ($response -ne "y" -and $response -ne "Y") {
            exit 1
        }
    }
}

Write-Host "✅ 安全检查通过！" -ForegroundColor Green
exit 0 