"use client";

import { Search, ShoppingCart, UserCircle } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useStore } from "./useStore";
import { LoginForm } from "./login";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@/components";
import { SignUpForm } from "./register";
import { useQuery } from "@tanstack/react-query";
import { WEBSITE_API } from "@/services/website";
import { deleteCookie } from "cookies-next";

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
  const { data, isLoading } = useQuery({
    queryKey: ["getStore"],
    queryFn: WEBSITE_API.getStoreDetails,
  });

  useEffect(() => {
    setStore(data);
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!store) {
    return null;
  }

  return (
    <nav className="sticky left-0 top-0 w-full flex items-center justify-between p-4 bg-white shadow-md h-16">
      {/* Logo */}
      <div className="flex items-center">
        {store && <Link href="/">{store.name}</Link>}
      </div>

      {/* Search Bar */}
      <div className="relative lg:w-[300px] mx-4 flex items-center justify-center">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && setSearch(value)}
          placeholder="Search products..."
          className="w-full max-w-md outline-none focus:outline-none focus:border-[1.5px] px-4 py-2 h-8 rounded-full border"
        />
        <button onClick={() => setSearch(value)} className="absolute right-2">
          <Search className="ml-2 h-4 w-4" />
        </button>
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <UserCircle size={24} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] mr-3">
              <div className="flex flex-col">
                <p className="font-bold">{auth.user.name}</p>
                <p className="text-sm text-gray-400">{auth.user.email}</p>
                <Button
                  className="mt-4"
                  onClick={() => {
                    deleteCookie("x-customer-token");
                    setAuth(null);
                  }}
                >
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
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
