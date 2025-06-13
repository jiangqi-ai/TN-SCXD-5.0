-- 攀岩装备商城数据库表结构
-- 在 Supabase SQL Editor 中执行以下代码

-- 1. 产品表
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 用户表
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 购物车表
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 4. 订单表
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 订单项目表
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 创建更新时间的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. 为需要的表添加更新时间触发器
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. 插入示例数据
INSERT INTO users (name, email) VALUES 
('张三', 'zhangsan@example.com'),
('李四', 'lisi@example.com'),
('王五', 'wangwu@example.com');

INSERT INTO products (name, description, price, image_url, category, stock) VALUES 
('专业攀岩绳', '高强度动力绳，适合各种攀岩活动。采用优质尼龙材料制作，具有出色的弹性和耐磨性。', 299.99, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop', '绳索', 50),
('攀岩头盔', '轻量化安全头盔，提供全面保护。通风设计，佩戴舒适，符合国际安全标准。', 199.99, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', '安全装备', 30),
('攀岩鞋', '专业攀岩鞋，提供优异抓地力。橡胶鞋底设计，适合各种岩面类型。', 399.99, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop', '鞋类', 25),
('攀岩背包', '专业攀岩背包，大容量设计，多个分隔袋便于装备分类存放。', 159.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', '背包', 40),
('攀岩手套', '防滑攀岩手套，提供良好的抓握力和手部保护。透气材质，长时间使用不闷热。', 89.99, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', '手套', 60),
('攀岩粉袋', '专业攀岩粉袋，可调节腰带，方便取用镁粉。耐用材质，不易破损。', 39.99, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop', '配件', 80);

-- 9. 创建RLS (Row Level Security) 策略
-- 启用RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 产品表：所有人可读，管理员可写
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Products are editable by service role" ON products FOR ALL USING (auth.role() = 'service_role');

-- 用户表：用户只能看到自己的信息
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (true);
CREATE POLICY "Users are editable by service role" ON users FOR ALL USING (auth.role() = 'service_role');

-- 购物车：用户只能看到自己的购物车
CREATE POLICY "Users can view own cart" ON cart_items FOR SELECT USING (true);
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.role() = 'service_role');

-- 订单：用户只能看到自己的订单
CREATE POLICY "Users can view orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Orders are manageable by service role" ON orders FOR ALL USING (auth.role() = 'service_role');

-- 订单项目：与订单相同的策略
CREATE POLICY "Users can view order items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Order items are manageable by service role" ON order_items FOR ALL USING (auth.role() = 'service_role'); 