import type { Habit } from "@/types/habit";

interface HabitListItemProps {
  habit: Habit;
  onDelete: () => void;
}

export function HabitListItem({ habit, onDelete }: HabitListItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <span className="text-2xl">{habit.emoji}</span>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-zinc-100">{habit.name}</p>
        <p className="text-xs text-zinc-500">
          Цель: {habit.dailyGoal} {habit.unit || "минут"}
        </p>
      </div>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Удалить привычку ${habit.name}`}
        className="rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
      >
        Удалить
      </button>
    </div>
  );
}
