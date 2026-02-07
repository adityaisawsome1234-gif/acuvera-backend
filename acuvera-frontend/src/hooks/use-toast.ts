"use client";

import { toast } from "sonner";

export function useToast() {
  return {
    toast: (title: string, description?: string) =>
      toast(title, {
        description,
      }),
  };
}
