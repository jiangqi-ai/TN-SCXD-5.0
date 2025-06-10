@echo off
chcp 65001 >nul
echo.
echo ==========================================
echo    攀岩装备系统 - Supabase 配置助手
echo ==========================================
echo.

REM 检查.env.local文件是否存在
if not exist ".env.local" (
    echo 📋 正在创建 .env.local 文件...
    copy env.example .env.local >nul
    echo ✅ .env.local 文件已创建
) else (
    echo ℹ️  .env.local 文件已存在
)

echo.
echo 🔧 配置步骤：
echo.
echo 1. 访问 Supabase Dashboard：
echo    https://supabase.com/dashboard
echo.
echo 2. 创建新项目或选择现有项目
echo.
echo 3. 在项目中找到 Settings ^> API
echo.
echo 4. 复制以下信息到 .env.local 文件：
echo    - Project URL
echo    - anon public key
echo    - service_role key
echo.

REM 尝试打开.env.local文件
echo 📝 是否要打开 .env.local 文件进行编辑？ (Y/N)
set /p choice=请选择: 
if /i "%choice%"=="Y" (
    start notepad .env.local
    echo ✅ 已打开文件编辑器
)

echo.
echo 📖 详细配置说明请查看：
echo    - SUPABASE_SETUP.md
echo    - SETUP.md
echo.

REM 询问是否要打开Supabase网站
echo 🌐 是否要打开 Supabase 网站？ (Y/N)
set /p choice2=请选择: 
if /i "%choice2%"=="Y" (
    start https://supabase.com/dashboard
    echo ✅ 已打开 Supabase Dashboard
)

echo.
echo 📋 配置完成后的验证步骤：
echo    1. 保存 .env.local 文件
echo    2. 运行: npm run dev
echo    3. 访问: http://localhost:3000
echo.
echo 🆘 如有问题，请查看 SUPABASE_SETUP.md 文件
echo.
pause 