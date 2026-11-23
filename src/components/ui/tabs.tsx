"use client";
import * as React from "react";
import { Tabs as T } from "radix-ui";
import { cn } from "@/lib/utils";

const Tabs = T.Root;
function TabsList({ className, ...props }: React.ComponentProps<typeof T.List>) {
  return <T.List className={cn("inline-flex h-10 items-center gap-1 rounded-xl bg-secondary p-1 text-muted-foreground", className)} {...props} />;
}
function TabsTrigger({ className, ...props }: React.ComponentProps<typeof T.Trigger>) {
  return (
    <T.Trigger
      className={cn(
        "inline-flex h-full flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-[13px] font-medium transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-soft [&_svg]:size-4",
        className
      )}
      {...props}
    />
  );
}
function TabsContent({ className, ...props }: React.ComponentProps<typeof T.Content>) {
  return <T.Content className={cn("mt-4 outline-none data-[state=active]:animate-rise", className)} {...props} />;
}
export { Tabs, TabsList, TabsTrigger, TabsContent };
