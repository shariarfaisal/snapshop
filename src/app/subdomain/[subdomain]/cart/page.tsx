"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "../useStore";
import { WEBSITE_API } from "@/services/website";
import { Minus, Plus } from "lucide-react";
import { Button, Label, RadioGroup, RadioGroupItem } from "@/components";
import { useCallback, useState } from "react";
import Link from "next/link";
import { CartItem } from "@/app/subdomain/[subdomain]/useStore";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart } = useStore();

  const { data, isLoading } = useQuery({
    queryKey: ["cart", cart],
    queryFn: async () => WEBSITE_API.cartDetails(cart),
  });

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      <div className="w-full max-w-2xl mx-auto p-4 md:p-10 space-y-3">
        {data && <CartItems data={data} />}

        {data && data.length > 0 && <MakeOrder items={data} />}
      </div>
    </div>
  );
}

const MakeOrder = ({
  items,
}: {
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    total: number;
    variant?: {
      id: number;
      name: string;
    };
  }[];
}) => {
  const { clearCart } = useStore();
  const { toast } = useToast();
  const { push } = useRouter();
  const [address, setAddress] = useState("");
  const { mutate } = useMutation({
    mutationFn: WEBSITE_API.makeOrder,
    onSuccess: () => {
      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully",
      });

      push(`/cart/success`);
      clearCart();
    },
  });

  const orderHandler = () => {
    mutate({
      items,
      shippingAddress: address,
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label>Shipping Address</label>
        <Textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Shipping Address"
        ></Textarea>
      </div>
      <div className="space-y-2">
        <label>Payment Method</label>
        <RadioGroup defaultValue="cod">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="cod" />
            <Label htmlFor="cod">Cash On Delivery</Label>
          </div>
        </RadioGroup>
      </div>
      <Button disabled={!address} onClick={orderHandler}>
        Make Order
      </Button>
    </div>
  );
};

const CartItems = ({
  data,
}: {
  data: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    total: number;
    variant?: {
      id: number;
      name: string;
    };
  }[];
}) => {
  const { addToCart, removeFromCart } = useStore();

  const handleAddToCart = useCallback(
    (item: Omit<CartItem, "quantity">) => {
      if (data) {
        addToCart({
          id: item.id,
          variantId: item.variantId,
        });
      }
    },
    [data, addToCart]
  );

  const handleRemoveFromCart = useCallback(
    (item: Omit<CartItem, "quantity">) => {
      if (data) {
        removeFromCart({
          id: item.id,
          variantId: item.variantId,
        });
      }
    },
    [data, removeFromCart]
  );
  return (
    <div className="w-full space-y-3">
      {data.map((item, i) => {
        return (
          <div
            key={`item-${item.id}-${i}`}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <Link href={`/${item.id}`}>
                <h2 className="text-lg font-medium">
                  {item.name} {item.variant ? `- ${item.variant.name}` : ""}
                </h2>
              </Link>
              <div className="text-sm flex gap-2">
                <span className="text-[#f57224]">৳ {item.price}</span>
                <span>X</span>
                <span>{item.quantity}</span>
                <span>=</span>
                <span className="text-[#f57224]">৳ {item.total}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 bg-gray-200 rounded-xl p-2">
                <Button
                  onClick={() =>
                    handleRemoveFromCart({
                      id: item.id,
                      variantId: item.variant?.id,
                    })
                  }
                  variant="ghost"
                  className="bg-white h-6 w-8"
                >
                  <Minus className="w-5" />
                </Button>
                <span className="mx-2 text-[#f57224]">{item.quantity}</span>
                <Button
                  onClick={() =>
                    handleAddToCart({
                      id: item.id,
                      variantId: item.variant?.id,
                    })
                  }
                  variant="ghost"
                  className="bg-white h-6 w-8"
                >
                  <Plus className="w-5" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
