"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { STORE_API } from "@/services";
import Link from "next/link";
import { Globe, ShoppingBag, ShoppingCart } from "lucide-react";

export default function StoreList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["stores"],
    queryFn: STORE_API.getStores,
  });
  const url = new URL(window.location.href);

  const getFullSubdomain = (subdomain: string) => {
    return `${url.protocol}//${subdomain}.${url.host}`;
  };

  return (
    <div className="container mx-auto py-8">
      {!isLoading && error && (
        <div className="bg-red-100 p-4 rounded-md mb-4">
          <p className="text-red-500">{error.message}</p>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Logo</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Domain</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((store) => (
            <TableRow key={store.id}>
              <TableCell>
                <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
                  <span className="text-xl font-bold text-gray-600">
                    {store.name.charAt(0)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Link href={`/stores/${store.id}`}>{store.name}</Link>
              </TableCell>
              <TableCell>{store.domain}</TableCell>
              <TableCell className="space-x-2">
                <Button asChild variant="outline">
                  <Link target="_blank" href={getFullSubdomain(store.domain)}>
                    <Globe />
                    Website
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/orders?storeId=${store.id}`}>
                    <ShoppingCart />
                    Orders
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/products?storeId=${store.id}`}>
                    <ShoppingBag />
                    Products
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/stores/${store.id}`}>View Details</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
