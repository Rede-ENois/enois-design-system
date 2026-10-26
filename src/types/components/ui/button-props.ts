import type { ButtonHTMLAttributes } from "react";

import type { VariantProps } from "class-variance-authority";

import type { buttonVariants } from "../../../ui/button-variants.js";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
