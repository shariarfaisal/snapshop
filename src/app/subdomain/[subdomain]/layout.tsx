"use client";

import { Search, ShoppingCart, UserCircle, Package } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { useStore } from "./useStore";
import { LoginForm } from "./login";
import { Button } from "@/components/ui/button";
import { SignUpForm } from "./register";
import { useQuery } from "@tanstack/react-query";
import { WEBSITE_API } from "@/services/website";
import { deleteCookie, getCookie } from "cookies-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Navbar = () => {
  const {
    search,
    setSearch,
    cart,
    auth,
    setAuth,
    setAuthOpen,
    store,
    setStore,
  } = useStore();
  const [value, setValue] = useState(search);
  const [open, setOpen] = useState(false);
  const debouncedValue = useDebounce(value, 300);
  const router = useRouter();

  // Fetch store details
  const { data: storeData } = useQuery({
    queryKey: ["getStore"],
    queryFn: WEBSITE_API.getStoreDetails,
  });

  // Fetch search suggestions
  const { data: suggestions, isLoading: suggestionsLoading } = useQuery({
    queryKey: ["searchSuggestions", debouncedValue],
    queryFn: () => WEBSITE_API.searchSuggestions(debouncedValue),
    enabled: debouncedValue.length > 0 && open,
  });

  // Fetch user info if token exists
  const { data: userData } = useQuery({
    queryKey: ["customerInfo"],
    queryFn: WEBSITE_API.getCustomerInfo,
    enabled: !!getCookie("x-customer-token") && !auth,
  });

  useEffect(() => {
    setStore(storeData);
  }, [storeData, setStore]);

  // Set auth if we have user data
  useEffect(() => {
    if (userData && !auth) {
      const token = getCookie("x-customer-token");
      if (token) {
        setAuth({
          token: token.toString(),
          user: userData
        });
      }
    }
  }, [userData, auth, setAuth]);

  const handleSearch = useCallback((query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setOpen(false);
  }, [router]);

  if (!store) {
    return null;
  }

  return (
    <nav className="sticky left-0 top-0 w-full flex items-center justify-between p-4 bg-white shadow-md h-16 z-50">
      {/* Logo */}
      <div className="flex items-center">
        {store && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center font-bold text-xl">
              {store.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {store.name}
              </span>
              <span className="text-xs text-gray-500">@{store.domain}</span>
            </div>
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative lg:w-[300px] mx-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative w-full">
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch(value)}
                placeholder="Search products..."
                className="w-full max-w-md outline-none focus:outline-none focus:border-[1.5px] px-4 py-2 h-8 rounded-full border"
              />
              <button onClick={() => handleSearch(value)} className="absolute right-2 top-1">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[300px]" align="start" sideOffset={4}>
            <Command>
              <CommandInput
                placeholder="Search products..."
                value={value}
                onValueChange={setValue}
              />
              <CommandList>
                {suggestionsLoading ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    Loading...
                  </div>
                ) : suggestions?.length === 0 ? (
                  <CommandEmpty>No results found.</CommandEmpty>
                ) : (
                  <CommandGroup heading="Products">
                    {suggestions?.map((product) => (
                      <CommandItem
                        key={product.id}
                        onSelect={() => {
                          router.push(`/${product.id}`);
                          setOpen(false);
                        }}
                        className="flex items-center gap-2 p-2"
                      >
                        <div className="relative w-8 h-8 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                          {product.media?.[0] ? (
                            <Image
                              src={product.media[0].url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <ShoppingBag className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="truncate">{product.name}</p>
                          <p className="text-sm text-gray-500">৳{product.basePrice}</p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Profile Icon */}
      <div className="flex items-center space-x-4">
        <Link href="/cart" className="relative">
          <ShoppingCart />
          <div className="absolute -top-1 -right-1 text-xs w-4 h-4 text-white bg-red-500 rounded-full flex items-center justify-center">
            {cart.length}
          </div>
        </Link>
        {!auth ? (
          <>
            <Button
              onClick={() => setAuthOpen("login")}
              className="h-8"
              variant="ghost"
            >
              Login
            </Button>
            <LoginForm />
            <SignUpForm />
          </>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <UserCircle size={24} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="px-2 py-1.5">
                <p className="font-bold">{auth.user.name}</p>
                <p className="text-sm text-gray-400">{auth.user.email}</p>
              </div>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/orders" className="cursor-pointer">
                  <Package className="w-4 h-4 mr-2" />
                  Orders
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-red-600"
                onClick={() => {
                  deleteCookie("x-customer-token");
                  setAuth(null);
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};

export default function SubdomainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-screen container w-full">
      <Navbar />
      {children}
    </div>
  );
}
