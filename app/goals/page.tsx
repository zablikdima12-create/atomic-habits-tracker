"use client";

import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { useGoals } from "@/hooks/useGoals";
import type { HabitCategory } from "@/types/habit";

const categories: {
  key: HabitCategory;
  name: string;
}[] = [
  {
    key: "mind",
    name: "Разум",
  },
  {
    key: "fitness",
    name: "Физическая форма",
  },
  {
    key: "money",
    name: "Деньги",
  },
];

export default function GoalsPage() {
  const {
    goals,
    isLoaded,
    addGoal,
    deleteGoal,
    updateGoalProgress,
    toggleGoalCompleted,
  } = useGoals();

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] =
    useState<HabitCategory>("mind");
  const [target, setTarget] = useState("");
  const [unit, setUnit] = useState("");
  const [deadline, setDeadline] = useState("");

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("mind");
    setTarget("");
    setUnit("");
    setDeadline("");
  };

  const handleAddGoal = () => {
    const targetValue = Number(target);

    if (!name.trim()) {
      return;
    }

    if (!targetValue || targetValue <= 0) {
      return;
    }

    addGoal({
      name: name.trim(),
      description: description.trim(),
      category,
      target: targetValue,
      current: 0,
      unit: unit.trim(),
      deadline,
    });

    resetForm();
    setShowForm(false);
  };

  if (!isLoaded) {
    return (
      <AppShell>
        <div className="flex justify-center py-20">
          <p className="text-zinc-500">
            Загрузка...
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">
            Цели
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Большие результаты через маленькие шаги
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-400"
        >
          {showForm ? "Отмена" : "+ Цель"}
        </button>
      </header>

      {showForm && (
        <section className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h2 className="mb-4 font-medium text-zinc-100">
            Новая цель
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                Название
              </label>

              <input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Например: Отжаться 30 раз"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-700 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                Описание
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Что именно хочешь достичь?"
                rows={3}
                className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-700 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                Категория
              </label>

              <div className="grid grid-cols-3 gap-2">
                {categories.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      setCategory(item.key)
                    }
                    className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
                      category === item.key
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-zinc-500">
                  Цель
                </label>

                <input
                  type="number"
                  min="1"
                  value={target}
                  onChange={(event) =>
                    setTarget(event.target.value)
                  }
                  placeholder="30"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-700 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-zinc-500">
                  Единица
                </label>

                <input
                  value={unit}
                  onChange={(event) =>
                    setUnit(event.target.value)
                  }
                  placeholder="раз, ₽, часов"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-700 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                Дедлайн
              </label>

              <input
                type="date"
                value={deadline}
                onChange={(event) =>
                  setDeadline(event.target.value)
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="button"
              onClick={handleAddGoal}
              className="w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-400"
            >
              Создать цель
            </button>
          </div>
        </section>
      )}

      {goals.length === 0 ? (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
          <p className="text-zinc-400">
            Пока нет целей
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            Создай первую цель и начни двигаться к ней
          </p>
        </section>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => {
            const progress =
              goal.target > 0
                ? Math.round(
                    (goal.current / goal.target) *
                      100
                  )
                : 0;

            const categoryName =
              categories.find(
                (item) =>
                  item.key === goal.category
              )?.name ?? "";

            return (
              <section
                key={goal.id}
                className={`rounded-2xl border p-4 ${
                  goal.completed
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-zinc-800 bg-zinc-900/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2
                          className={`font-medium ${
                            goal.completed
                              ? "text-emerald-300 line-through"
                              : "text-zinc-100"
                          }`}
                        >
                          {goal.name}
                        </h2>

                        <p className="mt-1 text-xs text-zinc-600">
                          {categoryName}
                        </p>
                      </div>

                      <span className="shrink-0 text-lg font-semibold text-emerald-400">
                        {progress}%
                      </span>
                    </div>

                    {goal.description && (
                      <p className="mt-3 text-sm text-zinc-400">
                        {goal.description}
                      </p>
                    )}

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-zinc-500">
                        {goal.current} / {goal.target}{" "}
                        {goal.unit}
                      </span>

                      {goal.deadline && (
                        <span className="text-zinc-600">
                          до{" "}
                          {new Date(
                            `${goal.deadline}T12:00:00`
                          ).toLocaleDateString(
                            "ru-RU"
                          )}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2">
                      {!goal.completed && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              updateGoalProgress(
                                goal.id,
                                goal.current + 1
                              )
                            }
                            className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-300 transition-colors hover:border-emerald-500/50 hover:text-emerald-400"
                          >
                            +1
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              toggleGoalCompleted(
                                goal.id
                              )
                            }
                            className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-400"
                          >
                            Выполнить
                          </button>
                        </>
                      )}

                      {goal.completed && (
                        <button
                          type="button"
                          onClick={() =>
                            toggleGoalCompleted(
                              goal.id
                            )
                          }
                          className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-400 transition-colors hover:text-zinc-200"
                        >
                          Вернуть в процесс
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          deleteGoal(goal.id)
                        }
                        className="ml-auto rounded-xl px-3 py-2 text-xs text-zinc-600 transition-colors hover:text-red-400"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}