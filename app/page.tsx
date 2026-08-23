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
                onToggle={(value) => toggleCompletion(habit.id, value)}
              />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
