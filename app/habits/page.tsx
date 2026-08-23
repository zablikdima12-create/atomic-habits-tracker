"use client";

import { AppShell } from "@/components/AppShell";
import { AddHabitForm } from "@/components/AddHabitForm";
import { HabitListItem } from "@/components/HabitListItem";
import { useHabitsContext } from "@/context/HabitsContext";

export default function HabitsPage() {
  const { habits, isLoaded, addHabit, deleteHabit } = useHabitsContext();

  if (!isLoaded) {
    return (
      <AppShell>
        <div className="flex flex-1 items-center justify-center py-20">
          <p className="text-zinc-500">Загрузка...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">Мои привычки</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Управляй списком и создавай новые
        </p>
      </header>

      <div className="mb-6">
        <AddHabitForm onAdd={addHabit} />
      </div>

      {habits.length > 0 && (
        <section className="space-y-3">
          {habits.map((habit) => (
            <HabitListItem
              key={habit.id}
              habit={habit}
              onDelete={() => deleteHabit(habit.id)}
            />
          ))}
        </section>
      )}
    </AppShell>
  );
}
