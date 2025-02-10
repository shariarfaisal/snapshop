"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ORDER_API } from "@/services/order";
import Image from "next/image";
import { History, MapPinHouse, Phone, User } from "lucide-react";
import { EnvelopeOpenIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const colors: Record<string, string> = {
  Pending: "text-yellow-500",
  Processing: "text-green-500",
  Shipped: "text-blue-500",
  Delivered: "text-green-500",
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => ORDER_API.getOrderById(parseInt(id as string)),
  });
  const [orderStatus, setOrderStatus] = useState("");

  const handleStatusChange = (newStatus: string) => {
    setOrderStatus(newStatus);
    // API call to update status can be added here
    console.log(`Order status updated to: ${newStatus}`);
  };

  useEffect(() => {
    if (order) {
      setOrderStatus(order.orderStatus);
    }
  }, [order]);

  const orderColor = useMemo(() => {
    return colors[orderStatus] || "text-gray-500";
  }, [orderStatus]);

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-between">
            <h2 className="text-2xl flex gap-2 items-center">
              Order #{order.id} -{" "}
              <div className={`${orderColor}`}>{order.orderStatus}</div>
            </h2>

            <time className="font-normal text-gray-500">
              {new Date(order.createdAt).toLocaleString()}
            </time>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div>Total:</div>
                <div className="text-orange-600">৳{order.totalPrice}</div>
              </div>
              <div className="flex items-center space-x-2">
                <div>Status:</div>{" "}
                <select
                  value={orderStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="border border-gray-300 rounded-md p-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="space-y-2">
                <div>Shipping Address:</div>
                <div className="flex gap-2 items-center text-orange-600">
                  <MapPinHouse className="w-4 h-4" /> {order.shippingAddress}
                </div>
              </div>
            </div>
            <div className="space-y-4 w-full">
              <h3 className="text-end text-lg font-semibold">Customer Info</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-end gap-2">
                  <div>{order.customer?.name}</div>
                  <User className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <div>{order.customer?.email}</div>
                  <EnvelopeOpenIcon className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <div>{order.customer?.phone}</div>
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex justify-end">
                  <Link href={`/orders?customerId=${order.id}`}>
                    <Button>
                      <History className="w-4 h-4 mr-2" />
                      Order History
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems?.map((item, index) => {
                const { product } = item;

                const image = product?.media?.[0]?.url;
                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-md p-4 flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        {image ? (
                          <Image
                            src={image}
                            className="w-12 h-12 rounded-lg"
                            width={100}
                            height={100}
                            alt=""
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        )}
                        <div>
                          <p>
                            <strong>{item.product?.name}</strong>
                          </p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-800 font-medium text-xl">
                      ৳{item.price}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end sticky bottom-0 min-h-12 items-center bg-white p-3">
        <Button variant="outline" className="mr-2">
          Back to Orders
        </Button>
        <Button onClick={() => alert("Order marked as completed!")}>
          Mark as Delivered
        </Button>
      </div>
    </div>
  );
}
