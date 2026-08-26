export type HabitCategory =
  | "mind"
  | "fitness"
  | "money";

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  dailyGoal: number;
  unit: string;
  points: number;
  category: HabitCategory;
  createdAt: string;
}

export interface Completion {
  habitId: string;
  date: string;
  value: number;
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  category: HabitCategory;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  completed: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  goalId: string;
  title: string;
  category: HabitCategory;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppData {
  habits: Habit[];
  completions: Completion[];
  goals: Goal[];
  tasks: Task[];
  notes: Note[];
  startedAt: string;
}