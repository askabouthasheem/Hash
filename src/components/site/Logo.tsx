import React from "react";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function LogoIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <img
      src="/logo-official.png"
      alt="Hash Logo"
      className={`${className} object-contain shrink-0 dark:brightness-0 dark:invert transition-opacity duration-150`}
    />
  );
}

export function Logo({ className = "", iconOnly = false, size = "md" }: LogoProps) {
  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoIcon className={iconSizes[size]} />

      {!iconOnly && (
        <span className={`font-display ${textSizes[size]} leading-none text-foreground tracking-tight`}>
          Hash
        </span>
      )}
    </div>
  );
}
