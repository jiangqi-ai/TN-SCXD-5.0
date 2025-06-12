#!/bin/bash

# Git 提交前安全检查脚本
# 用于检测可能的密钥泄露

echo "🔍 执行安全检查..."

# 检查是否有 .env.local 文件被意外添加
if git diff --cached --name-only | grep -q "\.env\.local"; then
    echo "❌ 错误：.env.local 文件不应该被提交！"
    echo "请运行：git reset HEAD .env.local"
    exit 1
fi

# 检查是否有真实的 Supabase URL 格式
if git diff --cached | grep -q "https://[a-z0-9]\{20\}\.supabase\.co"; then
    echo "❌ 错误：检测到可能的真实 Supabase URL！"
    echo "请确保没有硬编码真实的项目URL"
    exit 1
fi

# 检查是否有真实的 JWT 密钥（长度超过100的eyJ开头字符串）
if git diff --cached | grep -q "eyJ[A-Za-z0-9_-]\{100,\}"; then
    echo "❌ 错误：检测到可能的真实 JWT 密钥！"
    echo "请确保没有硬编码真实密钥"
    exit 1
fi

# 检查是否有其他敏感信息
SENSITIVE_PATTERNS=(
    "password.*=.*[^example]"
    "secret.*=.*[^example]"
    "key.*=.*[^example]"
    "token.*=.*[^example]"
)

for pattern in "${SENSITIVE_PATTERNS[@]}"; do
    if git diff --cached | grep -qi "$pattern"; then
        echo "⚠️  警告：检测到可能的敏感信息模式：$pattern"
        echo "请确认这不是真实的密钥或密码"
        read -p "继续提交吗？(y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
done

echo "✅ 安全检查通过！"
exit 0 