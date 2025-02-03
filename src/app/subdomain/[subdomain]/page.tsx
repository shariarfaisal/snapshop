"use client";

import { Button } from "@/components";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { WEBSITE_API } from "@/services/website";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { useStore } from "./useStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
  const [params, setParams] = useState<{
    page: number;
    limit: number;
  }>({
    page: 1,
    limit: 100,
  });
  const { search } = useStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ["getProducts", { ...params, name: search }],
    queryFn: async () => WEBSITE_API.getProducts({ ...params, name: search }),
  });

  return (
    <section className="p-5 md:p-7 xl:p-10">
      <h1 className="text-2xl font-semibold mb-4">Products</h1>
      {isLoading && <div>Loading...</div>}
      {!isLoading && error && (
        <div className="bg-red-100 text-red-500 p-4 rounded-md mb-4">
          {isAxiosError(error) ? error.response?.data.message : error.message}
        </div>
      )}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-auto-60 gap-4 ">
          {data?.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {data && data.total > data.limit && (
        <PaginationComponent
          total={data.total}
          limit={data.limit}
          page={data.page}
          setPage={(page) => setParams({ ...params, page })}
        />
      )}
    </section>
  );
}

const PaginationComponent = ({
  total,
  limit,
  page,
  setPage,
}: {
  total: number;
  limit: number;
  page: number;
  setPage: (page: number) => void;
}) => {
  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  // Calculate the range of pages to show
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle previous and next page logic
  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={handlePrevious}
            aria-disabled={page === 1}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {pageNumbers.map((pageNum) => (
          <PaginationItem key={pageNum}>
            <PaginationLink
              href="#"
              isActive={page === pageNum}
              onClick={() => setPage(pageNum)}
            >
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Ellipsis */}
        {totalPages > 5 && page < totalPages - 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={handleNext}
            aria-disabled={page === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useStore();
  const media = product.media?.[0];
  const { name, basePrice } = product;
  const { push } = useRouter();

  const handleAddToCart = useCallback(() => {
    if (!product.variants?.length) {
      addToCart({
        id: product.id,
      });
      toast("Added to cart");
    } else {
      push(`/${product.id}`);
    }
  }, [product.variants?.length, product.id, addToCart, push]);

  return (
    <div className="border rounded-lg max-w-[300px]">
      <div className="p-4">
        {media ? (
          <Image
            className="w-full h-[180px] rounded-xl"
            src={media.url}
            alt=""
            width={400}
            height={300}
          />
        ) : (
          <div className="w-full h-[180px] bg-gray-200"></div>
        )}
      </div>
      <div className="px-4 py-2 flex flex-col">
        <Link
          href={`/${product.id}`}
          className="font-normal hover:text-gray-600 transition-colors duration-150"
        >
          {name}
        </Link>
        <div className="flex items-center justify-between">
          <div className="text-[#f57224] text-lg font-medium">৳{basePrice}</div>
          <Button onClick={handleAddToCart} className="rounded-full w-9 h-9">
            <ShoppingCart />
          </Button>
        </div>
      </div>
    </div>
  );
};
