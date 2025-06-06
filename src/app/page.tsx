import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex justify-center items-center h-dvh">
      <Button asChild>
        <Link href="/products">상품 목록</Link>
      </Button>
    </main>
  );
}
