"use client";

import { AppShell } from "@/components/AppShell";
import { useHabitsContext } from "@/context/HabitsContext";
import { addDays, getTodayString } from "@/lib/dates";

const categories = [
  { key: "mind", name: "Разум" },
  { key: "fitness", name: "Физическая форма" },
  { key: "money", name: "Деньги" },
] as const;

export default function GrowthPage() {
  const { habits, completions, isLoaded } = useHabitsContext();

  if (!isLoaded) {
    return (
      <AppShell>
        <div className="flex justify-center py-20">
          <p className="text-zinc-500">Загрузка...</p>
        </div>
      </AppShell>
    );
  }

  const today = getTodayString();

  return (
    <AppShell>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">
          Рост
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Накопление маленьких действий
        </p>
      </header>

      <div className="space-y-4">
        {categories.map((category) => {
          const categoryHabitIds = new Set(
            habits
              .filter((habit) => habit.category === category.key)
              .map((habit) => habit.id)
          );

          const totalPoints = completions
            .filter((completion) =>
              categoryHabitIds.has(completion.habitId)
            )
            .reduce(
              (total, completion) => total + completion.value,
              0
            );

          const growth = totalPoints / 10;

          const days = Array.from({ length: 7 }, (_, index) =>
            addDays(today, index - 6)
          );
          
          const history = days.map((date) => {
            const pointsUntilDay = completions
              .filter(
                (completion) =>
                  completion.date <= date &&
                  categoryHabitIds.has(completion.habitId)
              )
              .reduce(
                (total, completion) => total + completion.value,
                0
              );
          
            const pointsForDay = completions
              .filter(
                (completion) =>
                  completion.date === date &&
                  categoryHabitIds.has(completion.habitId)
              )
              .reduce(
                (total, completion) => total + completion.value,
                0
              );
          
            return {
              date,
              points: pointsForDay,
              growth: pointsUntilDay / 10,
            };
          });
          
          const maxGrowth = Math.max(
            ...history.map((day) => day.growth),
            1
          );

          return (
            <section
              key={category.key}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4"
            >
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <h2 className="font-medium text-zinc-100">
                    {category.name}
                  </h2>

                  <p className="mt-1 text-xs text-zinc-500">
                    {totalPoints} очков
                  </p>
                </div>

                <p className="text-xl font-semibold text-emerald-400">
                  +{growth.toFixed(1)}%
                </p>
              </div>

              <div className="flex h-40 items-end gap-2 rounded-xl bg-zinc-950 p-3">
                {history.map((day) => {
                  const height =
                    day.growth === 0
                      ? 3
                      : Math.max(
                          (day.growth / maxGrowth) * 100,
                          8
                        );

                  const dayName = new Date(
                    `${day.date}T12:00:00`
                  ).toLocaleDateString("ru-RU", {
                    weekday: "short",
                  });

                  return (
                    <div
                      key={day.date}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                    >
                      <span className="text-[9px] text-zinc-600">
                        {day.growth > 0
                          ? `${day.growth.toFixed(1)}%`
                          : ""}
                      </span>

                      <div
                        className="w-full rounded-t bg-emerald-500 transition-all"
                        style={{
                          height: `${height}%`,
                        }}
                      />

                      <span className="text-[9px] capitalize text-zinc-600">
                        {dayName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}