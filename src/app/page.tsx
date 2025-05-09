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
import { useQuery } from "@tanstack/react-query";
import { STORE_API } from "@/services";

// Define the type for stores
interface Store {
  id: number;
  name: string;
}

// Define the type for sales data
interface SalesData {
  name: string;
  total: number;
  storeId: number;
}

interface TopSellingProduct {
  productId: number;
  _sum: {
    quantity: number;
    price: number;
  };
  productName: string;
}

interface AnalyticsData {
  totalSales: number;
  totalOrders: number;
  customerCount: number;
  newCustomers: number;
  orderStatusCount: { orderStatus: string; _count: { id: number } }[];
  salesGrowth: number;
  topSellingProducts: TopSellingProduct[];
  sales: SalesData[];
}

const stores: Store[] = [
  { id: 0, name: "All Stores" },
  { id: 1, name: "Tech Gadgets Store" },
  { id: 2, name: "Fashion Boutique" },
];

export default function Home() {
  const [selectedStoreId, setSelectedStoreId] = useState<number | undefined>();

  const { data, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["analytics", selectedStoreId],
    queryFn: () => STORE_API.getAnalytics(selectedStoreId),
  });

  const { data: userStores } = useQuery({
    queryKey: ["stores"],
    queryFn: STORE_API.getStores,
  });

  // Handle store filter changes
  const handleStoreFilter = (value: string) => {
    setSelectedStoreId(value === "all" ? undefined : Number(value));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p>No data available.</p>
      </div>
    );
  }

  return (
    <UserLayout>
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {/* Store Filter */}
          {userStores && userStores.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Filter by Store:</span>
              <Select onValueChange={handleStoreFilter} defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  {userStores.map((store) => (
                    <SelectItem key={store.id} value={store.id.toString()}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">৳{data.totalSales || 0}</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{data.totalOrders}</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{data.customerCount}</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>New Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{data.newCustomers}</p>
            </CardContent>
          </Card>
        </div>

        {/* Order Status Count */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold">Order Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.orderStatusCount.map((status, index) => (
              <Card key={index} className="shadow-md mb-4">
                <CardHeader>
                  <CardTitle>{status.orderStatus}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{status._count.id} Orders</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sales Growth */}
        <div className="mb-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Sales Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">৳{data.salesGrowth}</p>
            </CardContent>
          </Card>
        </div>

        {/* Top Selling Products */}
        {data.topSellingProducts && (
          <div className="mb-8 space-y-2 min-h-[120px]">
            <h3 className="text-2xl font-semibold">Top Selling Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3">
              {data.topSellingProducts?.map((product, index) => (
                <Card key={index} className="shadow-md mb-4">
                  <CardHeader>
                    <CardTitle>{product.productName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Quantity Sold: {product._sum.quantity}</p>
                    <p>Total Sales: ৳{product._sum.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {data.topSellingProducts.length === 0 && (
              <p className="text-gray-500 text-center">No products found.</p>
            )}
          </div>
        )}

        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.sales || []}>
                <XAxis dataKey="name" />
                <YAxis dataKey="total" />
                <Tooltip />
                <Bar dataKey="total" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
}
