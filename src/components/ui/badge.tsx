import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11.5px] font-medium whitespace-nowrap [&_svg]:size-3 leading-5",
  {
    variants: {
      variant: {
        default: "bg-pine-100 text-pine-800",
        solid: "bg-primary text-primary-foreground",
        lime: "bg-lime-soft text-pine-900",
        warn: "bg-amber-soft text-amber-800",
        danger: "bg-danger-soft text-danger",
        muted: "bg-secondary text-muted-foreground",
        outline: "border border-border text-foreground",
        info: "bg-sky-50 text-sky-800",
        violet: "bg-violet-50 text-violet-800",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
export { Badge, badgeVariants };
