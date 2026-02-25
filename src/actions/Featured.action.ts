'use server';

import { IProduct } from '@/types/products';

const BASE_URL = process.env.API_BASE_URL || 'https://bangaborn-server-render.onrender.com';

export interface FeaturedProductsResponse {
  success: boolean;
  count: number;
  products: IProduct[];
}

export async function fetchFeaturedProducts(limit = 6): Promise<FeaturedProductsResponse> {
  const res = await fetch(`${BASE_URL}/api/products/featured?limit=${limit}`, {
    next: { revalidate: 300 },
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch featured products: ${res.statusText}`);
  }

  return res.json();
}