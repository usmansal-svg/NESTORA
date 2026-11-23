"use client";
import * as React from "react";
import { Dialog as D } from "radix-ui";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = D.Root;
const DialogTrigger = D.Trigger;
const DialogClose = D.Close;

function DialogContent({ className, children, hideClose, ...props }: React.ComponentProps<typeof D.Content> & { hideClose?: boolean }) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-50 bg-pine-950/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <D.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-3xl border bg-card p-6 shadow-lift duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      >
        {children}
        {!hideClose && (
          <D.Close className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-secondary text-muted-foreground transition hover:text-foreground">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </D.Close>
        )}
      </D.Content>
    </D.Portal>
  );
}
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 pr-8", className)} {...props} />;
}
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
}
function DialogTitle({ className, ...props }: React.ComponentProps<typeof D.Title>) {
  return <D.Title className={cn("text-lg font-semibold tracking-tight", className)} {...props} />;
}
function DialogDescription({ className, ...props }: React.ComponentProps<typeof D.Description>) {
  return <D.Description className={cn("text-sm text-muted-foreground", className)} {...props} />;
}
export { Dialog, DialogTrigger, DialogClose, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
