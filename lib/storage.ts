import type { AppData, Completion, Habit } from "@/types/habit";

import { addDays, getTodayString } from "./dates";

const STORAGE_KEY = "atomic-habits-tracker";

const EMPTY_DATA: AppData = {
  habits: [],
  completions: [],
};

export function loadData(): AppData {
  if (typeof window === "undefined") return EMPTY_DATA;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return EMPTY_DATA;

    const parsed = JSON.parse(raw) as AppData;

    return {
      habits: parsed.habits ?? [],
      completions: parsed.completions ?? [],
    };
  } catch {
    return EMPTY_DATA;
  }
}

export function saveData(data: AppData): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function isCompletedOnDate(
  completions: Completion[],
  habitId: string,
  date: string
): boolean {
  return completions.some(
    (completion) =>
      completion.habitId === habitId &&
      completion.date === date
  );
}

export function getTodayCompletions(
  completions: Completion[],
  date: string
): Completion[] {
  return completions.filter(
    (completion) => completion.date === date
  );
}

export function getTodayProgress(
  habits: Habit[],
  completions: Completion[],
  date: string
): number {
  if (habits.length === 0) return 0;

  const completed = habits.filter((habit) =>
    isCompletedOnDate(
      completions,
      habit.id,
      date
    )
  ).length;

  return Math.round(
    (completed / habits.length) * 100
  );
}

export function isDayFullyCompleted(
  habits: Habit[],
  completions: Completion[],
  date: string
): boolean {
  if (habits.length === 0) return false;

  return habits.every((habit) =>
    isCompletedOnDate(
      completions,
      habit.id,
      date
    )
  );
}

export function calculateStreak(
  habits: Habit[],
  completions: Completion[]
): number {
  if (habits.length === 0) return 0;

  const today = getTodayString();

  let streak = 0;
  let currentDate = today;

  if (
    !isDayFullyCompleted(
      habits,
      completions,
      today
    )
  ) {
    currentDate = addDays(today, -1);
  }

  while (
    isDayFullyCompleted(
      habits,
      completions,
      currentDate
    )
  ) {
    streak++;
    currentDate = addDays(
      currentDate,
      -1
    );
  }

  return streak;
}

/**
 * Данные одного дня для графика роста.
 */
export interface GrowthHistoryPoint {
  date: string;
  points: number;
  growth: number;
}

/**
 * Рассчитывает накопительный рост категории.
 *
 * Каждые 10 очков дают примерно 1% базового
 * прироста, после чего прирост начинает
 * складываться с предыдущим результатом.
 *
 * Например:
 *
 * День 1: +10 очков → +1.0%
 * День 2: +10 очков → уже больше 2.0%
 * День 3: +10 очков → ещё немного больше
 *
 * Это создаёт эффект сложного процента.
 */
export function getCategoryGrowthHistory(
  habits: Habit[],
  completions: Completion[],
  category: Habit["category"]
): GrowthHistoryPoint[] {
  const categoryHabitIds = new Set(
    habits
      .filter(
        (habit) => habit.category === category
      )
      .map((habit) => habit.id)
  );

  const categoryCompletions =
    completions.filter((completion) =>
      categoryHabitIds.has(
        completion.habitId
      )
    );

  if (categoryCompletions.length === 0) {
    return [];
  }

  const dates = Array.from(
    new Set(
      categoryCompletions.map(
        (completion) => completion.date
      )
    )
  ).sort();

  let growth = 0;

  return dates.map((date) => {
    const dailyPoints =
      categoryCompletions
        .filter(
          (completion) =>
            completion.date === date
        )
        .reduce(
          (total, completion) =>
            total + completion.value,
          0
        );

    /*
     * 1000 очков = 100% базового роста.
     *
     * То есть:
     * 10 очков = 1%
     * 20 очков = 2%
     *
     * После каждого дня результат
     * умножается на предыдущий результат.
     */
    const dailyGrowth =
      dailyPoints / 1000;

    growth =
      (1 + growth / 100) *
        (1 + dailyGrowth) *
        100 -
      100;

    return {
      date,
      points: dailyPoints,
      growth: Number(growth.toFixed(2)),
    };
  });
}

/**
 * Возвращает текущий накопленный рост категории.
 */
export function getCategoryGrowth(
  habits: Habit[],
  completions: Completion[],
  category: Habit["category"]
): number {
  const history =
    getCategoryGrowthHistory(
      habits,
      completions,
      category
    );

  if (history.length === 0) {
    return 0;
  }

  return history[history.length - 1].growth;
}
