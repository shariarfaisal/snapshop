"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { ReactNode, useState } from "react";
import { Button } from "./button";
import { CircleAlert } from "lucide-react";

const Popconfirm = ({
  children,
  title,
  onConfirm,
  onCancel,
}: {
  children: ReactNode;
  title: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent
        className="min-w-[200px] mt-2 rounded-lg bg-background p-3 flex flex-col gap-3"
        style={{
          boxShadow:
            "0 6px 16px 0 rgba(0, 0, 0, 0.08),0 3px 6px -4px rgba(0, 0, 0, 0.12),0 9px 28px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="font-medium py-2 flex items-center gap-2">
          <CircleAlert className="w-4 h-4 text-amber-600" />
          <p>{title}</p>
        </div>

        <div className="flex gap-2 items-center justify-end py-1">
          <Button
            onClick={() => {
              onCancel?.();
              setOpen(false);
            }}
            variant="outline"
            size="sm"
            className="h-6 font-normal px-3"
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (onConfirm) {
                await onConfirm();
              }
              setOpen(false);
            }}
            variant="outline"
            size="sm"
            className="h-6 font-normal px-3 bg-blue-500 text-white hover:bg-blue-400 hover:text-white border-none"
          >
            Yes
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { Popconfirm };
