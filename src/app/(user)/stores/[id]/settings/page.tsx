"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

interface StoreSettings {
  name: string;
  logo: string | null; // URL or File
  domain: string;
  currency: string;
  taxRate: number;
  description: string;
}

const initialSettings: StoreSettings = {
  name: "Tech Gadgets Store",
  logo: "/store.svg", // Replace with the actual logo path if available
  domain: "techgadgets.example.com",
  currency: "USD",
  taxRate: 5,
  description: "Your one-stop shop for all tech gadgets and accessories.",
};

export default function StoreSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: name === "taxRate" ? parseFloat(value) : value,
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    console.log("Updated Store Settings:", settings);
    console.log("Uploaded Logo:", logoFile);
    alert("Store settings saved successfully!");
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Store Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {/* Store Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Store Name
              </label>
              <Input
                type="text"
                name="name"
                value={settings.name}
                onChange={handleInputChange}
                placeholder="Enter your store name"
              />
            </div>

            {/* Store Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Store Logo
              </label>
              <Input type="file" accept="image/*" onChange={handleLogoChange} />
              {settings.logo && (
                <div className="mt-2">
                  <Image
                    src={
                      typeof settings.logo === "string"
                        ? settings.logo
                        : URL.createObjectURL(logoFile!)
                    }
                    alt="Store Logo"
                    width={200}
                    height={200}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            {/* Domain */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Domain
              </label>
              <Input
                type="text"
                name="domain"
                value={settings.domain}
                onChange={handleInputChange}
                placeholder="Enter your custom domain"
              />
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <Input
                type="text"
                name="currency"
                value={settings.currency}
                onChange={handleInputChange}
                placeholder="Enter the currency code (e.g., USD, EUR)"
              />
            </div>

            {/* Tax Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tax Rate (%)
              </label>
              <Input
                type="number"
                name="taxRate"
                value={settings.taxRate}
                onChange={handleInputChange}
                placeholder="Enter the tax rate (e.g., 5)"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Store Description
              </label>
              <Textarea
                name="description"
                value={settings.description}
                onChange={handleInputChange}
                placeholder="Enter a brief description of your store"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
