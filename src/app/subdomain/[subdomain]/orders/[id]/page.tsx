"use client";

import { useQuery } from "@tanstack/react-query";
import { WEBSITE_API } from "@/services/website";
import { useStore } from "../../useStore";
import { useEffect } from "react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, Package, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { auth, setAuthOpen } = useStore();

  useEffect(() => {
    if (!auth) {
      setAuthOpen("login");
    }
  }, [auth, setAuthOpen]);

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", params.id],
    queryFn: () => WEBSITE_API.getOrderById(params.id),
    enabled: !!auth,
  });

  if (!auth) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Please Login</h1>
          <p className="text-gray-500">You need to login to view order details</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return (
      <div className="container mx-auto p-4 py-8">
        <div className="text-center">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">Order Not Found</h3>
          <p className="text-gray-500 mb-4">
            We couldn't find the order you're looking for
          </p>
          <Link
            href="/orders"
            className="text-primary hover:underline inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="mb-6">
        <Link
          href="/orders"
          className="text-gray-500 hover:text-gray-700 inline-flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
        <h1 className="text-2xl font-bold">Order Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="relative w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    {item.product.media?.[0] ? (
                      <Image
                        src={item.product.media[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm font-medium">৳{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            <div className="flex items-start gap-2 text-gray-600">
              <MapPinIcon className="w-5 h-5 mt-0.5" />
              <p>{order.shippingAddress}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Order #{order.id}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Status</p>
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

              <div className="pt-4 border-t">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Subtotal</span>
                  <span>৳{order.totalPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Shipping</span>
                  <span>৳0</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>৳{order.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 