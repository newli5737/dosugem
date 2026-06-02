import { useState, useEffect } from 'react';
import { api, type Product, type Category } from '../api/client';

export function useProducts(params?: Record<string, string>) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const key = JSON.stringify(params ?? null);

  useEffect(() => {
    if (!params) {
      setProducts([]);
      setTotal(0);
      setTotalPages(1);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    api.getProducts(params)
      .then(r => { setProducts(r.products); setTotal(r.total); setTotalPages(r.totalPages); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [key]);

  return { products, total, totalPages, loading, error };
}

export function useProduct(slug: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.getProduct(slug)
      .then(setProduct)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return { product, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
