import { ResidentShell } from "@/components/resident/shell";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <ResidentShell>{children}</ResidentShell>;
}
