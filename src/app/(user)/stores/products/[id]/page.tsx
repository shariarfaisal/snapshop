"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const productDetails = {
  id: 1,
  name: "Wireless Headphones",
  price: "$199",
  description:
    "Experience immersive sound quality with our top-of-the-line wireless headphones. Designed for comfort and durability, these headphones are perfect for music lovers.",
  stock: "In Stock",
  category: "Audio",
  images: ["/headphone.svg", "/headphone.svg"], // Replace with actual image paths
  rating: 4.5,
  reviews: [
    { id: 1, name: "John Doe", comment: "Great sound quality!", rating: 5 },
    {
      id: 2,
      name: "Jane Smith",
      comment: "Very comfortable to wear.",
      rating: 4,
    },
  ],
};

export default function ProductDetailsPage() {
  const [selectedImage, setSelectedImage] = useState(productDetails.images[0]);

  return (
    <div className="p-4 container mx-auto py-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">{productDetails.name}</CardTitle>
          <CardDescription className="text-gray-500">
            {productDetails.category}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Product Images */}
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="flex-shrink-0">
              <Image
                src={selectedImage}
                alt={productDetails.name}
                width={400}
                height={400}
                className="rounded-md"
              />
              <div className="flex space-x-4 mt-4">
                {productDetails.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`border rounded-md p-1 ${
                      image === selectedImage
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    <Image
                      src={image}
                      alt="Thumbnail"
                      width={80}
                      height={80}
                      className="rounded-md"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="mt-6 md:mt-0">
              <p className="text-lg font-semibold text-green-600">
                {productDetails.stock}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                Price: {productDetails.price}
              </p>
              <p className="mt-4 text-gray-700">{productDetails.description}</p>
              <Button className="mt-6">Add to Cart</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
        <div className="space-y-4">
          {productDetails.reviews.map((review) => (
            <Card key={review.id} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">{review.name}</CardTitle>
                <CardDescription>Rating: {review.rating}/5</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
