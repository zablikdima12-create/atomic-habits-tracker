"use client";

import { HabitsProvider } from "@/context/HabitsContext";
import { Navigation } from "@/components/Navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <HabitsProvider>
      <div className="mx-auto flex min-h-full w-full max-w-lg flex-col px-4 pb-24 pt-6">
        {children}
      </div>
      <Navigation />
    </HabitsProvider>
  );
}
