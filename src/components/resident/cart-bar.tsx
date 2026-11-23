"use client";
import * as React from "react";
import { Bike, CheckCircle2, ChefHat, Minus, Plus, ShoppingBag, Store } from "lucide-react";
import { useDemo } from "@/lib/store";
import { getSeller } from "@/data/places";
import { pkr } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Segmented } from "@/components/shared/pickers";
import { Timeline } from "@/components/shared/kit";
import { PaySheet } from "./pay-sheet";

export function CartBar() {
  const s = useDemo();
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<"Delivery" | "Pickup">("Delivery");
  const [pay, setPay] = React.useState(false);
  const [placed, setPlaced] = React.useState<string | null>(null);
  const seller = s.cart[0] ? getSeller(s.cart[0].sellerId) : undefined;
  const count = s.cart.reduce((a, c) => a + c.qty, 0);
  const sub = s.cart.reduce((a, c) => a + c.qty * c.price, 0);
  const total = sub + (mode === "Delivery" ? 120 : 0);
  const order = s.orders.find((o) => o.id === placed);

  return (
    <>
      {count > 0 && (
        <button onClick={() => setOpen(true)} className="fixed inset-x-4 bottom-[88px] z-30 flex items-center justify-between rounded-2xl bg-primary px-5 py-3.5 text-white shadow-lift lg:bottom-6 lg:left-auto lg:right-40 lg:w-96">
          <span className="flex items-center gap-2 text-sm font-medium"><ShoppingBag className="size-4" /> {count} · {seller?.name}</span><span className="font-semibold">{pkr(sub)}</span>
        </button>
      )}
      <Sheet open={open} onOpenChange={(o) => { setOpen(o); if (!o) setPlaced(null); }}>
        <SheetContent>
          {order ? (
            <>
              <SheetHeader><SheetTitle>Order placed</SheetTitle><SheetDescription>{order.seller} · {order.id}</SheetDescription></SheetHeader>
              <SheetBody className="space-y-4">
                <div className="flex flex-col items-center rounded-3xl bg-pine-50 p-6 text-center"><CheckCircle2 className="size-12 text-pine-600" /><div className="mt-2 text-lg font-semibold">Estimated arrival 35–45 min</div><div className="text-sm text-muted-foreground">Rider gate pass auto-approved for A-1204</div></div>
                <div className="rounded-2xl border bg-card p-4"><Timeline items={[{ label: "Order confirmed", at: "Just now", done: true }, { label: "Preparing your food", active: true }, { label: order.mode === "Delivery" ? "Out for delivery" : "Ready for pickup" }, { label: "Delivered to your door" }]} /></div>
              </SheetBody>
              <SheetFooter><Button className="w-full" onClick={() => setOpen(false)}>Done</Button></SheetFooter>
            </>
          ) : (
            <>
              <SheetHeader><SheetTitle>Your order</SheetTitle><SheetDescription className="flex items-center gap-1.5"><ChefHat className="size-4" /> {seller?.name} · {seller?.eta}</SheetDescription></SheetHeader>
              <SheetBody className="space-y-4">
                <Segmented value={mode} onChange={setMode} options={[{ value: "Delivery", label: <span className="flex items-center justify-center gap-1.5"><Bike className="size-4" /> Delivery</span> }, { value: "Pickup", label: <span className="flex items-center justify-center gap-1.5"><Store className="size-4" /> Pickup{seller?.apt ? ` · ${seller.apt}` : ""}</span> }]} />
                <div className="divide-y rounded-2xl border bg-card">
                  {s.cart.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="flex-1"><div className="text-sm font-medium">{c.name}</div><div className="text-xs text-muted-foreground">{pkr(c.price)}</div></div>
                      <div className="flex items-center gap-1 rounded-lg bg-secondary"><button className="grid size-8 place-items-center" onClick={() => s.decCart(c.id)}><Minus className="size-3.5" /></button><span className="w-5 text-center text-sm font-semibold">{c.qty}</span><button className="grid size-8 place-items-center" onClick={() => s.addToCart({ id: c.id, sellerId: c.sellerId, name: c.name, price: c.price })}><Plus className="size-3.5" /></button></div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-secondary/70 p-4 text-sm">
                  <div className="flex justify-between py-0.5"><span className="text-muted-foreground">Subtotal</span><span>{pkr(sub)}</span></div>
                  {mode === "Delivery" && <div className="flex justify-between py-0.5"><span className="text-muted-foreground">Delivery</span><span>{pkr(120)}</span></div>}
                  <div className="mt-1 flex justify-between border-t pt-2 font-semibold"><span>Total</span><span>{pkr(total)}</span></div>
                </div>
              </SheetBody>
              <SheetFooter><Button size="lg" className="w-full" onClick={() => setPay(true)}>Place order · {pkr(total)}</Button></SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
      <PaySheet open={pay} onOpenChange={setPay} amount={total} title={`Food order · ${seller?.name ?? ""}`} payee={seller?.name ?? "Seller"} onPaid={() => { const id = s.placeOrder(seller?.name ?? "Seller", mode); setPlaced(id); }} />
    </>
  );
}
