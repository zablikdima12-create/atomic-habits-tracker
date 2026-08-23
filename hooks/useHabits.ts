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
  const [data, setData] = useState<AppData>({ habits: [], completions: [] });
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
      persist({ ...data, habits: [...data.habits, newHabit] });
    },
    [data, persist]
  );

  const deleteHabit = useCallback(
    (id: string) => {
      persist({
        habits: data.habits.filter((h) => h.id !== id),
        completions: data.completions.filter((c) => c.habitId !== id),
      });
    },
    [data, persist]
  );

  const toggleCompletion = useCallback(
    (habitId: string, value: number) => {
      const today = getTodayString();
  
      const alreadyDone = isCompletedOnDate(
        data.completions,
        habitId,
        today
      );
  
      const completions = alreadyDone
        ? data.completions.filter(
            (c) => !(c.habitId === habitId && c.date === today)
          )
        : [...data.completions, { habitId, date: today, value }];
  
      persist({ ...data, completions });
    },
    [data, persist]
  );

  const today = getTodayString();
  const todayProgress = getTodayProgress(data.habits, data.completions, today);
  const streak = calculateStreak(data.habits, data.completions);
  const categories = ["mind", "fitness", "money"] as const;

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
      isCompletedOnDate(data.completions, habit.id, today)
    ).length;

    result[category] = Math.round(
      (completed / categoryHabits.length) * 100
    );

    return result;
  },
  {} as Record<(typeof categories)[number], number>
);

  const isHabitDoneToday = useCallback(
    (habitId: string) => isCompletedOnDate(data.completions, habitId, today),
    [data.completions, today]
  );

  return {
    habits: data.habits,
    completions: data.completions,
    isLoaded,
    todayProgress,
    streak,
    categoryProgress,
    addHabit,
    deleteHabit,
    toggleCompletion,
    isHabitDoneToday,
  };
}
