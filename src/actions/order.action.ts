'use server';

import { CreateOrderPayload, OrderResponse } from '@/types/order';

const BASE_URL = process.env.API_BASE_URL || 'https://bangaborn-server-render.onrender.com';

export async function createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const data: OrderResponse = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to place order. Please try again.');
  }

  return data;
}