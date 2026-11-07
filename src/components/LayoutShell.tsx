"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { type ReactNode } from "react";

const HIDE_SHELL_ROUTES = ["/admin", "/user", "/login", "/signup"];

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hideShell = HIDE_SHELL_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (hideShell) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
