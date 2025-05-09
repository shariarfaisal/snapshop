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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PRODUCT_API } from "@/services/product";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product } from "@/types/product";

export default function ManageProductsPage() {
  const { stores } = useAppStore();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
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
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    basePrice: 0,
    stock: 0,
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => PRODUCT_API.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
      setDeleteProductId(null);
    },
    onError: (error) => {
      toast.error("Failed to delete product");
      console.error("Error deleting product:", error);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name: string; description?: string; basePrice: number; stock: number } }) =>
      PRODUCT_API.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully");
      setEditingProduct(null);
    },
    onError: (error) => {
      toast.error("Failed to update product");
      console.error("Error updating product:", error);
    },
  });

  const handleDelete = (productId: number) => {
    setDeleteProductId(productId);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description || "",
      basePrice: product.basePrice,
      stock: product.stock,
    });
  };

  const handleUpdate = () => {
    if (editingProduct) {
      updateProductMutation.mutate({
        id: editingProduct.id,
        data: editForm,
      });
    }
  };

  const confirmDelete = () => {
    if (deleteProductId) {
      deleteProductMutation.mutate(deleteProductId);
    }
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
            <Link href={`/add-product/${filters.storeId}`}>
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
                      <Dialog open={editingProduct?.id === product.id} onOpenChange={(open) => !open && setEditingProduct(null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                            <DialogDescription>
                              Make changes to your product here. Click save when you're done.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input
                                value={editForm.name}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, name: e.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                value={editForm.description}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, description: e.target.value })
                                }
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Price</Label>
                                <Input
                                  type="number"
                                  value={editForm.basePrice}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      basePrice: Number(e.target.value),
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Stock</Label>
                                <Input
                                  type="number"
                                  value={editForm.stock}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      stock: Number(e.target.value),
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setEditingProduct(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleUpdate}
                              disabled={updateProductMutation.isPending}
                            >
                              {updateProductMutation.isPending ? "Saving..." : "Save changes"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={deleteProductId === product.id} onOpenChange={(open) => !open && setDeleteProductId(null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will permanently delete the
                              product and all its associated data.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setDeleteProductId(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={confirmDelete}
                              disabled={deleteProductMutation.isPending}
                            >
                              {deleteProductMutation.isPending ? "Deleting..." : "Delete"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
