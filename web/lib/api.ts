import type { PaginatedResponse, Product } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001";

export type ListParams = {
  search?: string;
  sort?: "price" | "name";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
  available?: boolean;
};

export async function fetchProducts(params: ListParams = {}): Promise<PaginatedResponse<Product>> {
  const url = new URL("/api/products", API_BASE);
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    url.searchParams.set(key, String(value));
  });
  const res = await fetch(url.toString(), { next: { revalidate: 10 } });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProduct(id: string): Promise<Product> {
  const url = `${API_BASE}/api/products/${id}`;
  const res = await fetch(url, { next: { revalidate: 10 } });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}


