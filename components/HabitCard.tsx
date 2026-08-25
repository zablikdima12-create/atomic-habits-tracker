"use client";

import { useState } from "react";

import type { Habit } from "@/types/habit";

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: (completedMinutes?: number) => void;
}

export function HabitCard({
  habit,
  isCompleted,
  onToggle,
}: HabitCardProps) {
  const [showOptions, setShowOptions] =
    useState(false);

  const handleComplete = (minutes: number) => {
    onToggle(minutes);
    setShowOptions(false);
  };

  const handleMainClick = () => {
    if (isCompleted) {
      onToggle();
      return;
    }

    setShowOptions((value) => !value);
  };

  return (
    <div
      className={`rounded-2xl border p-4 transition-colors ${
        isCompleted
          ? "border-emerald-500/40 bg-emerald-500/10"
          : "border-zinc-800 bg-zinc-900/60"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">
          {habit.emoji}
        </span>

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
            Цель: {habit.dailyGoal} мин · Минимум:{" "}
            {habit.minVersion} мин
          </p>

          <p className="mt-1 text-xs text-emerald-500/70">
            +{habit.points} очков за цель
          </p>
        </div>

        <button
          type="button"
          onClick={handleMainClick}
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

      {showOptions && !isCompleted && (
        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
          <p className="mb-3 text-sm font-medium text-zinc-300">
            Как выполнил?
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                handleComplete(habit.minVersion)
              }
              className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-left transition-colors hover:border-emerald-500/50"
            >
              <span className="block text-sm font-medium text-zinc-100">
                {habit.minVersion} мин
              </span>

              <span className="mt-1 block text-xs text-zinc-500">
                Минимум
              </span>

              <span className="mt-1 block text-xs text-emerald-500/70">
                {Math.max(
                  1,
                  Math.round(
                    habit.points *
                      (habit.minVersion /
                        habit.dailyGoal)
                  )
                )}{" "}
                очк.
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleComplete(habit.dailyGoal)
              }
              className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-left transition-colors hover:bg-emerald-500/20"
            >
              <span className="block text-sm font-medium text-emerald-300">
                {habit.dailyGoal} мин
              </span>

              <span className="mt-1 block text-xs text-emerald-400/70">
                Цель
              </span>

              <span className="mt-1 block text-xs text-emerald-400">
                {habit.points} очков
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowOptions(false)}
            className="mt-3 w-full text-xs text-zinc-500 hover:text-zinc-300"
          >
            Отмена
          </button>
        </div>
      )}
    </div>
  );
}