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
    "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  const styles =
    variant === "solid"
      ? "bg-champagne-peach text-white hover:bg-champagne-accent focus:ring-champagne-accent"
      : "border border-champagne-200 text-champagne-contrast bg-white hover:bg-champagne-100 focus:ring-champagne-accent";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
