import { NextResponse } from 'next/server';
import { getCartItems, addToCart, removeFromCart, clearCart, updateCartItem } from '@/lib/database';

// 临时使用固定用户ID，实际应该从session中获取
const DEMO_USER_ID = 1;

export async function GET() {
  try {
    const cart = await getCartItems(DEMO_USER_ID);
    return NextResponse.json(cart);
  } catch (error) {
    console.error('获取购物车失败:', error);
    return NextResponse.json(
      { error: '获取购物车失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { product_id, quantity } = await request.json();
    
    if (!product_id || !quantity) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    await addToCart(DEMO_USER_ID, product_id, quantity);
    return NextResponse.json({ message: '添加商品到购物车成功' });
  } catch (error) {
    console.error('添加商品到购物车失败:', error);
    return NextResponse.json(
      { error: '添加商品到购物车失败' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { cart_item_id, quantity } = await request.json();
    
    if (!cart_item_id || quantity === undefined) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    await updateCartItem(cart_item_id, quantity);
    return NextResponse.json({ message: '更新购物车成功' });
  } catch (error) {
    console.error('更新购物车失败:', error);
    return NextResponse.json(
      { error: '更新购物车失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.text();
    
    if (!body) {
      // 清空整个购物车
      await clearCart(DEMO_USER_ID);
      return NextResponse.json({ message: '购物车已清空' });
    }

    const { cart_item_id } = JSON.parse(body);
    
    if (!cart_item_id) {
      return NextResponse.json(
        { error: '缺少购物车项ID' },
        { status: 400 }
      );
    }

    await removeFromCart(cart_item_id);
    return NextResponse.json({ message: '商品已从购物车中移除' });
  } catch (error) {
    console.error('删除购物车商品失败:', error);
    return NextResponse.json(
      { error: '删除购物车商品失败' },
      { status: 500 }
    );
  }
} 