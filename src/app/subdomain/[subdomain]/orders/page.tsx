"use client";

import { useQuery } from "@tanstack/react-query";
import { WEBSITE_API } from "@/services/website";
import { useStore } from "../useStore";
import { useEffect } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, Package } from "lucide-react";

export default function OrdersPage() {
  const { auth, setAuthOpen } = useStore();

  useEffect(() => {
    if (!auth) {
      setAuthOpen("login");
    }
  }, [auth, setAuthOpen]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: WEBSITE_API.getOrders,
    enabled: !!auth,
  });

  if (!auth) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Please Login</h1>
          <p className="text-gray-500">You need to login to view your orders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      {isLoading ? (
        <div>Loading...</div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              href={`/orders/${order.id}`}
              key={order.id}
              className="block hover:shadow-md transition-shadow"
            >
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order #{order.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge
                    className={
                      order.status === "Delivered"
                        ? "bg-green-500"
                        : order.status === "Cancelled"
                        ? "bg-red-500"
                        : order.status === "Shipped"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Package className="w-4 h-4" />
                  <span>{order.orderItems.length} items</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{order.shippingAddress}</span>
                </div>
                
                <div className="mt-4 text-right">
                  <p className="text-lg font-semibold">
                    Total: ৳{order.totalPrice}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No Orders Yet</h3>
          <p className="text-gray-500">
            When you make orders, they will appear here
          </p>
        </div>
      )}
    </div>
  );
} 