-- 初始化用户注册相关设置
-- 在 Supabase Dashboard 的 SQL Editor 中执行此脚本

INSERT INTO settings (key, value, description, category, data_type, is_public) VALUES
('allow_user_registration', 'true', '是否允许用户注册', 'user', 'boolean', true),
('require_email_verification', 'false', '是否需要邮箱验证', 'user', 'boolean', false),
('max_users_per_day', '100', '每日最大注册用户数', 'user', 'number', false),
('registration_message', '欢迎注册攀岩装备商城！', '注册页面提示信息', 'user', 'string', true),
('login_attempts_limit', '5', '登录失败次数限制', 'user', 'number', false)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  data_type = EXCLUDED.data_type,
  is_public = EXCLUDED.is_public,
  updated_at = NOW(); 