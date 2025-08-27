"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "@/lib/api";

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    isAvailable: true,
    category: "",
    image: "/img/perfume1.svg",
  });
  const [error, setError] = useState<string | null>(null);

  const meta = useMemo(() => ({ count: items.length }), [items]);

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchProducts({ page: 1, limit: 100 });
      setItems(res.data);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editing) {
        const updated = await updateProduct(editing.id, form);
        setItems((prev) =>
          prev.map((p) => (p.id === editing.id ? updated : p))
        );
        setEditing(null);
      } else {
        const created = await createProduct(form);
        setItems((prev) => [created, ...prev]);
      }
      setForm({
        name: "",
        price: 0,
        isAvailable: true,
        category: "",
        image: "/img/perfume1.svg",
      });
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      price: p.price,
      isAvailable: p.isAvailable,
      category: p.category,
      image: p.image,
    });
  };

  const onDelete = async (id: string) => {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      setLoading(true);
      await deleteProduct(id);
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-brand">Dashboard de Productos</h1>

      <form
        onSubmit={onSubmit}
        className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-3 rounded-xl border p-4 bg-white/80 backdrop-blur"
      >
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Precio"
          type="number"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Categoría"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <select
          className="rounded-md border px-3 py-2 text-sm"
          value={String(form.isAvailable)}
          onChange={(e) =>
            setForm({ ...form, isAvailable: e.target.value === "true" })
          }
        >
          <option value="true">En stock</option>
          <option value="false">Sin stock</option>
        </select>
        <div className="flex gap-2">
          <button type="submit" className="nav-cta">
            {editing ? "Guardar cambios" : "Crear"}
          </button>
          {editing && (
            <button
              type="button"
              className="nav-link"
              onClick={() => {
                setEditing(null);
                setForm({
                  name: "",
                  price: 0,
                  isAvailable: true,
                  category: "",
                  image: "/img/perfume1.svg",
                });
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <p className="mt-2 text-sm text-neutral-500">Total: {meta.count}</p>

      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-[#eff6ff] text-[#0E71F0]">
            <tr>
              <th className="px-3 py-2 text-left">Nombre</th>
              <th className="px-3 py-2 text-left">Precio</th>
              <th className="px-3 py-2 text-left">Categoría</th>
              <th className="px-3 py-2 text-left">Estado</th>
              <th className="px-3 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="odd:bg-white even:bg-[#fbfdff]">
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2">${p.price.toFixed(2)}</td>
                <td className="px-3 py-2">{p.category}</td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs ${
                      p.isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {p.isAvailable ? "En stock" : "Sin stock"}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <button className="nav-link mr-2" onClick={() => onEdit(p)}>
                    Editar
                  </button>
                  <button className="nav-cta" onClick={() => onDelete(p.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <p className="mt-4 text-sm text-neutral-500">Procesando...</p>
      )}
    </div>
  );
}
