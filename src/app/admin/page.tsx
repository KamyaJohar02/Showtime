"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin"); // Already showing dashboard by default in layout
  }, [router]);

  return null; // don't show anything here
}
