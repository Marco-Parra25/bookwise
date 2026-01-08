import { useState } from "react";

const AVATARS = [
  { emoji: "🧙", name: "Mago" },
  { emoji: "🦸", name: "Superhéroe" },
  { emoji: "👨‍🚀", name: "Astronauta" },
  { emoji: "🧛", name: "Vampiro" },
  { emoji: "🧚", name: "Hada" },
  { emoji: "🦁", name: "León" },
  { emoji: "🐉", name: "Dragón" },
  { emoji: "🦄", name: "Unicornio" },
  { emoji: "🐺", name: "Lobo" },
  { emoji: "🦅", name: "Águila" },
  { emoji: "🐱", name: "Gato" },
  { emoji: "🦊", name: "Zorro" },
];

export default function CharacterCreation({ onComplete, initialCharacter, onCancel }) {
  const [name, setName] = useState(initialCharacter?.name || "");
  const [selectedAvatar, setSelectedAvatar] = useState(
    initialCharacter?.avatar || AVATARS[0].emoji
  );
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("¡Necesitas un nombre para tu personaje!");
      return;
    }

    if (name.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      return;
    }

    if (name.trim().length > 20) {
      setError("El nombre es demasiado largo (máximo 20 caracteres)");
      return;
    }

    const character = initialCharacter
      ? {
          ...initialCharacter,
          name: name.trim(),
          avatar: selectedAvatar,
        }
      : {
          name: name.trim(),
          avatar: selectedAvatar,
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          booksRead: 0,
          badges: [],
          createdAt: new Date().toISOString(),
        };

    onComplete(character);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">✨</div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {initialCharacter ? "Edita tu Personaje" : "Crea tu Personaje Lector"}
            </h1>
            <p className="text-gray-600">
              {initialCharacter
                ? "Modifica tu nombre y avatar"
                : "Elige un nombre y un avatar para comenzar tu aventura"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nombre de tu personaje
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="Ej: Alex, Luna, Max..."
                maxLength={20}
                className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                Elige tu avatar
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.emoji}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.emoji)}
                    className={`aspect-square rounded-xl border-4 transition-all transform hover:scale-110 ${
                      selectedAvatar === avatar.emoji
                        ? "border-indigo-600 bg-indigo-50 scale-110"
                        : "border-gray-200 bg-white hover:border-indigo-300"
                    }`}
                  >
                    <div className="text-4xl">{avatar.emoji}</div>
                    <div className="text-xs mt-1 text-gray-600">{avatar.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {name.trim() && (
              <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-2 border-indigo-200">
                <div className="text-center">
                  <div className="text-6xl mb-2">{selectedAvatar}</div>
                  <div className="text-xl font-bold text-gray-900">{name.trim()}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {initialCharacter
                      ? `Nivel ${initialCharacter.level} • ${initialCharacter.xp} XP`
                      : "Nivel 1 • 0 XP"}
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-3">
              {initialCharacter && onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold text-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={!name.trim()}
                className={`${initialCharacter && onCancel ? "flex-1" : "w-full"} py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {initialCharacter ? "Guardar Cambios 💾" : "Crear Personaje 🎮"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

