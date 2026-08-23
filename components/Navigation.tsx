"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Сегодня", icon: "☀️" },
  { href: "/habits", label: "Привычки", icon: "📋" },
  { href: "/growth", label: "Рост", icon: "📈" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors ${
                isActive
                  ? "text-emerald-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
