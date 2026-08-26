"use client";

import type { Habit } from "@/types/habit";

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
}

export function HabitCard({
  habit,
  isCompleted,
  onToggle,
}: HabitCardProps) {
  const unit = habit.unit || "минут";

  return (
    <div
      className={`rounded-2xl border p-4 transition-colors ${
        isCompleted
          ? "border-emerald-500/40 bg-emerald-500/10"
          : "border-zinc-800 bg-zinc-900/60"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{habit.emoji}</span>

        <div className="min-w-0 flex-1">
          <h3
            className={`font-medium ${
              isCompleted
                ? "text-emerald-300 line-through"
                : "text-zinc-100"
            }`}
          >
            {habit.name}
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            Цель: {habit.dailyGoal} {unit}
          </p>

          <p className="mt-1 text-xs text-emerald-500/70">
            +{habit.points} очков
          </p>
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            isCompleted
              ? "Отменить выполнение"
              : "Отметить выполненной"
          }
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg transition-colors ${
            isCompleted
              ? "bg-emerald-500 text-white hover:bg-emerald-400"
              : "border border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-emerald-500/50 hover:text-emerald-400"
          }`}
        >
          {isCompleted ? "✓" : "+"}
        </button>
      </div>
    </div>
  );
}