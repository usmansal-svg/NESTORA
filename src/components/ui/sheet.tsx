"use client";
import * as React from "react";
import { Dialog as D } from "radix-ui";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = D.Root;
const SheetTrigger = D.Trigger;
const SheetClose = D.Close;

/**
 * Bottom sheet on mobile, right-side drawer on desktop (side="auto").
 */
function SheetContent({
  className,
  children,
  side = "auto",
  ...props
}: React.ComponentProps<typeof D.Content> & { side?: "auto" | "right" | "bottom" | "left" }) {
  const sideCls = {
    auto: "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-[28px] data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom md:inset-y-0 md:left-auto md:right-0 md:h-full md:max-h-none md:w-[480px] md:rounded-none md:rounded-l-[28px] md:data-[state=open]:slide-in-from-right md:data-[state=closed]:slide-out-to-right",
    right: "inset-y-0 right-0 h-full w-full sm:w-[480px] sm:rounded-l-[28px] data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
    left: "inset-y-0 left-0 h-full w-[300px] data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
    bottom: "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-[28px] data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
  }[side];
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-50 bg-pine-950/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <D.Content
        className={cn(
          "fixed z-50 flex flex-col overflow-hidden bg-background shadow-lift outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:duration-300 data-[state=closed]:duration-200",
          sideCls,
          className
        )}
        {...props}
      >
        {(side === "auto" || side === "bottom") && (
          <div className={cn("mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-sand-300", side === "auto" && "md:hidden")} />
        )}
        {children}
        <D.Close className="absolute right-4 top-4 z-10 grid size-8 place-items-center rounded-full bg-secondary text-muted-foreground transition hover:text-foreground">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </D.Close>
      </D.Content>
    </D.Portal>
  );
}
function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1 px-6 pb-3 pt-5 pr-14", className)} {...props} />;
}
function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex-1 overflow-y-auto px-6 pb-6", className)} {...props} />;
}
function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("border-t border-border/70 bg-card/80 px-6 py-4 pb-safe backdrop-blur", className)} {...props} />;
}
function SheetTitle({ className, ...props }: React.ComponentProps<typeof D.Title>) {
  return <D.Title className={cn("text-lg font-semibold tracking-tight", className)} {...props} />;
}
function SheetDescription({ className, ...props }: React.ComponentProps<typeof D.Description>) {
  return <D.Description className={cn("text-sm text-muted-foreground", className)} {...props} />;
}
export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetBody, SheetFooter, SheetTitle, SheetDescription };
