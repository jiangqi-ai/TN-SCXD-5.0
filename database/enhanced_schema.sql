-- ================================================
-- 攀岩装备在线下单系统 - 增强版数据库结构
-- ================================================

-- 清理现有数据（开发环境）
DROP TABLE IF EXISTS public.shopping_cart CASCADE;
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.discounts CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ================================================
-- 1. 用户管理表 (增强版)
-- ================================================
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    phone TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    country TEXT DEFAULT '中国',
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (id)
);

-- ================================================
-- 2. 产品分类表 (增强版)
-- ================================================
CREATE TABLE public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ================================================
-- 3. 产品表 (增强版)
-- ================================================
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    specifications TEXT, -- JSON格式存储详细规格
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    original_price DECIMAL(10,2), -- 原价(用于折扣显示)
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    min_stock_level INTEGER DEFAULT 5, -- 最小库存预警
    weight DECIMAL(8,2), -- 重量(kg)
    dimensions TEXT, -- 尺寸规格
    image_url TEXT, -- 主图片
    gallery_images TEXT[], -- 图片组(数组)
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false, -- 是否推荐产品
    view_count INTEGER DEFAULT 0, -- 浏览次数
    sales_count INTEGER DEFAULT 0, -- 销售数量
    tags TEXT[], -- 标签数组
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ================================================
-- 4. 订单表 (增强版)
-- ================================================
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE, -- 订单号
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    discount_amount DECIMAL(10,2) DEFAULT 0,
    shipping_fee DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL CHECK (final_amount >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_method TEXT CHECK (payment_method IN ('wechat', 'alipay', 'bank_transfer', 'cash_on_delivery')),
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'partial_refund')),
    
    -- 收货信息
    shipping_name TEXT NOT NULL,
    shipping_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_postal_code TEXT,
    
    notes TEXT, -- 订单备注
    admin_notes TEXT, -- 管理员备注
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE
);

-- ================================================
-- 5. 订单项表 (增强版)
-- ================================================
CREATE TABLE public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL, -- 快照产品名称
    product_sku TEXT NOT NULL, -- 快照SKU
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ================================================
-- 6. 购物车表
-- ================================================
CREATE TABLE public.shopping_cart (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, product_id)
);

-- ================================================
-- 7. 系统设置表
-- ================================================
CREATE TABLE public.settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    data_type TEXT DEFAULT 'string' CHECK (data_type IN ('string', 'number', 'boolean', 'json')),
    is_public BOOLEAN DEFAULT false, -- 是否对前端公开
    updated_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ================================================
-- 8. 折扣优惠表
-- ================================================
CREATE TABLE public.discounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE, -- 优惠码
    type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed_amount', 'free_shipping')),
    value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    max_discount_amount DECIMAL(10,2), -- 最大折扣金额
    usage_limit INTEGER, -- 使用次数限制
    used_count INTEGER DEFAULT 0, -- 已使用次数
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_to TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ================================================
-- 创建索引以提高查询性能
-- ================================================

-- 产品相关索引
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_products_featured ON public.products(is_featured);
CREATE INDEX idx_products_stock ON public.products(stock_quantity);
CREATE INDEX idx_products_price ON public.products(price);

-- 订单相关索引
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_date ON public.orders(created_at);
CREATE INDEX idx_orders_number ON public.orders(order_number);

-- 订单项索引
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_order_items_product ON public.order_items(product_id);

-- 购物车索引
CREATE INDEX idx_shopping_cart_user ON public.shopping_cart(user_id);

-- ================================================
-- 设置 RLS (Row Level Security)
-- ================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;

-- ================================================
-- RLS 策略设置
-- ================================================

-- 用户资料权限策略
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 分类权限策略
CREATE POLICY "Anyone can view active categories" ON public.categories
    FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 产品权限策略
CREATE POLICY "Anyone can view active products" ON public.products
    FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Admins can manage products" ON public.products
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

CREATE POLICY "Users can update own pending orders" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can manage all orders" ON public.orders
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

CREATE POLICY "Admins can manage all order items" ON public.order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 购物车权限策略
CREATE POLICY "Users can manage own cart" ON public.shopping_cart
    FOR ALL USING (auth.uid() = user_id);

-- 系统设置权限策略
CREATE POLICY "Anyone can view public settings" ON public.settings
    FOR SELECT TO authenticated USING (is_public = true);

CREATE POLICY "Admins can manage all settings" ON public.settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 折扣权限策略
CREATE POLICY "Anyone can view active discounts" ON public.discounts
    FOR SELECT TO authenticated USING (is_active = true AND NOW() BETWEEN valid_from AND valid_to);

CREATE POLICY "Admins can manage discounts" ON public.discounts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ================================================
-- 触发器函数
-- ================================================

