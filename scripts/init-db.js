const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : undefined
})

async function initDatabase() {
  try {
    // 读取SQL文件
    const sqlFile = path.join(__dirname, '../migrations/001_initial_schema.sql')
    const sql = fs.readFileSync(sqlFile, 'utf8')

    // 执行SQL
    await pool.query(sql)
    console.log('数据库初始化成功')

    // 创建测试数据
    await createTestData()
    console.log('测试数据创建成功')

  } catch (error) {
    console.error('数据库初始化失败:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

async function createTestData() {
  // 创建测试用户
  const userResult = await pool.query(
    'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
    ['admin', 'admin@example.com', 'dummy_hash', 'admin']
  )
  const userId = userResult.rows[0].id

  // 创建测试产品
  const products = [
    {
      name: '测试产品1',
      description: '这是一个测试产品',
      price: 99.99,
      image_url: '/uploads/test1.jpg',
      category: '测试分类',
      stock: 100
    },
    {
      name: '测试产品2',
      description: '这是另一个测试产品',
      price: 199.99,
      image_url: '/uploads/test2.jpg',
      category: '测试分类',
      stock: 50
    }
  ]

  for (const product of products) {
    await pool.query(
      'INSERT INTO products (name, description, price, image_url, category, stock) VALUES ($1, $2, $3, $4, $5, $6)',
      [product.name, product.description, product.price, product.image_url, product.category, product.stock]
    )
  }
}

initDatabase() 