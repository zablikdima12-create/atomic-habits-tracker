"use client";

import { useCallback, useEffect, useState } from "react";

import { generateId, loadData, saveData } from "@/lib/storage";
import type { AppData, Goal, HabitCategory } from "@/types/habit";

export function useGoals() {
  const [data, setData] = useState<AppData>({
    habits: [],
    completions: [],
    goals: [],
    tasks: [],
    notes: [],
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

  const addGoal = useCallback(
    (goal: Omit<Goal, "id" | "createdAt" | "completed">) => {
      const newGoal: Goal = {
        ...goal,
        id: generateId(),
        createdAt: new Date().toISOString(),
        completed: false,
      };

      persist({
        ...data,
        goals: [...data.goals, newGoal],
      });
    },
    [data, persist]
  );

  const deleteGoal = useCallback(
    (id: string) => {
      persist({
        ...data,
        goals: data.goals.filter(
          (goal) => goal.id !== id
        ),
      });
    },
    [data, persist]
  );

  const updateGoalProgress = useCallback(
    (id: string, current: number) => {
      const goals = data.goals.map((goal) => {
        if (goal.id !== id) {
          return goal;
        }

        const newCurrent = Math.max(
          0,
          Math.min(current, goal.target)
        );

        return {
          ...goal,
          current: newCurrent,
          completed: newCurrent >= goal.target,
        };
      });

      persist({
        ...data,
        goals,
      });
    },
    [data, persist]
  );

  const toggleGoalCompleted = useCallback(
    (id: string) => {
      const goals = data.goals.map((goal) => {
        if (goal.id !== id) {
          return goal;
        }

        return {
          ...goal,
          completed: !goal.completed,
          current: !goal.completed
            ? goal.target
            : Math.min(goal.current, goal.target - 1),
        };
      });

      persist({
        ...data,
        goals,
      });
    },
    [data, persist]
  );

  const updateGoal = useCallback(
    (
      id: string,
      updates: Partial<
        Omit<Goal, "id" | "createdAt">
      >
    ) => {
      const goals = data.goals.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              ...updates,
            }
          : goal
      );

      persist({
        ...data,
        goals,
      });
    },
    [data, persist]
  );

  return {
    goals: data.goals,
    isLoaded,
    addGoal,
    deleteGoal,
    updateGoal,
    updateGoalProgress,
    toggleGoalCompleted,
  };
}