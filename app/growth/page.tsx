"use client";

import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { useHabitsContext } from "@/context/HabitsContext";
import { addDays, getTodayString } from "@/lib/dates";

const categories = [
  { key: "mind", name: "Разум" },
  { key: "fitness", name: "Физическая форма" },
  { key: "money", name: "Деньги" },
] as const;

function CompoundGrowth({
  startedAt,
}: {
  startedAt: string;
}) {
  const [rate, setRate] = useState(1);

  const milestones = [
    1,
    15,
    30,
    60,
    90,
    120,
    150,
    180,
    210,
    240,
    270,
    300,
    330,
    345,
    365,
  ];

  const startDate = new Date(startedAt);
  const today = new Date();

  const currentDay = Math.max(
    1,
    Math.floor(
      (today.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1
  );

  const values = milestones.map((day) =>
    Math.pow(1 + rate / 100, day)
  );

  const maxValue = values[values.length - 1];

  const currentValue = Math.pow(
    1 + rate / 100,
    currentDay
  );

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="mb-4">
        <h2 className="font-medium text-zinc-100">
          Эффект ежедневного улучшения
        </h2>

        <p className="mt-1 text-xs text-zinc-500">
          Как небольшое ежедневное улучшение
          накапливается за год
        </p>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-2">
        {[0.1, 0.5, 1].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRate(value)}
            className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
              rate === value
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            +{value}%
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-zinc-950 p-4">
        <div className="flex h-56 items-end gap-1">
          {milestones.map((day, index) => {
            const value = values[index];

            const height = Math.max(
              (value / maxValue) * 100,
              3
            );

            const isCurrent =
              currentDay <= day &&
              (index === 0 ||
                currentDay > milestones[index - 1]);

            return (
              <div
                key={day}
                className="relative flex h-full flex-1 flex-col items-center justify-end"
              >
                {isCurrent && (
                  <div className="absolute top-35 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-center">
                    <div className="rounded-md bg-zinc-800 px-2 py-1 text-[9px] font-medium text-emerald-400">
                      Ты здесь
                    </div>

                    <div className="text-sm leading-none text-emerald-400">
                      ↓
                    </div>
                  </div>
                )}

                <span className="mb-1 text-[8px] text-zinc-600">
                  {value.toFixed(1)}×
                </span>

                <div
                  className={`w-full rounded-t transition-all ${
                    isCurrent
                      ? "bg-emerald-400"
                      : "bg-emerald-500/70"
                  }`}
                  style={{
                    height: `${height}%`,
                  }}
                />

                <span className="mt-2 text-[8px] text-zinc-600">
                  {day}д
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500">
            Текущий день
          </p>

          <p className="mt-1 text-lg font-semibold text-zinc-100">
            День {currentDay}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-zinc-500">
            Накопленный эффект
          </p>

          <p className="mt-1 text-lg font-semibold text-emerald-400">
            {((currentValue - 1) * 100).toFixed(1)}x
          </p>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-zinc-600">
        1 год = 365 дней
      </p>
    </section>
  );
}

function WeeklyProgress({
  habits,
  completions,
}: {
  habits: any[];
  completions: any[];
}) {
  const today = getTodayString();

  const weekDays = Array.from(
    { length: 7 },
    (_, index) => addDays(today, index - 6)
  );

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="mb-5">
        <h2 className="font-medium text-zinc-100">
          Прогресс за неделю
        </h2>

        <p className="mt-1 text-xs text-zinc-500">
          На сколько процентов ты вырос каждый день
        </p>
      </div>

      <div className="space-y-5">
        {categories.map((category) => {
          const categoryHabitIds = new Set(
            habits
              .filter(
                (habit) =>
                  habit.category === category.key
              )
              .map((habit) => habit.id)
          );

          const days = weekDays.map((date) => {
            const points = completions
              .filter(
                (completion) =>
                  completion.date === date &&
                  categoryHabitIds.has(
                    completion.habitId
                  )
              )
              .reduce(
                (total, completion) =>
                  total + completion.value,
                0
              );

            return {
              date,
              growth: points / 10,
            };
          });

          const maxGrowth = Math.max(
            ...days.map((day) => day.growth),
            1
          );

          return (
            <div key={category.key}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-300">
                  {category.name}
                </span>

                <span className="text-[10px] text-zinc-600">
                  7 дней
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {days.map((day) => {
                  const isToday =
                    day.date === today;

                  const dayName = new Date(
                    `${day.date}T12:00:00`
                  ).toLocaleDateString(
                    "ru-RU",
                    {
                      weekday: "short",
                    }
                  );

                  const height =
                    day.growth === 0
                      ? 3
                      : Math.max(
                          (day.growth /
                            maxGrowth) *
                            100,
                          8
                        );

                  return (
                    <div
                      key={day.date}
                      className={`rounded-xl p-2 text-center ${
                        isToday
                          ? "border border-emerald-500/40 bg-emerald-500/10"
                          : "bg-zinc-950"
                      }`}
                    >
                      <p className="text-[9px] capitalize text-zinc-600">
                        {dayName}
                      </p>

                      <div className="mt-2 flex h-12 items-end justify-center">
                        <div
                          className={`w-3/5 rounded-t transition-all ${
                            day.growth > 0
                              ? "bg-emerald-500"
                              : "bg-zinc-800"
                          }`}
                          style={{
                            height: `${height}%`,
                          }}
                        />
                      </div>

                      <p
                        className={`mt-2 text-[10px] font-medium ${
                          day.growth > 0
                            ? "text-emerald-400"
                            : "text-zinc-700"
                        }`}
                      >
                        {day.growth > 0
                          ? `+${day.growth.toFixed(1)}%`
                          : "—"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function GrowthPage() {
  const {
    habits,
    completions,
    startedAt,
    isLoaded,
  } = useHabitsContext();

  if (!isLoaded) {
    return (
      <AppShell>
        <div className="flex justify-center py-20">
          <p className="text-zinc-500">
            Загрузка...
          </p>
        </div>
      </AppShell>
    );
  }

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
        <CompoundGrowth startedAt={startedAt} />

        <WeeklyProgress
          habits={habits}
          completions={completions}
        />
      </div>
    </AppShell>
  );
}
