"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/store/useAppStore";
import { useQuery } from "@tanstack/react-query";
import { CUSTOMER_API } from "@/services/customer";
import { Input } from "@/components";
import { Search } from "lucide-react";
import Link from "next/link";

export default function UserManagementPage() {
  const { stores } = useAppStore();
  const [filters, setFilters] = useState<{
    page: number;
    limit: number;
    search: string;
    storeId?: number;
  }>({
    page: 1,
    limit: 100,
    search: "",
  });
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["customers", filters],
    queryFn: () => CUSTOMER_API.getCustomers(filters),
  });

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Customers</CardTitle>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Input
                  value={search}
                  className="w-[200px] rounded-lg px-3"
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setFilters({ ...filters, search: e.currentTarget.value });
                    }
                  }}
                  placeholder="Search"
                />
                <button
                  type="button"
                  className="hover:text-gray-400  absolute right-2 top-2.5"
                  onClick={() => {
                    setFilters({ ...filters, search: search });
                  }}
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
              <Select
                value={filters.storeId?.toString()}
                onValueChange={(store) => {
                  setFilters((prev) => ({ ...prev, storeId: Number(store) }));
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Store" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id.toString()}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.customers?.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer?.store?.name}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/orders?customerId=${customer.id}`}>
                        <Button variant="outline" size="sm">
                          Orders
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!isLoading && data?.customers?.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              No customers found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
