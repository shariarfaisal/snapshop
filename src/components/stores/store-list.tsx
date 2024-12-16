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

const dummyStores = [
  {
    id: 1,
    name: "Tech Gadgets Store",
    logo: "/store.svg",
    domain: "techgadgets.example.com",
    email: "contact@techgadgets.com",
  },
  {
    id: 2,
    name: "Fashion Boutique",
    logo: "/store.svg",
    domain: "fashionboutique.example.com",
    email: "hello@fashionboutique.com",
  },
];

export default function StoreList() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-auto-96 gap-6">
        {dummyStores.map((store) => (
          <Card key={store.id} className="shadow-md">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Image
                  src={store.logo}
                  alt={`${store.name} Logo`}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <CardTitle>{store.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <p className="text-sm">
                  <strong>Domain:</strong> {store.domain}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {store.email}
                </p>
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <a href={`/stores/${store.id}`}>View Details</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
