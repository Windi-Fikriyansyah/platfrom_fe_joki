import { forwardRef } from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  full?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className = "", variant = "primary", full, ...props },
  ref
) {
  const base =
    "inline-flex items-center justify-center rounded-xl text-sm font-semibold " +
    "h-11 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 " +
    "disabled:opacity-50 disabled:pointer-events-none";

  const styles =
    variant === "primary"
      ? "bg-black text-white hover:opacity-90"
      : variant === "secondary"
      ? "border bg-white hover:bg-black/5"
      : "hover:bg-black/5";

  return (
    <button
      ref={ref}
      className={`${base} ${styles} ${full ? "w-full" : ""} ${className}`}
      {...props}
    />
  );
});
