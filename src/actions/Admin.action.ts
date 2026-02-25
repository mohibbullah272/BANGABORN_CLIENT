'use server';

import { cookies } from 'next/headers';
import { AdminLoginPayload, AdminLoginResponse, OrdersResponse, IOrder } from '@/types/admin';
import { IProduct, ProductQuery, ProductsResponse } from '@/types/products';

const BASE_URL = process.env.API_BASE_URL || 'https://bangaborn-server-render.onrender.com';

// ─── Auth ───────────────────────────────────────────────────────────────────

export async function adminLogin(payload: AdminLoginPayload): Promise<AdminLoginResponse> {
  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  const data: AdminLoginResponse = await res.json();
  if (data.success && data.token) {
    (await cookies()).set('admin_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }
  return data;
}

export async function adminLogout(): Promise<void> {
  (await cookies()).delete('admin_token');
}

export async function getAdminToken(): Promise<string | null> {
  return (await cookies()).get('admin_token')?.value ?? null;
}

export async function verifyAdminToken(): Promise<boolean> {
  const token = await getAdminToken();

  if (!token) return false;
  try {
    const res = await fetch(`${BASE_URL}/api/admin/verify`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

// ─── Orders ─────────────────────────────────────────────────────────────────

export async function fetchAdminOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<OrdersResponse> {
  const token = await getAdminToken();
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.status && params.status !== 'all') query.set('status', params.status);

  const res = await fetch(`${BASE_URL}/api/orders?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  return res.json();
}

export async function fetchAdminSingleOrder(id: string): Promise<{ success: boolean; order: IOrder }> {
  const token = await getAdminToken();
  const res = await fetch(`${BASE_URL}/api/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  return res.json();
}

export async function updateOrderStatus(id: string, status: string): Promise<{ success: boolean; message?: string }> {
  const token = await getAdminToken();
  const res = await fetch(`${BASE_URL}/api/admin/orders/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
    cache: 'no-store',
  });
  return res.json();
}

export async function cancelOrder(id: string): Promise<{ success: boolean; message?: string }> {
  const token = await getAdminToken();
  const res = await fetch(`${BASE_URL}/api/orders/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  return res.json();
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function fetchAdminProducts(query?: Partial<ProductQuery>): Promise<ProductsResponse> {
  const token = await getAdminToken();
  const params = new URLSearchParams();
  params.set('page', String(query?.page || '1'));
  params.set('limit', String(query?.limit || '12'));
  if (query?.search) params.set('search', query.search);
  if (query?.category) params.set('category', query.category);

  const res = await fetch(`${BASE_URL}/api/products?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  return res.json();
}

export async function createProduct(data: Partial<IProduct>): Promise<{ success: boolean; message?: string; product?: IProduct }> {
  const token = await getAdminToken();
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  return res.json();
}

export async function updateProduct(id: string, data: Partial<IProduct>): Promise<{ success: boolean; message?: string; product?: IProduct }> {
  const token = await getAdminToken();
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  return res.json();
}

export async function deleteProduct(id: string): Promise<{ success: boolean; message?: string }> {
  const token = await getAdminToken();
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  return res.json();
}