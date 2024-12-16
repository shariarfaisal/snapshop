"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

interface OrderDetails {
  id: number;
  customer: string;
  date: string;
  total: string;
  status: string;
  items: OrderItem[];
  address: string;
  email: string;
  phone: string;
}

const order: OrderDetails = {
  id: 1,
  customer: "John Doe",
  date: "2023-12-01",
  total: "$199.00",
  status: "Pending",
  items: [{ name: "Wireless Headphones", quantity: 1, price: "$199.00" }],
  address: "123 Tech Street, Silicon Valley, CA",
  email: "john.doe@example.com",
  phone: "+1234567890",
};

export default function OrderDetailsPage() {
  const [orderStatus, setOrderStatus] = useState(order.status);

  const handleStatusChange = (newStatus: string) => {
    setOrderStatus(newStatus);
    // API call to update status can be added here
    console.log(`Order status updated to: ${newStatus}`);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>Customer:</strong> {order.customer}
            </p>
            <p>
              <strong>Date:</strong> {order.date}
            </p>
            <p>
              <strong>Total:</strong> {order.total}
            </p>
            <p>
              <strong>Status:</strong>{" "}
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
            </p>
            <p>
              <strong>Address:</strong> {order.address}
            </p>
            <p>
              <strong>Email:</strong> {order.email}
            </p>
            <p>
              <strong>Phone:</strong> {order.phone}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md p-4 flex justify-between items-center"
                >
                  <div>
                    <p>
                      <strong>{item.name}</strong>
                    </p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-gray-800 font-medium">{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button variant="outline" className="mr-2">
          Back to Orders
        </Button>
        <Button onClick={() => alert("Order marked as completed!")}>
          Mark as Completed
        </Button>
      </div>
    </div>
  );
}
