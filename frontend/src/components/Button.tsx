import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline";
};

export default function Button({
  variant = "solid",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200";
  const styles =
    variant === "solid"
      ? "bg-primary text-white hover:bg-secondary focus:ring-secondary"
      : "border border-gray-300 text-foreground bg-white hover:bg-muted focus:ring-secondary";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
