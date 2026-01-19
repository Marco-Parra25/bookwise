export default function CharacterProfile({ character, onEdit }) {
  if (!character) return null;

  const xpPercentage = (character.xp / character.xpToNextLevel) * 100;

  const badges = [
    { id: "first-book", name: "Primer Libro", emoji: "📖", unlocked: character.booksRead >= 1 },
    { id: "five-books", name: "Lector Novato", emoji: "⭐", unlocked: character.booksRead >= 5 },
    { id: "ten-books", name: "Lector Avanzado", emoji: "🏆", unlocked: character.booksRead >= 10 },
    { id: "level-5", name: "Experto", emoji: "👑", unlocked: character.level >= 5 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm p-6 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{character.avatar}</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{character.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Nivel {character.level}</p>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-sm px-3 py-1 rounded-lg border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
          >
            Editar
          </button>
        )}
      </div>

      {/* XP Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Experiencia</span>
          <span className="text-gray-600 dark:text-gray-400">
            {character.xp} / {character.xpToNextLevel} XP
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 transition-all duration-500"
            style={{ width: `${Math.min(xpPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 p-4 border border-blue-200 dark:border-blue-700">
          <div className="text-2xl mb-1">📚</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{character.booksRead}</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Libros leídos</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-4 border border-purple-200 dark:border-purple-700">
          <div className="text-2xl mb-1">🎖️</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {badges.filter((b) => b.unlocked).length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Insignias obtenidas</div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Insignias</h3>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                badge.unlocked
                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 border-yellow-300 dark:border-yellow-700"
                  : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-50"
              }`}
            >
              <span className="text-xl">{badge.emoji}</span>
              <span
                className={`text-xs font-medium ${
                  badge.unlocked ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {badge.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

