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
import { useQuery } from "@tanstack/react-query";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { ORDER_API } from "@/services/order";

export default function OrdersPage() {
  const { stores } = useAppStore();
  const [filters, setFilters] = useState<{
    page: number;
    limit: number;
    storeId?: number;
    status?: string;
    customerId?: number;
    search?: string;
  }>({
    page: 1,
    limit: 100,
  });
  const [search, setSearch] = useState("");
  const { data } = useQuery({
    queryKey: ["orders", filters],
    queryFn: () => ORDER_API.getOrders(filters),
  });

  const handleStatusChange = (orderId: number, newStatus: string) => {
    console.log(orderId, newStatus);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Manage Orders</CardTitle>
          <div className="flex gap-2 items-center ">
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
              onValueChange={(value) =>
                setFilters({ ...filters, storeId: Number(value) })
              }
            >
              <SelectTrigger className="w-[160px]">
                <ShoppingCart className="w-4 h-4" />
                <SelectValue placeholder="Select Store" />
              </SelectTrigger>
              <SelectContent>
                {stores?.map((s) => {
                  return (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(status) => {
                if (status === "all") {
                  setFilters({ ...filters, status: undefined });
                } else {
                  setFilters({ ...filters, status: status });
                }
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-gray-600">
              {data?.orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="text-lg text-gray-700">
                    # {order.id}
                  </TableCell>
                  <TableCell>
                    <Link href={`/stores/${order.store?.id}`}>
                      {order?.store?.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/customers/${order.customer?.id}`}>
                      {order.customer?.name}
                    </Link>
                  </TableCell>

                  <TableCell>৳{order.totalPrice}</TableCell>
                  <TableCell>
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="border border-gray-300 rounded-md p-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
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
