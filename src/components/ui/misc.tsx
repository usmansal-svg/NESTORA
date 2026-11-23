"use client";
import * as React from "react";
import { Switch as S, Progress as P, Avatar as A, Separator as Sep, Checkbox as C, RadioGroup as R, Slider as Sl, Tooltip as Tt, Popover as Po, DropdownMenu as DM, Select as Se, Accordion as Ac } from "radix-ui";
import { CheckIcon, ChevronDownIcon, CircleIcon } from "lucide-react";
import { cn, initials } from "@/lib/utils";

export function Switch({ className, ...props }: React.ComponentProps<typeof S.Root>) {
  return (
    <S.Root
      className={cn(
        "peer inline-flex h-6 w-10 shrink-0 items-center rounded-full border border-transparent transition-colors outline-none data-[state=checked]:bg-pine-600 data-[state=unchecked]:bg-sand-300 disabled:opacity-50",
        className
      )}
      {...props}
    >
      <S.Thumb className="pointer-events-none block size-5 rounded-full bg-white shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-[17px] data-[state=unchecked]:translate-x-[1px]" />
    </S.Root>
  );
}

export function Progress({ className, value, indicatorClassName, ...props }: React.ComponentProps<typeof P.Root> & { indicatorClassName?: string }) {
  return (
    <P.Root className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)} {...props}>
      <P.Indicator className={cn("h-full w-full flex-1 rounded-full bg-pine-600 transition-all duration-700", indicatorClassName)} style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
    </P.Root>
  );
}

export function Avatar({ src, name, className, ring }: { src?: string; name: string; className?: string; ring?: boolean }) {
  return (
    <A.Root className={cn("relative flex size-10 shrink-0 overflow-hidden rounded-full bg-pine-100", ring && "ring-2 ring-card", className)}>
      {src && <A.Image src={src} alt={name} className="aspect-square size-full object-cover" />}
      <A.Fallback delayMs={src ? 400 : 0} className="flex size-full items-center justify-center bg-gradient-to-br from-pine-100 to-pine-200 text-[0.8em] font-semibold text-pine-800">
        {initials(name)}
      </A.Fallback>
    </A.Root>
  );
}

export function Separator({ className, ...props }: React.ComponentProps<typeof Sep.Root>) {
  return <Sep.Root className={cn("shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px", className)} {...props} />;
}

export function Checkbox({ className, ...props }: React.ComponentProps<typeof C.Root>) {
  return (
    <C.Root className={cn("peer size-5 shrink-0 rounded-md border border-input bg-card outline-none data-[state=checked]:border-pine-600 data-[state=checked]:bg-pine-600 data-[state=checked]:text-white", className)} {...props}>
      <C.Indicator className="flex items-center justify-center"><CheckIcon className="size-3.5" strokeWidth={3} /></C.Indicator>
    </C.Root>
  );
}

export const RadioGroup = ({ className, ...props }: React.ComponentProps<typeof R.Root>) => <R.Root className={cn("grid gap-2", className)} {...props} />;
export function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof R.Item>) {
  return (
    <R.Item className={cn("aspect-square size-5 shrink-0 rounded-full border border-input bg-card outline-none data-[state=checked]:border-pine-600", className)} {...props}>
      <R.Indicator className="flex items-center justify-center"><CircleIcon className="size-2.5 fill-pine-600 text-pine-600" /></R.Indicator>
    </R.Item>
  );
}

export function Slider({ className, ...props }: React.ComponentProps<typeof Sl.Root>) {
  const vals = props.value || props.defaultValue || [0];
  return (
    <Sl.Root className={cn("relative flex w-full touch-none items-center select-none py-2", className)} {...props}>
      <Sl.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-secondary">
        <Sl.Range className="absolute h-full bg-pine-600" />
      </Sl.Track>
      {vals.map((_, i) => (
        <Sl.Thumb key={i} className="block size-5 rounded-full border-2 border-pine-600 bg-white shadow-sm outline-none focus-visible:ring-4 focus-visible:ring-ring/20" />
      ))}
    </Sl.Root>
  );
}