-- 自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 生成订单号
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'TN' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(NEXTVAL('order_sequence')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 更新产品销售数量
CREATE OR REPLACE FUNCTION public.update_product_sales()
RETURNS TRIGGER AS $$
BEGIN
    -- 当订单状态变为已确认时，更新产品销售数量和库存
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        UPDATE public.products 
        SET 
            sales_count = sales_count + (
                SELECT COALESCE(SUM(quantity), 0) 
                FROM public.order_items 
                WHERE order_id = NEW.id AND product_id = products.id
            ),
            stock_quantity = stock_quantity - (
                SELECT COALESCE(SUM(quantity), 0) 
                FROM public.order_items 
                WHERE order_id = NEW.id AND product_id = products.id
            )
        WHERE id IN (
            SELECT product_id FROM public.order_items WHERE order_id = NEW.id
        );
    END IF;
    
    -- 当订单取消时，恢复库存
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        UPDATE public.products 
        SET stock_quantity = stock_quantity + (
            SELECT COALESCE(SUM(quantity), 0) 
            FROM public.order_items 
            WHERE order_id = NEW.id AND product_id = products.id
        )
        WHERE id IN (
            SELECT product_id FROM public.order_items WHERE order_id = NEW.id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- 创建序列和触发器
-- ================================================

-- 订单号序列
CREATE SEQUENCE IF NOT EXISTS order_sequence START 1;

-- 添加 updated_at 触发器
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
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

CREATE TRIGGER update_shopping_cart_updated_at
    BEFORE UPDATE ON public.shopping_cart
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON public.settings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 订单号生成触发器
CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

-- 产品销售数量更新触发器
CREATE TRIGGER update_product_sales_trigger
    AFTER UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.update_product_sales();

-- ================================================
-- 初始化数据
-- ================================================

-- 插入攀岩装备分类
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
    ('攀岩板', 'climbing-boards', '室内攀岩训练板，提升技能的最佳选择', 1),
    ('岩点', 'climbing-holds', '各种形状和难度的攀岩点，丰富路线设计', 2),
    ('复合板', 'composite-boards', '多功能复合训练板，综合能力提升', 3),
    ('五金配件', 'hardware', '攀岩相关的各类五金配件和工具', 4),
    ('安全装备', 'safety-gear', '保护装备，确保攀岩安全', 5),
    ('训练器材', 'training-equipment', '专业训练器材，提升攀岩能力', 6);

-- 插入系统设置
INSERT INTO public.settings (key, value, description, category, data_type, is_public) VALUES
    -- 常规设置
    ('site_name', '攀岩装备专营店', '网站名称', 'general', 'string', true),
    ('site_description', '专业的攀岩装备在线购买平台', '网站描述', 'general', 'string', true),
    ('site_logo_url', '/logo.png', '网站Logo地址', 'general', 'string', true),
    ('maintenance_mode', 'false', '维护模式开关', 'general', 'boolean', false),
    
    -- 联系信息
    ('contact_phone', '400-888-8888', '客服电话', 'contact', 'string', true),
    ('contact_email', 'service@climbing-gear.com', '客服邮箱', 'contact', 'string', true),
    ('contact_address', '北京市朝阳区攀岩大厦', '公司地址', 'contact', 'string', true),
    ('business_hours', '9:00-18:00', '营业时间', 'contact', 'string', true),
    
    -- 配送设置
    ('free_shipping_threshold', '299', '免费配送门槛金额', 'shipping', 'number', true),
    ('default_shipping_fee', '15', '默认配送费用', 'shipping', 'number', true),
    ('express_shipping_fee', '25', '快递配送费用', 'shipping', 'number', true),
    ('shipping_processing_days', '1-2', '配送处理时间（工作日）', 'shipping', 'string', true),
    
    -- 支付设置
    ('payment_methods', '["wechat", "alipay", "bank_transfer"]', '支持的支付方式', 'payment', 'json', false),
    ('wechat_pay_enabled', 'true', '微信支付开关', 'payment', 'boolean', false),
    ('alipay_enabled', 'true', '支付宝开关', 'payment', 'boolean', false),
    ('bank_transfer_enabled', 'true', '银行转账开关', 'payment', 'boolean', false),
    
    -- 订单设置
    ('order_auto_confirm', 'false', '订单自动确认', 'order', 'boolean', false),
    ('order_cancel_timeout', '30', '订单自动取消时间（分钟）', 'order', 'number', false),
    ('order_return_days', '7', '订单退货天数', 'order', 'number', true),
    ('min_order_amount', '50', '最小订单金额', 'order', 'number', true),
    
    -- 数据库配置
    ('db_backup_enabled', 'true', '数据库自动备份', 'database', 'boolean', false),
    ('db_backup_frequency', 'daily', '备份频率', 'database', 'string', false),
    ('db_backup_retention_days', '30', '备份保留天数', 'database', 'number', false),
    ('db_connection_pool_size', '10', '数据库连接池大小', 'database', 'number', false),
    ('db_query_timeout', '30', '查询超时时间（秒）', 'database', 'number', false),
    ('low_stock_alert', '5', '低库存预警数量', 'database', 'number', false),
    ('cart_cleanup_days', '30', '购物车清理天数', 'database', 'number', false);

-- 插入示例产品
INSERT INTO public.products (name, sku, description, price, original_price, category_id, stock_quantity, min_stock_level, specifications, tags, is_featured) VALUES
    ('专业训练攀岩板 - 60度倾斜', 'CB-60-PRO', '60度倾斜角度的专业训练攀岩板，适合中高级训练者使用。采用优质木材制作，表面防滑处理。', 2999.00, 3499.00, 
     (SELECT id FROM public.categories WHERE slug = 'climbing-boards'), 15, 3,
     '{"尺寸": "120cm × 240cm", "材质": "多层桦木胶合板", "厚度": "18mm", "倾斜角度": "60°", "承重": "150kg"}',
     ARRAY['专业', '训练', '60度', '木制'], true),
    
    ('初学者攀岩板套装', 'CB-BEGIN-SET', '适合初学者的攀岩板套装，包含攀岩板和基础岩点。角度可调节，循序渐进提升技能。', 1899.00, 2299.00,
     (SELECT id FROM public.categories WHERE slug = 'climbing-boards'), 20, 5,
     '{"尺寸": "100cm × 200cm", "材质": "多层胶合板", "角度": "可调节15-45°", "配件": "含20个基础岩点"}',
     ARRAY['初学者', '套装', '可调节'], true),
     
    ('经典岩点套装 - 30个装', 'CH-CLASSIC-30', '经典岩点套装，包含30个不同形状和颜色的岩点，适合设计各种难度的路线。', 299.00, NULL,
     (SELECT id FROM public.categories WHERE slug = 'climbing-holds'), 50, 10,
     '{"数量": "30个", "材质": "聚氨酯", "规格": "混合尺寸", "颜色": "多色"}',
     ARRAY['经典', '套装', '30个', '聚氨酯'], false),
     
    ('大号把手岩点', 'CH-LARGE-JUG', '大号把手型岩点，适合初学者和热身使用。抓握舒适，安装简便。', 45.00, NULL,
     (SELECT id FROM public.categories WHERE slug = 'climbing-holds'), 100, 20,
     '{"尺寸": "大号", "类型": "把手型", "材质": "聚氨酯", "颜色": "随机"}',
     ARRAY['大号', '把手', '初学者'], false),
     
    ('多功能复合训练板', 'CPB-MULTI-PRO', '集成多种训练功能的复合板，包含指力板、悬吊点等。全面提升攀岩能力。', 1599.00, 1899.00,
     (SELECT id FROM public.categories WHERE slug = 'composite-boards'), 12, 3,
     '{"功能": "指力+悬吊+平衡", "尺寸": "80cm × 40cm", "材质": "榉木", "配件": "含安装件"}',
     ARRAY['多功能', '复合', '指力', '悬吊'], true),
     
    ('不锈钢膨胀螺栓套装', 'HW-BOLT-SET', '专业攀岩用不锈钢膨胀螺栓，10个装。强度高，耐腐蚀，安装可靠。', 89.00, NULL,
     (SELECT id FROM public.categories WHERE slug = 'hardware'), 80, 15,
     '{"数量": "10个", "材质": "304不锈钢", "规格": "M10×100mm", "承重": "2000kg"}',
     ARRAY['不锈钢', '膨胀螺栓', '10个装'], false);

-- 创建初始管理员账户（需要在用户注册后手动执行）
-- 注意：需要替换为实际的用户UUID
-- INSERT INTO public.profiles (id, email, full_name, role) VALUES 
-- ('00000000-0000-0000-0000-000000000000', 'admin@climbing-gear.com', '系统管理员', 'admin');

-- ================================================
-- 创建有用的视图
-- ================================================

-- 产品详情视图（包含分类信息）
CREATE VIEW public.product_details AS
SELECT 
    p.*,
    c.name as category_name,
    c.slug as category_slug
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id;

-- 订单详情视图（包含用户和订单项信息）
CREATE VIEW public.order_details AS
SELECT 
    o.*,
    u.full_name as customer_name,
    u.email as customer_email,
    COALESCE(SUM(oi.quantity), 0) as total_items
FROM public.orders o
LEFT JOIN public.profiles u ON o.user_id = u.id
LEFT JOIN public.order_items oi ON o.id = oi.order_id
GROUP BY o.id, u.full_name, u.email;

-- 库存预警视图
CREATE VIEW public.low_stock_products AS
SELECT 
    p.*,
    c.name as category_name
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
WHERE p.stock_quantity <= p.min_stock_level AND p.is_active = true;

COMMENT ON TABLE public.profiles IS '用户资料表 - 存储用户基本信息和权限';
COMMENT ON TABLE public.categories IS '产品分类表 - 攀岩装备分类管理';
COMMENT ON TABLE public.products IS '产品表 - 攀岩装备产品信息';
COMMENT ON TABLE public.orders IS '订单表 - 订单主要信息';
COMMENT ON TABLE public.order_items IS '订单项表 - 订单商品详情';
COMMENT ON TABLE public.shopping_cart IS '购物车表 - 用户购物车';
COMMENT ON TABLE public.settings IS '系统设置表 - 网站配置参数';
COMMENT ON TABLE public.discounts IS '折扣表 - 优惠券和折扣活动'; 