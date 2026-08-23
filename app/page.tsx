"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { HabitCard } from "@/components/HabitCard";
import { ProgressBar } from "@/components/ProgressBar";
import { StreakBadge } from "@/components/StreakBadge";
import { useHabitsContext } from "@/context/HabitsContext";
import { formatDisplayDate, getTodayString } from "@/lib/dates";

export default function HomePage() {
  const {
    habits,
    isLoaded,
    todayProgress,
    streak,
    categoryProgress,
    toggleCompletion,
    isHabitDoneToday,
  } = useHabitsContext();

  const today = getTodayString();

  if (!isLoaded) {
    return (
      <AppShell>
        <div className="flex flex-1 items-center justify-center py-20">
          <p className="text-zinc-500">Загрузка...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">
          Atomic Habits Tracker
        </h1>
        <p className="mt-1 text-sm capitalize text-zinc-500">
          {formatDisplayDate(today)}
        </p>
      </header>

      <div className="mb-6 space-y-4">
        <ProgressBar percentage={todayProgress} />
        <StreakBadge streak={streak} />
      </div>
      <section className="mb-6">
  <h2 className="mb-3 text-sm font-medium text-zinc-400">
    Развитие
  </h2>

  <div className="grid grid-cols-2 gap-3">
    {[
      { key: "mind", name: "Разум" },
      { key: "fitness", name: "Физическая форма" },
      { key: "money", name: "Деньги" },
    ].map((category) => (
      <div
        key={category.key}
        className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4"
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-200">
            {category.name}
          </span>
        </div>

        <div className="mb-2 h-2 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{
              width: `${categoryProgress[
                category.key as keyof typeof categoryProgress
              ]}%`,
            }}
          />
        </div>

        <p className="text-xs text-zinc-500">
          {
            categoryProgress[
              category.key as keyof typeof categoryProgress
            ]
          }
          %
        </p>
      </div>
    ))}
  </div>
</section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-zinc-400">
          Привычки на сегодня
        </h2>

        {habits.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
            <p className="text-zinc-500">Пока нет привычек</p>
            <Link
              href="/habits"
              className="mt-3 inline-block text-sm text-emerald-400 hover:text-emerald-300"
            >
              Добавить первую привычку →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompleted={isHabitDoneToday(habit.id)}
                onToggle={() => toggleCompletion(habit.id)}
              />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
