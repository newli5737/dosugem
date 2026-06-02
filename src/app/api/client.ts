export type MenhType = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';

export interface Product {
  id: string;
  slug: string;
  name: string;
  spec: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  salePercent?: number;
  isNew?: boolean;
  isHot?: boolean;
  menh?: MenhType[];
  category: string;
  categorySlug: string;
  description?: string;
  fengShuiMeaning?: string;
  sku?: string;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  specs?: Record<string, string>;
}

export interface Category {
  slug: string;
  name: string;
  image: string;
  count: number;
}

export interface BlogPost {
  id: number | string;
  cat: string;
  title: string;
  excerpt: string;
  img: string;
}

const API = import.meta.env.VITE_API_URL || '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  getProducts: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ products: Product[]; total: number; page: number; totalPages: number }>(`/products${q}`);
  },
  getProduct: (slug: string) => request<Product>(`/products/${slug}`),
  getCategories: () => request<Category[]>('/categories'),
  validateCoupon: (code: string) => request<{ code: string; discountPercent: number }>('/orders/validate-coupon', {
    method: 'POST',
    body: JSON.stringify({ code }),
  }),
  createOrder: (data: unknown) => request<{ orderNumber: string; total: number }>('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  login: (email: string, password: string) => request<{ token: string; admin: { name: string; email: string } }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  admin: {
    get: <T>(path: string, token: string) => request<T>(`/admin${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    post: <T>(path: string, token: string, body: unknown) => request<T>(`/admin${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    }),
    put: <T>(path: string, token: string, body: unknown) => request<T>(`/admin${path}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    }),
    patch: <T>(path: string, token: string, body: unknown) => request<T>(`/admin${path}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    }),
    delete: (path: string, token: string) => request<{ ok: boolean }>(`/admin${path}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
  },
};
