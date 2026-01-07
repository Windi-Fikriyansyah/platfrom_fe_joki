import { forwardRef } from "react";
import Link from "next/link";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "premium" | "outline";
  full?: boolean;
  href?: string;
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className = "", variant = "primary", full, href, children, ...props },
  ref
) {
  const base =
    "inline-flex items-center justify-center rounded-xl text-sm font-bold " +
    "h-12 px-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 " +
    "disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 active:scale-95";

  const styles =
    variant === "primary"
      ? "bg-black text-white hover:bg-black/80 shadow-lg shadow-black/5"
      : variant === "premium"
        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-xl shadow-primary/20 hover:shadow-primary/30"
        : variant === "secondary"
          ? "bg-white text-primary border-2 border-primary/10 shadow-lg shadow-black/5 hover:bg-primary/5 hover:border-primary/20"
          : variant === "outline"
            ? "border-2 border-black/10 bg-transparent hover:bg-black/5"
            : "hover:bg-black/5";

  const content = (
    <span className="flex items-center justify-center gap-2">
      {children}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`${base} ${styles} ${full ? "w-full" : ""} ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      className={`${base} ${styles} ${full ? "w-full" : ""} ${className}`}
      {...props}
    >
      {content}
    </button>
  );
});
