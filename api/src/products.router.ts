import { Router } from "express";
import { z } from "zod";
import productsData from "./data/products.json";
import { Product } from "./types";
import { promises as fs } from "fs";
import path from "path";

const router = Router();

const querySchema = z.object({
  search: z.string().trim().optional(),
  sort: z.enum(["price", "name"]).optional(),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  available: z.coerce.boolean().optional(),
});

let products: Product[] = productsData as unknown as Product[];

const productBodySchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  isAvailable: z.boolean(),
  category: z.string().min(1),
  image: z.string().min(1),
});

async function saveProducts(toSave: Product[]): Promise<void> {
  const filePath = path.join(__dirname, "data", "products.json");
  await fs.writeFile(filePath, JSON.stringify(toSave, null, 2), "utf-8");
}

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

router.post("/", async (req, res) => {
  const parsed = productBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid body", details: parsed.error.format() });
  }
  const id = `p${Date.now()}`;
  const newProduct: Product = { id, ...parsed.data };
  products = [newProduct, ...products];
  await saveProducts(products).catch((err) => {
    // rollback in-memory if persist fails
    products = products.filter((p) => p.id !== id);
    return res
      .status(500)
      .json({ error: "Failed to persist product", details: String(err) });
  });
  return res.status(201).json(newProduct);
});

router.put("/:id", async (req, res) => {
  const parsed = productBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid body", details: parsed.error.format() });
  }
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });
  const updated: Product = { ...products[index], ...parsed.data };
  const snapshot = [...products];
  products[index] = updated;
  await saveProducts(products).catch((err) => {
    products = snapshot;
    return res
      .status(500)
      .json({ error: "Failed to persist product", details: String(err) });
  });
  return res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const exists = products.some((p) => p.id === req.params.id);
  if (!exists) return res.status(404).json({ error: "Product not found" });
  const snapshot = [...products];
  products = products.filter((p) => p.id !== req.params.id);
  await saveProducts(products).catch((err) => {
    products = snapshot;
    return res
      .status(500)
      .json({ error: "Failed to persist product", details: String(err) });
  });
  return res.status(204).send();
});

export default router;
