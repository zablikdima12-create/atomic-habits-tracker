"use client";

import { AppShell } from "@/components/AppShell";
import { useHabitsContext } from "@/context/HabitsContext";
import { addDays, getTodayString } from "@/lib/dates";
import { isCompletedOnDate } from "@/lib/storage";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function getWeekdayIndex(date: string) {
  const day = new Date(`${date}T12:00:00`).getDay();
  return day === 0 ? 6 : day - 1;
}

function formatMonth(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("ru-RU", {
    month: "long",
    year: "numeric",
  });
}

export default function HistoryPage() {
  const { habits, completions, streak } = useHabitsContext();

  const today = getTodayString();

  const days = Array.from({ length: 14 }, (_, index) =>
    addDays(today, -(13 - index))
  );

  const firstDay = days[0];
  const firstWeekday = getWeekdayIndex(firstDay);

  const calendarDays = [
    ...Array(firstWeekday).fill(null),
    ...days,
  ];

  return (
    <AppShell>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">
          История
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Твой прогресс за последние 14 дней
        </p>
      </header>

      <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <p className="text-sm text-zinc-500">
          Текущая серия
        </p>

        <p className="mt-1 text-3xl font-bold text-zinc-100">
          🔥 {streak} дней
        </p>
      </div>

      {habits.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
          <p className="text-zinc-500">
            Пока нет привычек для отображения истории.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="text-2xl">
                  {habit.emoji}
                </span>

                <div>
                  <h2 className="font-semibold text-zinc-100">
                    {habit.name}
                  </h2>

                  <p className="text-xs text-zinc-500">
  Цель: {habit.dailyGoal} мин · Минимум: {habit.minVersion} мин
</p>
                </div>
              </div>

              <div className="mb-2 grid grid-cols-7 gap-2">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="text-center text-[11px] font-medium text-zinc-500"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="h-12"
                      />
                    );
                  }

                  const completed = isCompletedOnDate(
                    completions,
                    habit.id,
                    date
                  );

                  const isToday = date === today;

                  return (
                    <div
                      key={date}
                      className={`flex h-12 flex-col items-center justify-center rounded-xl ${
                        completed
                          ? "bg-emerald-500 text-zinc-950"
                          : "bg-zinc-800 text-zinc-500"
                      } ${
                        isToday
                          ? "ring-2 ring-zinc-300 ring-offset-2 ring-offset-zinc-950"
                          : ""
                      }`}
                    >
                      <span className="text-sm font-semibold">
                        {date.slice(8, 10)}
                      </span>

                      <span className="text-[10px]">
                        {completed ? "✓" : "·"}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 text-center text-xs capitalize text-zinc-600">
                {formatMonth(today)}
              </p>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}