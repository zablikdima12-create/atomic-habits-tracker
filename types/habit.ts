export type HabitCategory =
  | "mind"
  | "fitness"
  | "money";

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  dailyGoal: number;
  minVersion: number;
  points: number;
  category: HabitCategory;
  createdAt: string;
}

export interface Completion {
  habitId: string;
  date: string;
  value: number;
}

export interface AppData {
  habits: Habit[];
  completions: Completion[];
  startedAt: string;
}