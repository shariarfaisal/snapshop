"use client";

import { useLogo } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";
import { SquareKanban } from "lucide-react";
import { memo, useCallback, useState } from "react";
import React from "react";

const sizeClasses = {
  sm: "h-8 w-auto max-w-[120px]",
  md: "h-10 w-auto max-w-[160px]",
  lg: "h-12 w-auto max-w-[200px]",
  xl: "h-16 w-auto max-w-[240px]",
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 25,
  xl: 30,
};

interface LogoComponentProps {
  className?: string;
  style?: React.CSSProperties;
  fallbackText?: string;
  showFallbackIcon?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  priority?: boolean;
  onError?: () => void;
}

const LogoComponent = memo(
  ({
    className,
    style,
    fallbackText = "",
    showFallbackIcon = true,
    size = "lg",
    priority = false,
    onError,
  }: LogoComponentProps) => {
    const { logoUrl, hasLogo, isLoading } = useLogo();
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleImageError = useCallback(() => {
      setImageError(true);
      onError?.();
    }, [onError]);

    const handleImageLoad = useCallback(() => {
      setImageLoaded(true);
    }, []);

    if (isLoading) {
      return (
        <div
          className={cn(
            "animate-pulse bg-gray-200 rounded-md",
            sizeClasses[size],
            className
          )}
          style={style}
        />
      );
    }

    if (hasLogo && logoUrl && !imageError) {
      return (
        <div className="relative">
          <img
            src={logoUrl}
            alt="Company Logo"
            className={cn(
              "object-contain transition-opacity duration-200",
              sizeClasses[size],
              imageLoaded ? "opacity-100" : "opacity-0",
              className
            )}
            style={{
              ...style,
              ...(priority && { loading: "eager" }),
            }}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
          {!imageLoaded && (
            <div
              className={cn(
                "absolute inset-0 animate-pulse bg-gray-200 rounded-md",
                sizeClasses[size]
              )}
            />
          )}
        </div>
      );
    }

    return (
      <div
        className={cn("flex items-center gap-2 text-gray-800", className)}
        style={style}
      >
        {showFallbackIcon && (
          <SquareKanban
            size={iconSizes[size]}
            className="text-white p-[2px] bg-primary rounded-sm flex-shrink-0"
          />
        )}
        <span
          className={cn(
            "font-bold",
            size === "sm" && "text-sm",
            size === "md" && "text-base",
            size === "lg" && "text-lg",
            size === "xl" && "text-xl"
          )}
        >
          {fallbackText}
        </span>
      </div>
    );
  }
);

LogoComponent.displayName = "LogoComponent";

export default LogoComponent;
