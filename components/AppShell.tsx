"use client";

import { HabitsProvider } from "@/context/HabitsContext";
import { Navigation } from "@/components/Navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <HabitsProvider>
      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col px-4 pb-28 pt-5 sm:px-6 sm:pt-8">
        {children}
      </div>

      <Navigation />
    </HabitsProvider>
  );
}