import { fetchProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { getTopCheapestAvailable } from "@/lib/util";

export const revalidate = 10;

type SearchParams = {
  search?: string;
  sort?: "price" | "name";
  order?: "asc" | "desc";
  page?: string;
  limit?: string;
  available?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? 1);
  const limit = Number(sp.limit ?? 12);
  const available = sp.available ? sp.available === "true" : undefined;

  const { data, meta } = await fetchProducts({
    search: sp.search,
    sort: sp.sort,
    order: sp.order,
    page,
    limit,
    available,
  });

  const top = getTopCheapestAvailable(data, 3);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Productos</h1>

      <form className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input
          name="search"
          defaultValue={sp.search}
          placeholder="Buscar..."
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-800 dark:bg-neutral-900 dark:border-neutral-700"
        />
        <select
          name="sort"
          defaultValue={sp.sort ?? "price"}
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="price">Precio</option>
          <option value="name">Nombre</option>
        </select>
        <div className="flex gap-2">
          <select
            name="order"
            defaultValue={sp.order ?? "asc"}
            className="flex-1 rounded-md border px-3 py-2 text-sm"
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
          <select
            name="available"
            defaultValue={sp.available ?? ""}
            className="flex-1 rounded-md border px-3 py-2 text-sm"
          >
            <option value="">Todos</option>
            <option value="true">En stock</option>
            <option value="false">Sin stock</option>
          </select>
          <button
            type="submit"
            className="rounded-md bg-black px-4 py-2 text-white"
          >
            Filtrar
          </button>
        </div>
      </form>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Top más baratos disponibles</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {top.map((p) => (
            <ProductCard key={`top-${p.id}`} product={p} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Resultados</h2>
          <p className="text-sm text-neutral-500">
            Página {meta.page} de {meta.totalPages} – {meta.total} productos
          </p>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
          {data.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          <a
            className="rounded-md border px-3 py-2 text-sm"
            href={`?${new URLSearchParams({
              ...Object.fromEntries(
                Object.entries(sp as Record<string, string | undefined>).filter(
                  ([, v]) => v !== undefined
                )
              ),
              page: String(Math.max(1, meta.page - 1)),
            })}`}
          >
            Anterior
          </a>
          <a
            className="rounded-md border px-3 py-2 text-sm"
            href={`?${new URLSearchParams({
              ...Object.fromEntries(
                Object.entries(sp as Record<string, string | undefined>).filter(
                  ([, v]) => v !== undefined
                )
              ),
              page: String(Math.min(meta.totalPages, meta.page + 1)),
            })}`}
          >
            Siguiente
          </a>
        </div>
      </section>
    </main>
  );
}
