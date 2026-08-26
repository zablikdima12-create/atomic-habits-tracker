"use client";

import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { useGoals } from "@/hooks/useGoals";
import { useTasks } from "@/hooks/useTasks";

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

export default function TasksPage() {
  const { goals, isLoaded: goalsLoaded } = useGoals();

  const {
    tasks,
    isLoaded: tasksLoaded,
    addTask,
    toggleTask,
    deleteTask,
  } = useTasks();

  const [title, setTitle] = useState("");
  const [goalId, setGoalId] = useState("");
  const [category, setCategory] =
    useState<HabitCategory>("mind");

  const isLoaded = goalsLoaded && tasksLoaded;

  const handleAddTask = () => {
    if (!title.trim() || !goalId) {
      return;
    }

    addTask(title, goalId, category);

    setTitle("");
    setGoalId("");
    setCategory("mind");
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

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <AppShell>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">
          Задачи
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Конкретные действия для достижения целей
        </p>
      </header>

      {goals.length === 0 ? (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
          <p className="text-zinc-400">
            Сначала создай цель
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            Затем здесь можно будет создавать задачи
            для её выполнения
          </p>
        </section>
      ) : (
        <>
          <section className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
            <h2 className="mb-4 font-medium text-zinc-100">
              Новая задача
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-zinc-500">
                  Что нужно сделать?
                </label>

                <input
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Например: Прочитать 20 страниц"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-700 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-zinc-500">
                  Цель
                </label>

                <select
                  value={goalId}
                  onChange={(event) =>
                    setGoalId(event.target.value)
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-emerald-500"
                >
                  <option value="">
                    Выбери цель
                  </option>

                  {goals.map((goal) => (
                    <option
                      key={goal.id}
                      value={goal.id}
                    >
                      {goal.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs text-zinc-500">
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

              <button
                type="button"
                onClick={handleAddTask}
                disabled={!title.trim() || !goalId}
                className="w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Добавить задачу
              </button>
            </div>
          </section>

          <section className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-medium text-zinc-100">
                Мои задачи
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                Выполнено: {completedTasks} из{" "}
                {tasks.length}
              </p>
            </div>
          </section>

          {tasks.length === 0 ? (
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
              <p className="text-zinc-400">
                Пока нет задач
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Создай первую задачу для своей цели
              </p>
            </section>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => {
                const goal = goals.find(
                  (item) => item.id === task.goalId
                );

                const categoryName =
                  categories.find(
                    (item) =>
                      item.key === task.category
                  )?.name ?? "";

                return (
                  <article
                    key={task.id}
                    className={`rounded-2xl border p-4 transition-colors ${
                      task.completed
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-zinc-800 bg-zinc-900/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          toggleTask(task.id)
                        }
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm transition-colors ${
                          task.completed
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-zinc-700 bg-zinc-800 text-zinc-500 hover:border-emerald-500/50 hover:text-emerald-400"
                        }`}
                        aria-label={
                          task.completed
                            ? "Отменить выполнение"
                            : "Выполнить задачу"
                        }
                      >
                        {task.completed ? "✓" : ""}
                      </button>

                      <div className="min-w-0 flex-1">
                        <h3
                          className={`font-medium ${
                            task.completed
                              ? "text-zinc-500 line-through"
                              : "text-zinc-100"
                          }`}
                        >
                          {task.title}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-zinc-600">
                          {goal && (
                            <span>
                              Цель: {goal.name}
                            </span>
                          )}

                          <span>·</span>

                          <span>
                            {categoryName}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          deleteTask(task.id)
                        }
                        className="shrink-0 text-xs text-zinc-600 transition-colors hover:text-red-400"
                      >
                        Удалить
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}