"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PRODUCT_API } from "@/services/product";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

export default function ManageProductsPage() {
  const { stores } = useAppStore();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<{
    page: number;
    limit: number;
    name: string;
    minPrice: number | undefined;
    maxPrice: number | undefined;
    categoryId: number | undefined;
    storeId: number | undefined;
  }>({
    page: 1,
    limit: 10,
    name: "",
    minPrice: undefined,
    maxPrice: undefined,
    categoryId: undefined,
    storeId: undefined,
  });
  const { data: products } = useQuery({
    queryKey: ["products", filters],
    queryFn: async () => await PRODUCT_API.getProducts(filters),
  });

  const handleDelete = (productId: number) => {
    console.log(productId);
  };

  const handleEdit = (productId: number) => {
    console.log(productId);
  };

  useEffect(() => {
    const storeId = searchParams.get("storeId");
    if (storeId) {
      setFilters({ ...filters, storeId: Number(storeId) });
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-md">
        <CardHeader className="w-full flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Products</CardTitle>
          <div className="flex gap-2 items-center">
            <Select
              onValueChange={(value) =>
                setFilters({ ...filters, storeId: Number(value) })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Store" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Stores</SelectLabel>
                  {stores?.map((s) => {
                    return (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Link href={`/stores/${filters.storeId}/add-product`}>
              <Button>New Product</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Link href={`/products/${product.id}`}>{product.name}</Link>
                  </TableCell>
                  <TableCell>{product.basePrice}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {!products?.products?.length && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
