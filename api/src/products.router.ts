import { Router } from "express";
import { z } from "zod";
import productsData from "./data/products.json";
import { Product } from "./types";

const router = Router();

const querySchema = z.object({
  search: z.string().trim().optional(),
  sort: z.enum(["price", "name"]).optional(),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  available: z.coerce.boolean().optional(),
});

const products: Product[] = productsData as unknown as Product[];

router.get("/", (req, res) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid query params", details: parsed.error.format() });
  }

  const { search, sort, order, page, limit, available } = parsed.data;

  let list = [...products];

  if (typeof available === "boolean") {
    list = list.filter((p) => p.isAvailable === available);
  }

  if (search) {
    const term = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term)
    );
  }

  if (sort) {
    list.sort((a, b) => {
      const dir = order === "desc" ? -1 : 1;
      if (sort === "price") return (a.price - b.price) * dir;
      return a.name.localeCompare(b.name) * dir;
    });
  }

  const total = list.length;
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  const start = (currentPage - 1) * limit;
  const paginated = list.slice(start, start + limit);

  return res.json({
    data: paginated,
    meta: { total, page: currentPage, limit, totalPages },
  });
});

router.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  return res.json(product);
});

export default router;
