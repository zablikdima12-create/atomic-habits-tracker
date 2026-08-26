"use client";

import { useState } from "react";

import type { HabitCategory } from "@/types/habit";

interface AddHabitFormProps {
  onAdd: (habit: {
    name: string;
    emoji: string;
    dailyGoal: number;
    unit: string;
    category: HabitCategory;
    points: number;
  }) => void;
}

const units = [
  "минут",
  "часов",
  "страниц",
  "повторений",
  "раз",
  "литров",
  "километров",
  "шагов",
  "слов",
  "задач",
];

export function AddHabitForm({ onAdd }: AddHabitFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("✨");
  const [dailyGoal, setDailyGoal] = useState("20");
  const [unit, setUnit] = useState("минут");
  const [category, setCategory] = useState<HabitCategory>("mind");
  const [points, setPoints] = useState("1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) return;

    const goal = parseInt(dailyGoal, 10);
    const parsedPoints = parseInt(points, 10);

    if (
      isNaN(goal) ||
      goal <= 0 ||
      isNaN(parsedPoints) ||
      parsedPoints <= 0
    ) {
      return;
    }

    onAdd({
      name: trimmedName,
      emoji: emoji.trim() || "✨",
      dailyGoal: goal,
      unit,
      category,
      points: parsedPoints,
    });

    setName("");
    setEmoji("✨");
    setDailyGoal("20");
    setUnit("минут");
    setCategory("mind");
    setPoints("1");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full rounded-2xl border border-dashed border-zinc-700 py-4 text-sm font-medium text-zinc-400 transition-colors hover:border-emerald-500/50 hover:text-emerald-400"
      >
        + Добавить привычку
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4"
    >
      <h3 className="font-medium text-zinc-100">
        Новая привычка
      </h3>

      <div className="grid grid-cols-[4rem_1fr] gap-3">
        <div>
          <label
            htmlFor="emoji"
            className="mb-1 block text-xs text-zinc-500"
          >
            Эмодзи
          </label>

          <input
            id="emoji"
            type="text"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            maxLength={4}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-2 py-2 text-center text-xl text-zinc-100 outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-xs text-zinc-500"
          >
            Название
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Читать книгу"
            required
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="dailyGoal"
            className="mb-1 block text-xs text-zinc-500"
          >
            Дневная цель
          </label>

          <input
            id="dailyGoal"
            type="number"
            min={1}
            value={dailyGoal}
            onChange={(e) => setDailyGoal(e.target.value)}
            required
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label
            htmlFor="unit"
            className="mb-1 block text-xs text-zinc-500"
          >
            Единица измерения
          </label>

          <select
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 outline-none focus:border-emerald-500"
          >
            {units.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="category"
          className="mb-1 block text-xs text-zinc-500"
        >
          Направление развития
        </label>

        <select
          id="category"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as HabitCategory)
          }
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 outline-none focus:border-emerald-500"
        >
          <option value="mind">Разум</option>
          <option value="fitness">Физическая форма</option>
          <option value="money">Деньги</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="points"
          className="mb-1 block text-xs text-zinc-500"
        >
          Очки за выполнение
        </label>

        <select
          id="points"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 outline-none focus:border-emerald-500"
        >
          <option value="1">
            1 очко — маленькая привычка
          </option>
          <option value="2">
            2 очка — средняя привычка
          </option>
          <option value="3">
            3 очка — большая привычка
          </option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-400"
        >
          Сохранить
        </button>

        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm text-zinc-400 transition-colors hover:text-zinc-200"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
