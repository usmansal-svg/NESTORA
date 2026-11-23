import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-xl border border-input bg-card px-3.5 text-[15px] outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-pine-400 focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
}
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full rounded-xl border border-input bg-card px-3.5 py-3 text-[15px] outline-none placeholder:text-muted-foreground/70 focus-visible:border-pine-400 focus-visible:ring-[3px] focus-visible:ring-ring/20 md:text-sm",
        className
      )}
      {...props}
    />
  );
}
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label className={cn("text-[13px] font-medium text-foreground/80", className)} {...props} />;
}
export { Input, Textarea, Label };
