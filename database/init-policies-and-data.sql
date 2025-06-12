-- 第二部分：权限策略、触发器和初始数据
-- 在执行完第一部分（表结构）后执行此脚本

-- 删除可能存在的旧策略（避免冲突）
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

-- 创建权限策略
-- 用户资料权限策略
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 设置权限策略
CREATE POLICY "Admins can manage settings" ON public.settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Public settings are readable" ON public.settings
    FOR SELECT USING (is_public = true);

-- 分类权限策略
CREATE POLICY "Anyone can view categories" ON public.categories
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can manage categories" ON public.categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 产品权限策略
CREATE POLICY "Anyone can view active products" ON public.products
    FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Admins can view all products" ON public.products
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can manage products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 订单权限策略
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON public.orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 订单项权限策略
CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE id = order_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create order items for own orders" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE id = order_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all order items" ON public.order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 创建触发器函数来自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 删除可能存在的旧触发器
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_settings_updated_at ON public.settings;
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;

-- 为需要的表添加 updated_at 触发器
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON public.settings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 插入基础系统设置
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

-- 插入初始分类数据
INSERT INTO public.categories (name, slug, description) VALUES
('攀岩鞋', 'climbing-shoes', '专业攀岩鞋类产品'),
('安全带', 'harnesses', '攀岩安全带和装备'),
('头盔', 'helmets', '攀岩防护头盔'),
('绳索', 'ropes', '动力绳和辅绳产品'),
('保护器材', 'protection', '快挂、岩塞等保护装备'),
('服装', 'clothing', '攀岩专用服装')
ON CONFLICT (name) DO NOTHING;

-- 插入示例产品数据
INSERT INTO public.products (name, sku, description, price, category_id, stock_quantity, is_active) VALUES
('专业攀岩鞋 - 红色', 'SHOE-001', '高性能攀岩鞋，提供卓越的抓地力和舒适性', 899.00, 
 (SELECT id FROM public.categories WHERE name = '攀岩鞋'), 50, true),
('全身式安全带', 'HARNESS-001', '舒适耐用的全身式安全带，适合多种攀岩活动', 299.00, 
 (SELECT id FROM public.categories WHERE name = '安全带'), 30, true),
('轻量化头盔', 'HELMET-001', '超轻设计，提供全面的头部保护', 199.00, 
 (SELECT id FROM public.categories WHERE name = '头盔'), 25, true),
('10.2mm动力绳 60m', 'ROPE-001', '高强度动力绳，适合技术攀登', 1299.00, 
 (SELECT id FROM public.categories WHERE name = '绳索'), 15, true),
('快挂套装', 'PROTECTION-001', '专业快挂12件套，包含各种规格', 599.00, 
 (SELECT id FROM public.categories WHERE name = '保护器材'), 40, true),
('攀岩裤', 'CLOTHING-001', '弹性面料，提供极佳的活动自由度', 399.00, 
 (SELECT id FROM public.categories WHERE name = '服装'), 60, true)
ON CONFLICT (sku) DO NOTHING; 