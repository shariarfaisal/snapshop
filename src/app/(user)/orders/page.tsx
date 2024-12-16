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

const initialOrders = [
  {
    id: 1,
    customer: "John Doe",
    date: "2023-12-01",
    total: "$199.00",
    status: "Pending",
    items: [{ name: "Wireless Headphones", quantity: 1, price: "$199.00" }],
  },
  {
    id: 2,
    customer: "Jane Smith",
    date: "2023-12-02",
    total: "$299.00",
    status: "Shipped",
    items: [{ name: "Smartwatch", quantity: 1, price: "$299.00" }],
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleView = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Manage Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <select
                      value={order.status}
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
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(order)}
                      >
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <p>
                <strong>Customer:</strong> {selectedOrder.customer}
              </p>
              <p>
                <strong>Date:</strong> {selectedOrder.date}
              </p>
              <p>
                <strong>Total:</strong> {selectedOrder.total}
              </p>
              <p>
                <strong>Status:</strong> {selectedOrder.status}
              </p>
              <div>
                <h4 className="text-lg font-semibold">Items</h4>
                <ul className="list-disc pl-5">
                  {selectedOrder.items.map((item, index) => (
                    <li key={index}>
                      {item.quantity}x {item.name} - {item.price}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={handleDialogClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
