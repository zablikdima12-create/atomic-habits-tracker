"use client";

import { useCallback, useEffect, useState } from "react";

import {
  generateId,
  loadData,
  saveData,
} from "@/lib/storage";

import type {
  AppData,
  Note,
} from "@/types/habit";

export function useNotes() {
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

  const addNote = useCallback(
    (
      note: Omit<
        Note,
        "id" | "createdAt" | "updatedAt"
      >
    ) => {
      const now = new Date().toISOString();

      const newNote: Note = {
        ...note,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };

      persist({
        ...data,
        notes: [...data.notes, newNote],
      });
    },
    [data, persist]
  );

  const updateNote = useCallback(
    (
      id: string,
      updates: Partial<
        Omit<Note, "id" | "createdAt">
      >
    ) => {
      const notes = data.notes.map((note) =>
        note.id === id
          ? {
              ...note,
              ...updates,
              updatedAt:
                new Date().toISOString(),
            }
          : note
      );

      persist({
        ...data,
        notes,
      });
    },
    [data, persist]
  );

  const deleteNote = useCallback(
    (id: string) => {
      persist({
        ...data,
        notes: data.notes.filter(
          (note) => note.id !== id
        ),
      });
    },
    [data, persist]
  );

  return {
    notes: data.notes,
    isLoaded,
    addNote,
    updateNote,
    deleteNote,
  };
}