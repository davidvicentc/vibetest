"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "../../shared/types";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const badgeColor = product.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600";
  const badgeText = product.isAvailable ? "En stock" : "Sin stock";

  return (
    <Link
      href={`/products/${product.id}`}
      className="group rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 hover:shadow-lg transition-shadow bg-white dark:bg-neutral-900"
    >
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
        <Image
          src={product.image || "/next.svg"}
          alt={product.name}
          width={200}
          height={200}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <h3 className="text-[16px] font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
          {product.name}
        </h3>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-[14px] text-neutral-700 dark:text-neutral-300">${product.price.toFixed(2)}</p>
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs ${badgeColor}`}>{badgeText}</span>
      </div>
    </Link>
  );
}


