'use server';

import { ProductQuery, ProductsResponse } from '@/types/products';
import { IProduct } from '@/types/products';

const BASE_URL = process.env.API_BASE_URL || 'https://bangaborn-server-render.onrender.com';

export async function fetchProducts(query: ProductQuery): Promise<ProductsResponse> {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      params.set(key, String(value));
    }
  });

  const url = `${BASE_URL}/api/products?${params.toString()}`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.statusText}`);
  }

  return res.json();
}


export interface ProductDetailResponse {
  success: boolean;
  product: IProduct;
}

export async function fetchProductBySlug(slug: string): Promise<ProductDetailResponse> {
  const res = await fetch(`${BASE_URL}/api/products/${slug}`, {
    next: { revalidate: 120 },
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Product not found: ${res.statusText}`);
  }

  return res.json();
}