import { SignUpForm } from "@/components/auth";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Signup | SnapShop",
  };
}

export default function LoginPage() {
  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <SignUpForm />
      </div>
    </>
  );
}
