"use client";

import { CardContent, CardTitle } from "@/components/ui/card";
import { VerifyOtpForm } from "./VerifyOtp";
import { FindEmailForm } from "./FindEmailForm";
import { useState } from "react";
import { UpdatePasswordForm } from "./UpdatePassword";
import { toast } from "@/hooks/use-toast";

export const ResetPasswordForm = () => {
  const [step, setStep] = useState(1);

  const onFindEmailSuccess = () => {
    setStep(2);
  };

  const onVerifyOtpSuccess = () => {
    setStep(3);
  };

  const onUpdatePasswordSuccess = () => {
    toast({
      title: "Reset password successfully!",
      type: "foreground",
    });
  };

  return (
    <>
      <CardContent className="w-full max-w-[30rem] space-y-3">
        {[1, 2].includes(step) && (
          <>
            <CardTitle className="w-full text-3xl text-center">
              Reset password
            </CardTitle>

            {step === 1 && <FindEmailForm onSuccess={onFindEmailSuccess} />}
            {step === 2 && <VerifyOtpForm onSuccess={onVerifyOtpSuccess} />}
          </>
        )}
        {step === 3 && (
          <>
            <UpdatePasswordForm onSuccess={onUpdatePasswordSuccess} />
          </>
        )}
      </CardContent>
    </>
  );
};
