"use client";

import { useEffect } from "react";
import { initMocks } from "@/app/shared/lib/init-mocks";




export function MSWProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initMocks();
  }, []);

  return <>{children}</>;
}
