"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const badgeColor = product.isAvailable
    ? "bg-green-100 text-green-700"
    : "bg-gray-100 text-gray-600";
  const badgeText = product.isAvailable ? "En stock" : "Sin stock";

  return (
    <Link
      href={`/products/${product.id}`}
      className="group card p-4 hover:-translate-y-0.5"
    >
      <div className="aspect-square w-full overflow-hidden rounded-md bg-gradient-to-br from-[#f5f5f5] to-white relative">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(14,113,240,0.25), transparent 40%), radial-gradient(circle at 70% 80%, rgba(14,113,240,0.20), transparent 45%)",
          }}
        />
        <Image
          src={product.image || "/img/perfume-placeholder.svg"}
          alt={product.name}
          width={200}
          height={200}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <h3 className="text-[16px] font-semibold leading-snug text-neutral-900">
          {product.name}
        </h3>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-[14px] text-neutral-900">
          ${product.price.toFixed(2)}
        </p>
        <span
          className={`inline-flex items-center rounded-md px-2 py-1 text-xs ${badgeColor}`}
        >
          {badgeText}
        </span>
      </div>
    </Link>
  );
}
