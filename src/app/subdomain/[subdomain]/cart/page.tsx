"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "../useStore";
import { WEBSITE_API } from "@/services/website";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CartItem } from "@/app/subdomain/[subdomain]/useStore";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditCard } from "lucide-react";

export default function CartPage() {
  const { cart, auth, setAuthOpen } = useStore();

  useEffect(() => {
    if (!auth) {
      setAuthOpen("login");
    }
  }, [auth, setAuthOpen]);

  const { data, isLoading } = useQuery({
    queryKey: ["cart", cart],
    queryFn: async () => WEBSITE_API.cartDetails(cart),
  });

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      <div className="w-full max-w-2xl mx-auto p-4 md:p-10 space-y-3">
        {data && <CartItems data={data} />}
        {data && data.length > 0 && auth && <MakeOrder items={data} />}
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
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showDialog, setShowDialog] = useState(false);

  const { mutate } = useMutation({
    mutationFn: WEBSITE_API.makeOrder,
    onSuccess: (data) => {
      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully",
      });

      push(`/orders/${data.id}`);
      clearCart();
    },
  });

  const orderHandler = () => {
    if (paymentMethod === "online") {
      setShowDialog(true);
      return;
    }
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
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod">Cash On Delivery</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="online" id="online" />
              <Label htmlFor="online" className="flex items-center gap-2">
                Online Payment <CreditCard className="w-4 h-4" />
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>
      <Button disabled={!address} onClick={orderHandler}>
        Make Order
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Online Payment Coming Soon!</DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <p>
                We're excited to announce that online payment options will be available soon! We're working hard to bring you a secure and convenient payment experience.
              </p>
              <p>
                For now, you can still enjoy our Cash on Delivery service to place your order.
              </p>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Close
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
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
