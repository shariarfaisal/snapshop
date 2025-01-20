"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PRODUCT_API } from "@/services/product";
import { Product } from "@/types/product";
import { useParams } from "next/navigation";

export default function ManageProductsPage() {
  const { id } = useParams();
  const [filters] = useState({
    page: 1,
    limit: 10,
    name: "",
    minPrice: undefined,
    maxPrice: undefined,
    categoryId: undefined,
    storeId: id ? Number(id) : 0,
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

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Manage Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Link href={`/stores/${filters.storeId}/add-product`}>
              <Button>New Product</Button>
            </Link>
          </div>
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
                    <Link href={`/stores/products/${product.id}`}>
                      {product.name}
                    </Link>
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
