import type { AppData, Completion, Habit } from "@/types/habit";

import { addDays, getTodayString } from "./dates";

const STORAGE_KEY = "atomic-habits-tracker";

const EMPTY_DATA: AppData = {
  habits: [],
  completions: [],
  goals: [],
  startedAt: new Date().toISOString(),
};

export function loadData(): AppData {
  if (typeof window === "undefined") {
    return EMPTY_DATA;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return EMPTY_DATA;
    }

    const parsed = JSON.parse(raw) as Partial<AppData>;

    return {
      habits: parsed.habits ?? [],
      completions: parsed.completions ?? [],
      goals: parsed.goals ?? [],
      startedAt:
        parsed.startedAt ?? new Date().toISOString(),
    };
  } catch {
    return EMPTY_DATA;
  }
}

export function saveData(data: AppData): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
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
  if (habits.length === 0) {
    return 0;
  }

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
  if (habits.length === 0) {
    return false;
  }

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
  if (habits.length === 0) {
    return 0;
  }

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
