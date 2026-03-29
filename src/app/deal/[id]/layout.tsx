import { deals } from "@/lib/data";

export function generateStaticParams() {
  return deals.map((deal) => ({ id: deal.id }));
}

export default function DealLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
