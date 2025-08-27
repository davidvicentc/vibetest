import Image from "next/image";
import Link from "next/link";
import { fetchProduct } from "@/lib/api";

type Params = { id: string };

export default async function ProductDetail({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const product = await fetchProduct(id);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/products" className="text-sm text-neutral-600 hover:underline">← Volver</Link>
      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800">
          <Image src={product.image || "/next.svg"} alt={product.name} width={800} height={800} className="w-full h-auto object-cover" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-neutral-900 dark:text-neutral-100">{product.name}</h1>
          <p className="mt-2 text-[18px] text-neutral-800 dark:text-neutral-200">${product.price.toFixed(2)}</p>
          <p className="mt-1 text-sm text-neutral-500">{product.isAvailable ? "En stock" : "Sin stock"}</p>
          <button className="mt-6 rounded-md bg-black px-4 py-2 text-white">Agregar a favoritos</button>
        </div>
      </div>
    </main>
  );
}


