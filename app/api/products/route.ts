import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/database';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('获取产品列表失败:', error);
    return NextResponse.json(
      { error: '获取产品列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, description, price, image_url, category, stock } = data;

    // 验证必填字段
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    const product = await createProduct({
      name,
      description,
      price: parseFloat(price),
      image_url: image_url || '',
      category,
      stock: parseInt(stock) || 0
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('创建产品失败:', error);
    return NextResponse.json(
      { error: '创建产品失败' },
      { status: 500 }
    );
  }
} 