"use client";

import { useQuery } from "@tanstack/react-query";
import { WEBSITE_API } from "@/services/website";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Product } from "@/types/product";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const { data, isLoading } = useQuery<{
    products: Product[];
    page: number;
    limit: number;
    total: number;
  }>({
    queryKey: ["search", query],
    queryFn: () => WEBSITE_API.searchProducts(query || ""),
    enabled: !!query,
  });

  if (!query) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">No Search Query</h1>
          <p className="text-gray-500">Please enter a search term to find products</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Loading...</h1>
        </div>
      </div>
    );
  }

  const products = data?.products || [];
  const total = data?.total || 0;

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Search Results for "{query}"</h1>
        <p className="text-gray-500">Found {total} results</p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              href={`/${product.id}`}
              key={product.id}
              className="group block"
            >
              <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                {product.media?.[0] ? (
                  <Image
                    src={product.media[0].url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="mt-2">
                <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">৳{product.basePrice}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No Products Found</h3>
          <p className="text-gray-500">
            Try searching with different keywords
          </p>
        </div>
      )}
    </div>
  );
} 