"use client";
import UserLayout from "./(user)/layout";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Define the type for stores
interface Store {
  id: number;
  name: string;
}

// Define the type for sales data
interface SalesData {
  name: string;
  sales: number;
  storeId: number;
}

// Dummy stores
const stores: Store[] = [
  { id: 0, name: "All Stores" },
  { id: 1, name: "Tech Gadgets Store" },
  { id: 2, name: "Fashion Boutique" },
];

// Dummy sales data
const allSalesData: SalesData[] = [
  { name: "Jan", sales: 3000, storeId: 1 },
  { name: "Feb", sales: 2500, storeId: 1 },
  { name: "Mar", sales: 3500, storeId: 2 },
  { name: "Apr", sales: 4000, storeId: 1 },
  { name: "May", sales: 4500, storeId: 2 },
];
export default function Home() {
  const [selectedStore, setSelectedStore] = useState<number>(0);
  const [filteredSales, setFilteredSales] = useState<SalesData[]>(allSalesData);

  const metrics = {
    totalSales: "$15,000",
    totalOrders: 120,
    totalCustomers: 75,
    averageOrderValue: "$125",
  };

  // Handle store filter changes
  const handleStoreFilter = (storeId: number) => {
    setSelectedStore(storeId);
    if (storeId === 0) {
      setFilteredSales(allSalesData); // Show all data
    } else {
      setFilteredSales(allSalesData.filter((data) => data.storeId === storeId));
    }
  };

  return (
    <UserLayout>
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {/* Store Filter */}
          <Select
            onValueChange={(value) => handleStoreFilter(Number(value))}
            defaultValue="0"
          >
            <SelectTrigger className="w-60">
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

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{metrics.totalSales}</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{metrics.totalOrders}</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{metrics.totalCustomers}</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Average Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{metrics.averageOrderValue}</p>
            </CardContent>
          </Card>
        </div>

        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredSales}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
}
