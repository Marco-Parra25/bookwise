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
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{character.avatar}</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{character.name}</h2>
            <p className="text-sm text-gray-600">Nivel {character.level}</p>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-sm px-3 py-1 rounded-lg border hover:bg-gray-50 text-gray-700"
          >
            Editar
          </button>
        )}
      </div>

      {/* XP Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-700 font-medium">Experiencia</span>
          <span className="text-gray-600">
            {character.xp} / {character.xpToNextLevel} XP
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${Math.min(xpPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4 border border-blue-200">
          <div className="text-2xl mb-1">📚</div>
          <div className="text-2xl font-bold text-gray-900">{character.booksRead}</div>
          <div className="text-xs text-gray-600">Libros leídos</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-4 border border-purple-200">
          <div className="text-2xl mb-1">🎖️</div>
          <div className="text-2xl font-bold text-gray-900">
            {badges.filter((b) => b.unlocked).length}
          </div>
          <div className="text-xs text-gray-600">Badges obtenidos</div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Badges</h3>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                badge.unlocked
                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300"
                  : "bg-gray-50 border-gray-200 opacity-50"
              }`}
            >
              <span className="text-xl">{badge.emoji}</span>
              <span
                className={`text-xs font-medium ${
                  badge.unlocked ? "text-gray-900" : "text-gray-400"
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

