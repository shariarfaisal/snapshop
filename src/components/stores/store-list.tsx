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
import { useQuery } from "@tanstack/react-query";
import { STORE_API } from "@/services";

export default function StoreList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["stores"],
    queryFn: STORE_API.getStores,
  });

  return (
    <div className="container mx-auto py-8">
      {!isLoading && error && (
        <>
          <div className="bg-red-100 p-4 rounded-md mb-4">
            <p className="text-red-500">{error.message}</p>
          </div>
        </>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-auto-96 gap-6">
        {data?.map((store) => (
          <Card key={store.id} className="shadow-md">
            <CardHeader>
              <div className="flex items-center space-x-4">
                {/* <Image
                  src={store.logo}
                  alt={`${store.name} Logo`}
                  width={50}
                  height={50}
                  className="rounded-full"
                /> */}
                <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
                  <span className="text-xl font-bold text-gray-600">
                    {store.name.charAt(0)}
                  </span>
                </div>

                <CardTitle>{store.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <p className="text-sm">
                  <strong>Domain:</strong> {store.domain}
                </p>
                <p className="text-sm text-gray-500">{store.description}</p>
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
