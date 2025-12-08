"use client";

import React from "react";
import { Toaster, toast as sonnerToast } from "sonner";

type ToastType = "success" | "danger" | "info";

/**
 * Small wrapper hook keeping the same `useToast().showToast(...)` API
 * so existing code doesn't need changes. Under the hood it uses `sonner`.
 */
export function useToast() {
  function showToast(message: string, type: ToastType = "info", duration = 4000) {
    if (type === "success") {
      sonnerToast.success(message, { duration });
    } else if (type === "danger") {
      sonnerToast.error(message, { duration });
    } else {
      sonnerToast(message, { duration });
    }
  }
  return { showToast };
}

/**
 * ToastProvider renders Sonner's Toaster and passes through children.
 * Make sure `sonner` is installed: `npm i sonner` or `pnpm add sonner`.
 */
export default function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors />
    </>
  );
}
