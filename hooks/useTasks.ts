"use client";

import { useCallback, useEffect, useState } from "react";

import {
  generateId,
  loadData,
  saveData,
} from "@/lib/storage";

import type {
  AppData,
  HabitCategory,
  Task,
} from "@/types/habit";

export function useTasks() {
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

  const addTask = useCallback(
    (
      title: string,
      goalId: string,
      category: HabitCategory
    ) => {
      if (!title.trim()) return;

      const newTask: Task = {
        id: generateId(),
        goalId,
        title: title.trim(),
        category,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      persist({
        ...data,
        tasks: [...data.tasks, newTask],
      });
    },
    [data, persist]
  );

  const toggleTask = useCallback(
    (id: string) => {
      const tasks = data.tasks.map((task) => {
        if (task.id !== id) {
          return task;
        }

        const completed = !task.completed;

        return {
          ...task,
          completed,
          completedAt: completed
            ? new Date().toISOString()
            : undefined,
        };
      });

      persist({
        ...data,
        tasks,
      });
    },
    [data, persist]
  );

  const deleteTask = useCallback(
    (id: string) => {
      persist({
        ...data,
        tasks: data.tasks.filter(
          (task) => task.id !== id
        ),
      });
    },
    [data, persist]
  );

  return {
    tasks: data.tasks,
    isLoaded,
    addTask,
    toggleTask,
    deleteTask,
  };
}