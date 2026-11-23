import { redirect } from "next/navigation";

// The Building tab was folded into the resident home screen; keep old links working.
export default function BuildingHub() {
  redirect("/resident");
}
