"use client";

import { useCallback, useEffect, useState } from "react";

import { getTodayString } from "@/lib/dates";

import {
  calculateStreak,
  generateId,
  getTodayProgress,
  isCompletedOnDate,
  loadData,
  saveData,
} from "@/lib/storage";

import type { AppData, Habit } from "@/types/habit";

export function useHabits() {
  const [data, setData] = useState<AppData>({
    habits: [],
    completions: [],
    goals: [],
    startedAt: new Date().toISOString(),
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setData(loadData());
    setIsLoaded(true);
  }, []);

  const persist = useCallback((next: AppData) => {
    setData(next);
    saveData(next);
  }, []);

  const addHabit = useCallback(
    (habit: Omit<Habit, "id" | "createdAt">) => {
      const newHabit: Habit = {
        ...habit,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };

      persist({
        ...data,
        habits: [...data.habits, newHabit],
      });
    },
    [data, persist]
  );

  const deleteHabit = useCallback(
    (id: string) => {
      persist({
        habits: data.habits.filter(
          (habit) => habit.id !== id
        ),
        completions: data.completions.filter(
          (completion) => completion.habitId !== id
        ),
        goals: data.goals,
        startedAt: data.startedAt,
      });
    },
    [data, persist]
  );

  const toggleCompletion = useCallback(
    (habitId: string, completedMinutes?: number) => {
      const today = getTodayString();

      const habit = data.habits.find(
        (habit) => habit.id === habitId
      );

      if (!habit) return;

      const alreadyDone = isCompletedOnDate(
        data.completions,
        habitId,
        today
      );

      // Если привычка уже выполнена — отменяем выполнение
      if (alreadyDone) {
        const completions = data.completions.filter(
          (completion) =>
            !(
              completion.habitId === habitId &&
              completion.date === today
            )
        );

        persist({
          ...data,
          completions,
        });

        return;
      }

      // Если значение не передано, ничего не делаем.
      // Это позволяет HabitCard сначала показать выбор.
      if (completedMinutes === undefined) {
        return;
      }

      // Полная цель = все очки.
      // Минимум = пропорциональная часть очков.
      const progressRatio = Math.min(
        completedMinutes / habit.dailyGoal,
        1
      );

      const earnedPoints = Math.max(
        1,
        Math.round(habit.points * progressRatio)
      );

      const completions = [
        ...data.completions,
        {
          habitId,
          date: today,
          value: earnedPoints,
        },
      ];

      persist({
        ...data,
        completions,
      });
    },
    [data, persist]
  );

  const today = getTodayString();

  const todayProgress = getTodayProgress(
    data.habits,
    data.completions,
    today
  );

  const streak = calculateStreak(
    data.habits,
    data.completions
  );

  const categories = [
    "mind",
    "fitness",
    "money",
  ] as const;

  const categoryProgress = categories.reduce(
    (result, category) => {
      const categoryHabits = data.habits.filter(
        (habit) => habit.category === category
      );

      if (categoryHabits.length === 0) {
        result[category] = 0;
        return result;
      }

      const completed = categoryHabits.filter((habit) =>
        isCompletedOnDate(
          data.completions,
          habit.id,
          today
        )
      ).length;

      result[category] = Math.round(
        (completed / categoryHabits.length) * 100
      );

      return result;
    },
    {} as Record<
      (typeof categories)[number],
      number
    >
  );

  const categoryPoints = categories.reduce(
    (result, category) => {
      const categoryHabitIds = new Set(
        data.habits
          .filter(
            (habit) => habit.category === category
          )
          .map((habit) => habit.id)
      );

      result[category] = data.completions
        .filter((completion) =>
          categoryHabitIds.has(completion.habitId)
        )
        .reduce(
          (total, completion) =>
            total + completion.value,
          0
        );

      return result;
    },
    {} as Record<
      (typeof categories)[number],
      number
    >
  );

  const categoryGrowth = categories.reduce(
    (result, category) => {
      result[category] =
        categoryPoints[category] / 10;

      return result;
    },
    {} as Record<
      (typeof categories)[number],
      number
    >
  );

  const isHabitDoneToday = useCallback(
    (habitId: string) =>
      isCompletedOnDate(
        data.completions,
        habitId,
        today
      ),
    [data.completions, today]
  );

  return {
    habits: data.habits,
    completions: data.completions,
    startedAt: data.startedAt,
    isLoaded,
    todayProgress,
    streak,
    categoryProgress,
    categoryPoints,
    categoryGrowth,
    addHabit,
    deleteHabit,
    toggleCompletion,
    isHabitDoneToday,
  };
}
