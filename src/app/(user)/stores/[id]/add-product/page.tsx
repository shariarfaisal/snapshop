"use client";

import { Card, CardContent } from "@/components/ui/card";

import { AddProductForm } from "./product";
import { useState } from "react";
import { Button } from "@/components";
import { Plus } from "lucide-react";

export default function AddProduct() {
  const [forms, setForms] = useState([Date.now().toString()]);
  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="sticky border-b top-0 left-0 p-3 w-full bg-white min-h-10 flex justify-between items-center z-10">
        <h1 className="text-2xl font-bold">Add Product</h1>
        <Button
          onClick={() => {
            setForms((prev) => [...prev, Date.now().toString()]);
          }}
        >
          <Plus className="mr-2" /> Add New Form
        </Button>
      </div>

      <div className="space-y-4 mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 p-3 md:p-5">
        {forms.map((id) => (
          <Card key={id}>
            <CardContent className="py-5">
              <AddProductForm
                deleteForm={() => {
                  setForms((prev) => prev.filter((formId) => formId !== id));
                }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
