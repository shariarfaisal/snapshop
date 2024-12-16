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

type Product = {
  id: number;
  name: string;
  price: string;
  stock: number;
  category: string;
  description: string;
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: "$199",
    stock: 20,
    category: "Audio",
    description: "",
  },
  {
    id: 2,
    name: "Smartwatch",
    price: "$299",
    stock: 10,
    category: "Wearables",
    description: "",
  },
];

export default function ManageProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product>();

  const handleDelete = (productId: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  const handleEdit = (product: (typeof initialProducts)[0]) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProduct(undefined);
  };

  const handleSave = () => {
    // Add or update product logic here
    setIsDialogOpen(false);
    setEditingProduct(undefined);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Manage Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsDialogOpen(true)}>Add Product</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Link href={`/stores/products/${product.id}`}>
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
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

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <Input
                defaultValue={editingProduct?.name || ""}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <Input
                type="number"
                defaultValue={editingProduct?.price || ""}
                placeholder="Enter product price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <Input
                type="number"
                defaultValue={editingProduct?.stock || ""}
                placeholder="Enter stock quantity"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <Input
                defaultValue={editingProduct?.category || ""}
                placeholder="Enter product category"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                defaultValue={editingProduct?.description || ""}
                placeholder="Enter product description"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
