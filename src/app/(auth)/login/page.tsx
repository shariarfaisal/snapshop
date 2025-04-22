import { LoginForm } from "@/components/auth";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "TaleemOne | Login",
  };
}

export default function LoginPage() {
  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <LoginForm />
      </div>
    </>
  );
}
