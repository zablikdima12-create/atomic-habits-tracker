interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
      <span className="text-2xl">🔥</span>
      <div>
        <p className="text-xs text-zinc-500">Серия дней</p>
        <p className="text-lg font-bold text-zinc-100">
          {streak}{" "}
          <span className="text-sm font-normal text-zinc-400">
            {getStreakLabel(streak)}
          </span>
        </p>
      </div>
    </div>
  );
}

function getStreakLabel(streak: number): string {
  const mod10 = streak % 10;
  const mod100 = streak % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return "дня";
  return "дней";
}
