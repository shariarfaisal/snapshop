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

interface Customer {
  id: number;
  name: string;
  email: string;
  store: string;
  orders: number;
  totalSpent: string;
}

const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    store: "Tech Gadgets Store",
    orders: 3,
    totalSpent: "$599",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    store: "Fashion Boutique",
    orders: 5,
    totalSpent: "$999",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    store: "Tech Gadgets Store",
    orders: 2,
    totalSpent: "$199",
  },
];

const stores = ["All Stores", "Tech Gadgets Store", "Fashion Boutique"];

export default function UserManagementPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [filteredCustomers, setFilteredCustomers] =
    useState<Customer[]>(initialCustomers);
  const [selectedStore, setSelectedStore] = useState("All Stores");

  const handleStoreFilter = (store: string) => {
    setSelectedStore(store);
    if (store === "All Stores") {
      setFilteredCustomers(customers);
    } else {
      setFilteredCustomers(
        customers.filter((customer) => customer.store === store)
      );
    }
  };

  const handleDelete = (customerId: number) => {
    const updatedCustomers = customers.filter(
      (customer) => customer.id !== customerId
    );
    setCustomers(updatedCustomers);
    setFilteredCustomers(
      updatedCustomers.filter(
        (customer) =>
          selectedStore === "All Stores" || customer.store === selectedStore
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Manage Customers</CardTitle>
            <Select
              value={selectedStore}
              onValueChange={(store) => handleStoreFilter(store)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Store" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store} value={store}>
                    {store}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.store}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>{customer.totalSpent}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(customer.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredCustomers.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              No customers found for the selected store.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
