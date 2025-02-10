import { ResetPasswordForm } from "@/components/auth";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "SnapShop | Reset Password",
  };
}

export default function ResetPasswordPage() {
  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <ResetPasswordForm />
      </div>
    </>
  );
}
