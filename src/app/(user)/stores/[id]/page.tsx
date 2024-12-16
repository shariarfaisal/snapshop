"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const storeDetails = {
  id: 1,
  name: "Tech Gadgets Store",
  logo: "/store.svg", // Replace with actual logo path
  domain: "techgadgets.example.com",
  email: "contact@techgadgets.com",
  phone: "+1234567890",
  address: "123 Tech Street, Silicon Valley, CA",
  currency: "USD",
  description: "Your one-stop shop for all tech gadgets.",
  products: [
    {
      id: 1,
      name: "Wireless Headphones",
      price: "$199",
      stock: "In Stock",
      category: "Audio",
      image: "/headphone.svg",
    },
    {
      id: 2,
      name: "Smartwatch",
      price: "$299",
      stock: "Out of Stock",
      category: "Wearables",
      image: "/headphone.svg",
    },
  ],
};

export default function StoreDetailsPage() {
  return (
    <div className="container mx-auto p-4 py-8">
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Image
              src={storeDetails.logo}
              alt={`${storeDetails.name} Logo`}
              width={80}
              height={80}
              className="rounded-full"
            />
            <div>
              <CardTitle className="text-xl">{storeDetails.name}</CardTitle>
              <CardDescription>{storeDetails.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Domain:</strong>{" "}
              <a
                href={`https://${storeDetails.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {storeDetails.domain}
              </a>
            </p>
            <p>
              <strong>Email:</strong> {storeDetails.email}
            </p>
            <p>
              <strong>Phone:</strong> {storeDetails.phone}
            </p>
            <p>
              <strong>Address:</strong> {storeDetails.address}
            </p>
            <p>
              <strong>Currency:</strong> {storeDetails.currency}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="mr-2">
            Edit Store
          </Button>
          <Link href="/stores/1/manage-products">
            <Button className="mr-2" variant="outline">
              Manage Products
            </Button>
          </Link>
          <Link href="/stores/1/add-product">
            <Button variant="outline">Add Products</Button>
          </Link>
        </CardFooter>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-auto-96 gap-6">
          {storeDetails.products.map((product) => (
            <Card key={product.id} className="shadow-md">
              <CardHeader>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="rounded-md"
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>
                  <p>
                    <strong>Price:</strong> {product.price}
                  </p>
                  <p>
                    <strong>Stock:</strong> {product.stock}
                  </p>
                  <p>
                    <strong>Category:</strong> {product.category}
                  </p>
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
