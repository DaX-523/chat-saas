"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";

// Public routes that don't require authentication
const publicRoutes = ["/login", "/signup"];

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authState } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Auth check function
    const authCheck = () => {
      // If page is login or signup and user is already logged in, redirect to home
      if (publicRoutes.includes(pathname) && authState.isAuthenticated) {
        router.push("/");
        return;
      }

      // If page requires auth and user isn't authenticated, redirect to login
      if (
        !publicRoutes.includes(pathname) &&
        !authState.isAuthenticated &&
        !authState.isLoading
      ) {
        router.push("/login");
        return;
      }
    };

    // Check auth on route change or auth state change
    authCheck();
  }, [authState.isAuthenticated, authState.isLoading, pathname, router]);

  // Show loading during auth check
  if (authState.isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-[#128C7E]"></div>
      </div>
    );
  }

  // If on protected route and authenticated, or on public route, render children
  return <>{children}</>;
}
