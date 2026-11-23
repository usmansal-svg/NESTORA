import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_6px_16px_-8px_rgba(15,61,51,0.6)] hover:bg-pine-700",
        accent: "bg-lime-accent text-pine-950 hover:brightness-[0.97]",
        destructive: "bg-danger text-white hover:bg-danger/90",
        outline: "border border-border bg-card hover:bg-secondary text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-sand-300/70",
        ghost: "hover:bg-secondary text-foreground",
        link: "text-pine-600 underline-offset-4 hover:underline px-0",
        soft: "bg-pine-50 text-pine-800 hover:bg-pine-100",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 rounded-lg px-3 text-[13px]",
        lg: "h-12 rounded-2xl px-6 text-[15px]",
        xl: "h-14 rounded-2xl px-7 text-base",
        icon: "size-10",
        "icon-sm": "size-8 rounded-lg",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
