"use client";

import {
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { WEBSITE_API } from "@/services/website";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Markdown from "react-markdown";
import { useStore } from "../useStore";
import { useToast } from "@/hooks";
import Link from "next/link";

const ProductPage = () => {
  const params = useParams();
  const { toast } = useToast();
  const { addToCart, removeFromCart, cart } = useStore();
  const productId = params.productId as string;
  const { data, isLoading } = useQuery({
    queryKey: ["getProduct", productId],
    queryFn: async () => WEBSITE_API.getProductById(productId),
  });
  const [image, seImage] = useState<string>("");
  const [variantId, setVariantId] = useState<number>();

  useEffect(() => {
    if (data) {
      const media = data.media?.[0];
      if (media) {
        seImage(media.url);
      }
    }
  }, [data]);

  const handleAddToCart = useCallback(() => {
    if (data) {
      if (data.variants && data.variants.length > 0 && !variantId) {
        toast({
          variant: "destructive",
          description: "Please select a variant.",
        });
        return;
      }

      addToCart({
        id: data.id,
        variantId,
      });
    }
  }, [data, variantId, addToCart, toast]);

  const handleRemoveFromCart = useCallback(() => {
    if (data) {
      removeFromCart({
        id: data.id,
        variantId,
      });
    }
  }, [data, removeFromCart, variantId]);

  useEffect(() => {
    if (data && data.variants && data.variants.length > 0) {
      setVariantId(data.variants[0].id);
    }
  }, [data]);

  const basePrice = useMemo(() => {
    if (data && data.variants && data.variants.length > 0) {
      return data.variants.find((v) => v.id === variantId)?.price;
    }

    return data?.basePrice;
  }, [data, variantId]);

  const cartItem = cart?.find(
    (item) => data && item.id === data.id && item.variantId === variantId
  );

  const getCartItems = useCallback(() => {
    if (data) {
      const items = cart?.filter((item) => item.id === data?.id);
      if (items && items.length > 0) {
        return items.map((item) => {
          const prod = {
            id: item.id,
            variantId: item.variantId,
            name: data.name,
            quantity: item.quantity,
            price: data.basePrice,
            total: item.quantity * data.basePrice,
          };

          if (data.variants && item.variantId) {
            const variant = data.variants.find((v) => v.id === item.variantId);
            if (variant) {
              prod.name = variant.name;
              prod.price = variant.price;
              prod.total = item.quantity * variant.price;
            }
          }

          return prod;
        }) as {
          id: number;
          variantId: number;
          name: string;
          quantity: number;
          price: number;
          total: number;
        }[];
      }
    }

    return [];
  }, [cart, data]);

  const cartItems = getCartItems();

  return (
    <section className="p-5 md:p-7 xl:p-10">
      {isLoading && <div>Loading...</div>}
      {!isLoading && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 xl:gap-8">
          {data.media && data.media.length > 0 && (
            <div className="space-y-5">
              <div className="w-full">
                <Image
                  className="w-full bg-contain rounded-xl max-h-[400px]"
                  src={image}
                  alt=""
                  width={400}
                  height={300}
                />
              </div>
              {data.media.length > 0 && (
                <div className="w-full no-scrollbar flex overflow-x-auto flex-row gap-2">
                  {data.media.map((m, i) => {
                    return (
                      <div
                        key={i}
                        className="border  p-2 rounded-xl cursor-pointer"
                        onClick={() => seImage(m.url)}
                      >
                        <Image
                          className="w-[100px] h-[100px] rounded-xl"
                          src={m.url}
                          alt=""
                          width={400}
                          height={300}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          <div className="space-y-8">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">
                {data.name}{" "}
                {data.stock === 0 ? (
                  <span className="bg-[#f57224] text-white text-xs font-medium mr-2 px-2.5 py-2 rounded">
                    Stock Out
                  </span>
                ) : null}
              </h1>
              <p className="text-2xl text-[#f57224] font-normal">
                ৳{basePrice || 0}
              </p>
            </div>

            {/* attributes */}
            {data.attributes && data.attributes.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold underline-offset-2 text-gray-500 leading-3 tracking-wider uppercase">
                  Attributes
                </h3>
                <ul className="space-y-1">
                  {data.attributes.map((attribute) => (
                    <li key={attribute.id} className="flex justify-between">
                      <span className="text-gray-600 font-light">
                        {attribute.key}:
                      </span>
                      <span className="text-gray-900">{attribute.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.variants && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold underline-offset-2 text-gray-500 leading-3 tracking-wider uppercase">
                  Variants
                </h3>
                <Select
                  value={variantId?.toString()}
                  onValueChange={(value) => setVariantId(Number(value))}
                >
                  <SelectTrigger className="w-full max-w-[260px]">
                    <SelectValue
                      className="w-full"
                      defaultValue={variantId}
                      placeholder="Select a Variant"
                    />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectGroup>
                      <SelectLabel>Select a Variant</SelectLabel>
                      {data.variants.map((variant) => (
                        <SelectItem
                          key={variant.id}
                          value={variant.id.toString()}
                        >
                          {variant.name} - ৳{variant.price}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              {!cartItem ? (
                <Button onClick={handleAddToCart}>
                  <ShoppingCart />
                  Add to Cart
                </Button>
              ) : (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 bg-gray-200 rounded-xl p-2">
                    <Button
                      onClick={handleRemoveFromCart}
                      variant="ghost"
                      className="bg-white"
                    >
                      <Minus className="w-5" />
                    </Button>
                    <span className="mx-2 text-[#f57224]">
                      {cartItem.quantity}
                    </span>
                    <Button
                      onClick={handleAddToCart}
                      variant="ghost"
                      className="bg-white"
                    >
                      <Plus className="w-5" />
                    </Button>
                  </div>

                  <Link href="/cart">
                    <Button>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Buy Now
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold underline-offset-2 text-gray-500 leading-3 tracking-wider uppercase">
                  Cart
                </h3>
                <ul className="space-y-2">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex justify-between border-b">
                      <span className="text-gray-600 text-sm font-light">
                        {item.name}
                      </span>
                      <div className="flex gap-3 items-center">
                        <span className="text-gray-900">
                          {item.quantity} x ৳{item.price} ={" "}
                          <span className="text-[#f57224]">
                            ৳{item.quantity * item.price}
                          </span>
                        </span>
                        <button
                          onClick={() => {
                            removeFromCart({
                              id: item.id,
                              variantId: item.variantId,
                              clear: true,
                            });
                          }}
                          className="text-red-600 "
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase">
              Details
            </h2>
            <div className="text-gray-600">
              <Markdown className="prose">{data.description}</Markdown>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductPage;
