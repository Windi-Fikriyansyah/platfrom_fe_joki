import { forwardRef } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className = "", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={
        "w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none " +
        "focus-visible:ring-2 focus-visible:ring-black/10 " +
        className
      }
      {...props}
    />
  );
});
