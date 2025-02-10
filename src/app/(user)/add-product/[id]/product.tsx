"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components";
import { Minus, PlusIcon, X } from "lucide-react";
import MediaUpload from "./media-upload";
import { ProductFormValues, productSchema } from "./schema";
import { useMutation } from "@tanstack/react-query";
import { PRODUCT_API } from "@/services/product";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks";
import { isAxiosError } from "axios";
import DescriptionPreview from "./description-preview";

export const AddProductForm = ({ deleteForm }: { deleteForm: () => void }) => {
  const { id } = useParams();
  const { toast } = useToast();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      basePrice: 0,
      stock: 0,
      attributes: [],
      variants: [],
      media: [],
    },
  });
  const { mutate } = useMutation({
    mutationKey: ["create-product"],
    mutationFn: PRODUCT_API.addProduct,
    onSuccess: () => {
      toast({
        variant: "default",
        description: "Product created successfully",
      });
      form.reset();
    },
    onError: (error) => {
      const msg = isAxiosError(error)
        ? error.response?.data.message
        : error.message;
      /*
      "errors": [
        {
            "path": "basePrice",
            "message": "Required"
        }
    ]
      */
      const errors = isAxiosError(error) ? error.response?.data.errors : [];
      if (errors?.length > 0) {
        for (const error of errors) {
          form.setError(error.path, {
            message: error.message,
          });
        }
      }
      toast({
        variant: "destructive",
        description: msg,
      });
    },
  });

  const { control, handleSubmit, register } = form;

  const {
    fields: attributeFields,
    append: addAttribute,
    remove: removeAttribute,
  } = useFieldArray({ control, name: "attributes" });

  const {
    fields: variantFields,
    append: addVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const {
    fields: mediaFields,
    append: addMedia,
    remove: removeMedia,
  } = useFieldArray({
    control,
    name: "media",
  });

  const onSubmit = (data: z.infer<typeof productSchema>) => {
    mutate({
      ...data,
      storeId: parseInt(id as string),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative">
        <Button
          variant="destructive"
          className="absolute top-0 -mt-5 right-0 rounded-full w-7 h-7"
          onClick={deleteForm}
        >
          <X />
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Media and Main Product Info */}
          <div className="space-y-5">
            <div className="space-y-3">
              {mediaFields.map((field, index) => (
                <MediaUpload
                  key={field.id}
                  index={index}
                  setFileUrl={(fileUrl: string, fileType: string) => {
                    form.setValue(`media.${index}.url`, fileUrl);
                    form.setValue(
                      `media.${index}.type`,
                      fileType as "image" | "video"
                    );
                  }}
                  error={form.formState.errors.media?.[index]?.url?.message}
                  removeMedia={removeMedia}
                />
              ))}
              <Button
                type="button"
                className="w-full"
                onClick={() => addMedia({ url: "", type: "image" })}
              >
                <PlusIcon className="w-4 h-4" />
                Add Media
              </Button>
            </div>

            <Separator />

            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <DescriptionPreview description={field.value}>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description"
                        rows={7}
                        {...field}
                      />
                    </FormControl>
                  </DescriptionPreview>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter base price"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter stock quantity"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Right Column - Attributes and Variants */}
          <div className="space-y-5 lg:border-l lg:pl-8">
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Attributes</h3>
              {attributeFields.map((field, index) => (
                <div key={field.id} className="flex gap-3">
                  <Input
                    placeholder="Key"
                    {...register(`attributes.${index}.key`)}
                  />
                  <Input
                    placeholder="Value"
                    {...register(`attributes.${index}.value`)}
                  />
                  <Button type="button" onClick={() => removeAttribute(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => addAttribute({ key: "", value: "" })}
              >
                Add Attribute
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-lg font-medium">Variants</h3>
              {variantFields.map((f, index) => (
                <div key={f.id} className="border-b lg:border-none pb-3">
                  <div className="flex flex-row items-center gap-3 justify-between">
                    <div className="space-y-3">
                      <div className="w-full">
                        <label
                          className="text-xs text-gray-500"
                          htmlFor={`name-${index}`}
                        >
                          Name
                        </label>
                        <Input
                          id={`name-${index}`}
                          placeholder="Variant Name"
                          {...register(`variants.${index}.name`)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label
                            className="text-xs text-gray-500"
                            htmlFor={`price-${index}`}
                          >
                            Price
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            id={`price-${index}`}
                            placeholder="Variant Price"
                            {...register(`variants.${index}.price`)}
                          />
                        </div>
                        <div>
                          <label
                            className="text-xs text-gray-500"
                            htmlFor={`stock-${index}`}
                          >
                            Stock
                          </label>
                          <Input
                            type="number"
                            id={`stock-${index}`}
                            placeholder="Variant Stock"
                            {...register(`variants.${index}.stock`)}
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      className="w-8 h-8"
                      type="button"
                      onClick={() => removeVariant(index)}
                    >
                      <Minus />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                className="w-full"
                onClick={() => addVariant({ name: "", price: 0, stock: 0 })}
              >
                <PlusIcon className="w-4 h-4" />
                Add Variant
              </Button>
            </div>
          </div>
        </div>

        <Separator className="lg:hidden" />

        <Button
          type="submit"
          className="w-full bg-sky-600 text-white hover:bg-sky-700"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};
