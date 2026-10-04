"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Belt-and-suspenders: whatever page we land on, make sure no speech from a
// previous page is still queued up or talking.
export default function RouteAudioGuard() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, [pathname]);

  return null;
}
