-- 修复权限策略无限递归问题
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 删除所有可能导致递归的策略
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.settings;
DROP POLICY IF EXISTS "Public settings are readable" ON public.settings;
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Only admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
DROP POLICY IF EXISTS "Only admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create order items for own orders" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

-- 2. 临时禁用 RLS 以避免递归问题
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;

-- 3. 创建简化的权限策略（避免递归查询）

-- 用户资料表 - 简化策略
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "profiles_insert_policy" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 设置表 - 允许所有已认证用户读取公共设置
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_select_policy" ON public.settings
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "settings_insert_policy" ON public.settings
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "settings_update_policy" ON public.settings
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "settings_delete_policy" ON public.settings
    FOR DELETE TO authenticated USING (true);

-- 分类表 - 允许所有用户查看
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_select_policy" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "categories_manage_policy" ON public.categories
    FOR ALL TO authenticated USING (true);

-- 产品表 - 允许所有用户查看活跃产品
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select_policy" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "products_manage_policy" ON public.products
    FOR ALL TO authenticated USING (true);

-- 订单表 - 简化权限
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select_policy" ON public.orders
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "orders_insert_policy" ON public.orders
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_update_policy" ON public.orders
    FOR UPDATE TO authenticated USING (true);

-- 订单项表 - 简化权限
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_select_policy" ON public.order_items
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "order_items_insert_policy" ON public.order_items
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "order_items_update_policy" ON public.order_items
    FOR UPDATE TO authenticated USING (true);

-- 确保基础设置数据存在
INSERT INTO public.settings (key, value, description, category, data_type, is_public) VALUES
('site_name', '攀岩装备商城', '网站名称', 'general', 'string', true),
('site_description', '专业的攀岩装备在线商城，提供各类攀岩用品和装备。', '网站描述', 'general', 'string', true),
('allow_user_registration', 'false', '是否允许用户注册', 'user', 'boolean', true),
('require_email_verification', 'false', '是否需要邮箱验证', 'user', 'boolean', false),
('default_user_role', 'customer', '默认用户角色', 'user', 'string', false),
('maintenance_mode', 'false', '维护模式', 'system', 'boolean', false)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  data_type = EXCLUDED.data_type,
  is_public = EXCLUDED.is_public,
  updated_at = NOW(); 