export const TooltipProvider = Tt.Provider;
export function Tooltip({ children, content }: { children: React.ReactNode; content: React.ReactNode }) {
  return (
    <Tt.Root delayDuration={150}>
      <Tt.Trigger asChild>{children}</Tt.Trigger>
      <Tt.Portal>
        <Tt.Content sideOffset={6} className="z-50 rounded-lg bg-pine-950 px-2.5 py-1.5 text-xs text-white shadow-lift animate-in fade-in-0 zoom-in-95">
          {content}
        </Tt.Content>
      </Tt.Portal>
    </Tt.Root>
  );
}

export const Popover = Po.Root;
export const PopoverTrigger = Po.Trigger;
export function PopoverContent({ className, align = "center", sideOffset = 8, ...props }: React.ComponentProps<typeof Po.Content>) {
  return (
    <Po.Portal>
      <Po.Content align={align} sideOffset={sideOffset} className={cn("z-50 w-72 rounded-2xl border bg-popover p-4 shadow-lift outline-none animate-in fade-in-0 zoom-in-95", className)} {...props} />
    </Po.Portal>
  );
}

export const DropdownMenu = DM.Root;
export const DropdownMenuTrigger = DM.Trigger;
export function DropdownMenuContent({ className, sideOffset = 6, ...props }: React.ComponentProps<typeof DM.Content>) {
  return (
    <DM.Portal>
      <DM.Content sideOffset={sideOffset} className={cn("z-50 min-w-[12rem] overflow-hidden rounded-2xl border bg-popover p-1.5 shadow-lift animate-in fade-in-0 zoom-in-95", className)} {...props} />
    </DM.Portal>
  );
}
export function DropdownMenuItem({ className, ...props }: React.ComponentProps<typeof DM.Item>) {
  return <DM.Item className={cn("relative flex cursor-pointer select-none items-center gap-2.5 rounded-xl px-3 py-2 text-sm outline-none data-[highlighted]:bg-secondary [&_svg]:size-4 [&_svg]:text-muted-foreground", className)} {...props} />;
}
export function DropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof DM.Label>) {
  return <DM.Label className={cn("px-3 py-1.5 text-xs font-medium text-muted-foreground", className)} {...props} />;
}
export function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DM.Separator>) {
  return <DM.Separator className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}

export function Select({ value, onValueChange, options, placeholder, className }: { value?: string; onValueChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string; className?: string }) {
  return (
    <Se.Root value={value} onValueChange={onValueChange}>
      <Se.Trigger className={cn("flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-input bg-card px-3.5 text-[15px] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 data-[placeholder]:text-muted-foreground md:text-sm", className)}>
        <Se.Value placeholder={placeholder} />
        <Se.Icon><ChevronDownIcon className="size-4 opacity-60" /></Se.Icon>
      </Se.Trigger>
      <Se.Portal>
        <Se.Content position="popper" sideOffset={6} className="z-[60] max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border bg-popover p-1 shadow-lift animate-in fade-in-0 zoom-in-95">
          <Se.Viewport className="p-0.5">
            {options.map((o) => (
              <Se.Item key={o.value} value={o.value} className="relative flex cursor-pointer select-none items-center rounded-xl py-2 pl-3 pr-8 text-sm outline-none data-[highlighted]:bg-secondary">
                <Se.ItemText>{o.label}</Se.ItemText>
                <Se.ItemIndicator className="absolute right-2.5"><CheckIcon className="size-4 text-pine-600" /></Se.ItemIndicator>
              </Se.Item>
            ))}
          </Se.Viewport>
        </Se.Content>
      </Se.Portal>
    </Se.Root>
  );
}

export const Accordion = Ac.Root;
export function AccordionItem({ className, ...props }: React.ComponentProps<typeof Ac.Item>) {
  return <Ac.Item className={cn("border-b border-border/70 last:border-b-0", className)} {...props} />;
}
export function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof Ac.Trigger>) {
  return (
    <Ac.Header className="flex">
      <Ac.Trigger className={cn("flex flex-1 items-center justify-between gap-4 py-4 text-left text-sm font-medium outline-none [&[data-state=open]>svg]:rotate-180", className)} {...props}>
        {children}
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      </Ac.Trigger>
    </Ac.Header>
  );
}
export function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof Ac.Content>) {
  return (
    <Ac.Content className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down" {...props}>
      <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </Ac.Content>
  );
}
