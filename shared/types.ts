export type Product = {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  category: string;
  image: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export function getTopCheapestAvailable(
  products: Product[],
  top: number = 3
): Product[] {
  return products
    .filter((p) => p.isAvailable)
    .sort((a, b) => a.price - b.price)
    .slice(0, top);
}
