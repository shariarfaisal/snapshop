"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { STORE_API } from "@/services";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function StoreDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const { data, isPending } = useQuery({
    queryKey: ["stores", id],
    queryFn: async () => STORE_API.getStoreById(parseInt(id as string)),
  });

  const deleteStoreMutation = useMutation({
    mutationFn: () => STORE_API.deleteStore(parseInt(id as string)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      toast.success("Store deleted successfully");
      router.push("/stores");
    },
    onError: (error) => {
      toast.error("Failed to delete store");
      console.error("Error deleting store:", error);
    },
  });

  const url = new URL(window.location.href);

  const getFullSubdomain = (subdomain: string) => {
    return `${url.protocol}//${subdomain}.${url.host}`;
  };

  return (
    <div className="container mx-auto p-4 py-8">
      {isPending && <p>Loading...</p>}
      {data && (
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full">
                <span className="text-2xl font-bold text-gray-600">
                  {data.name.charAt(0)}
                </span>
              </div>
              <div>
                <CardTitle className="text-xl">{data.name}</CardTitle>
                <CardDescription>{data.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Domain:</strong>{" "}
                <a
                  href={getFullSubdomain(data.domain)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {data.domain}
                </a>
              </p>
              <p>
                <strong>Currency:</strong> {data.currency}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <Button variant="outline" className="mr-2">
                Edit Store
              </Button>
              <Link href={`/products?storeId=${data.id}`}>
                <Button className="mr-2" variant="outline">
                  Manage Products
                </Button>
              </Link>
              <Link href={`/add-product/${data.id}`}>
                <Button variant="outline">Add Products</Button>
              </Link>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete Store</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your
                    store and all associated data including products, orders, and
                    customer information.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={() => deleteStoreMutation.mutate()}
                  >
                    Delete Store
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
