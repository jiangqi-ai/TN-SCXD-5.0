import { NextResponse } from 'next/server'
import { getOrders, createOrder } from '@/lib/database'

// 临时使用固定用户ID，实际应该从session获取
const DEMO_USER_ID = 1

export async function GET() {
  try {
    const orders = await getOrders(DEMO_USER_ID)
    return NextResponse.json(orders)
  } catch (error) {
    console.error('获取订单列表失败:', error)
    return NextResponse.json(
      { error: '获取订单列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const order = await createOrder(DEMO_USER_ID, data.items)
    return NextResponse.json(order)
  } catch (error) {
    console.error('创建订单失败:', error)
    return NextResponse.json(
      { error: '创建订单失败' },
      { status: 500 }
    )
  }
} 