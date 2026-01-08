import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

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
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      {/* Imagen de fondo épica */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
          }}
        >
          {/* Overlay con gradiente para mejor legibilidad - más transparente */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/60 via-purple-600/60 to-pink-600/60 dark:from-indigo-900/70 dark:via-purple-900/70 dark:to-pink-900/70"></div>
          {/* Efecto de brillo sutil */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
        </div>
      </div>
      
      <ThemeToggle />
      <div className="max-w-xl w-full relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 transition-colors">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">✨</div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {initialCharacter ? "Edita tu Personaje" : "Crea tu Personaje Lector"}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {initialCharacter
                ? "Modifica tu nombre y avatar"
                : "Elige un nombre y un avatar para comenzar tu aventura"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
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
                className="w-full rounded-xl border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 py-3 text-lg focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-colors"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
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
                        ? "border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900 scale-110"
                        : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500"
                    }`}
                  >
                    <div className="text-4xl">{avatar.emoji}</div>
                    <div className="text-xs mt-1 text-gray-600 dark:text-gray-300">{avatar.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {name.trim() && (
              <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 p-6 border-2 border-indigo-200 dark:border-indigo-700">
                <div className="text-center">
                  <div className="text-6xl mb-2">{selectedAvatar}</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{name.trim()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
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
                  className="flex-1 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
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

