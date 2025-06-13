import { NextResponse } from 'next/server';
import { getProduct, updateProduct, deleteProduct } from '@/lib/database';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProduct(parseInt(params.id));

    if (!product) {
      return NextResponse.json(
        { error: '产品不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('获取产品详情失败:', error);
    return NextResponse.json(
      { error: '获取产品详情失败' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const product = await updateProduct(parseInt(params.id), {
      name,
      description,
      price: parseFloat(price),
      image_url: image_url || '',
      category,
      stock: parseInt(stock) || 0
    });

    if (!product) {
      return NextResponse.json(
        { error: '产品不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('更新产品失败:', error);
    return NextResponse.json(
      { error: '更新产品失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteProduct(parseInt(params.id));

    if (!success) {
      return NextResponse.json(
        { error: '产品不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: '产品已删除' });
  } catch (error) {
    console.error('删除产品失败:', error);
    return NextResponse.json(
      { error: '删除产品失败' },
      { status: 500 }
    );
  }
} 