"use client";

import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { useNotes } from "@/hooks/useNotes";

export default function NotesPage() {
  const {
    notes,
    isLoaded,
    addNote,
    deleteNote,
  } = useNotes();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const resetForm = () => {
    setTitle("");
    setContent("");
  };

  const handleAddNote = () => {
    if (!title.trim() && !content.trim()) {
      return;
    }

    addNote({
      title: title.trim() || "Без названия",
      content: content.trim(),
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
            Заметки
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Мысли, идеи и наблюдения
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowForm((value) => !value)
          }
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-400"
        >
          {showForm ? "Отмена" : "+ Заметка"}
        </button>
      </header>

      {showForm && (
        <section className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h2 className="mb-4 font-medium text-zinc-100">
            Новая заметка
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                Заголовок
              </label>

              <input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Например: Что я понял сегодня"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-700 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                Заметка
              </label>

              <textarea
                value={content}
                onChange={(event) =>
                  setContent(event.target.value)
                }
                placeholder="Напиши свои мысли..."
                rows={6}
                className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-700 focus:border-emerald-500"
              />
            </div>

            <button
              type="button"
              onClick={handleAddNote}
              className="w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-400"
            >
              Сохранить заметку
            </button>
          </div>
        </section>
      )}

      {notes.length === 0 ? (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
          <p className="text-zinc-400">
            Пока нет заметок
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            Создай первую заметку
          </p>
        </section>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <article
              key={note.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="font-medium text-zinc-100">
                    {note.title}
                  </h2>

                  <div className="mt-1 text-[10px] text-zinc-600">
                    {new Date(
                      note.updatedAt
                    ).toLocaleDateString("ru-RU")}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    deleteNote(note.id)
                  }
                  className="shrink-0 text-xs text-zinc-600 transition-colors hover:text-red-400"
                >
                  Удалить
                </button>
              </div>

              {note.content && (
                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-zinc-400">
                  {note.content}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </AppShell>
  );
} 