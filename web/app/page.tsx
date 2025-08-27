import Link from "next/link";

export default function Home() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900">Descubre tu aroma</h1>
            <p className="mt-4 text-neutral-600">Explora un catálogo curado de perfumes con una experiencia fluida y moderna.</p>
            <div className="mt-6 flex gap-3">
              <Link href="/products" className="btn-contained">Ver productos</Link>
              <Link href="/admin/products" className="btn">Panel admin</Link>
            </div>
          </div>
          <div className="relative">
            <div className="h-64 md:h-80 w-full rounded-xl bg-gradient-to-br from-[#f7f2ff] to-white animate-pulse-slow" />
          </div>
        </div>
      </div>
    </section>
  );
}
