"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui";
import { Product } from "@/types/product";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { PRODUCT_API } from "@/services/product";
import Markdown from "react-markdown";

interface ProductProps {
  product: Product;
}

const ProductDetails: React.FC<ProductProps> = () => {
  const { id } = useParams();
  const {
    data: product,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["getProduct", id],
    queryFn: async () => PRODUCT_API.getProductById(id as string),
    retry: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product || error) {
    return <div>Product not found</div>;
  }
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 items-center lg:grid-cols-2 gap-8">
        {/* Product Media */}
        <Carousel className="w-[calc(100%-2rem)]">
          <CarouselContent>
            {product.media?.map((media, index) => (
              <CarouselItem key={index} className="lg:basis-1/2">
                <div className="p-1">
                  <Image
                    key={media.id}
                    src={media.url}
                    width={500}
                    height={500}
                    alt={media.altText || "Product image"}
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        {/* Product Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h1 className="text-3xl font-bold text-gray-800">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500">{`Created on ${new Date(
                product.createdAt
              ).toLocaleDateString()}`}</p>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700">
                <Markdown>{product.description}</Markdown>
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-600">
                    Base Price:
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    ${product.basePrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-600">Stock:</span>
                  <span className="text-xl text-green-600">
                    {product.stock} units
                  </span>
                </div>
              </div>

              {/* Attributes */}
              {product.attributes && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Attributes
                  </h3>
                  <ul className="space-y-2 mt-4">
                    {product.attributes.map((attribute) => (
                      <li key={attribute.id} className="flex justify-between">
                        <span className="text-gray-600">{attribute.key}:</span>
                        <span className="text-gray-900">{attribute.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Variants */}
              {product.variants && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Variants
                  </h3>
                  <ul className="space-y-2 mt-4">
                    {product.variants.map((variant) => (
                      <li key={variant.id} className="flex justify-between">
                        <span className="text-gray-600">{variant.name}</span>
                        <span className="text-gray-900">
                          ${variant.price.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
