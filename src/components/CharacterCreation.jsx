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
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden animate-aurora">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0"></div>

      <ThemeToggle />
      <div className="max-w-xl w-full relative z-10">
        <div className="glass-heavy rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-10">
            <p className="rpg-label text-cyan-400 mb-2 tracking-[0.3em]">Forja de Identidad</p>
            <h1 className="text-4xl md:text-5xl font-black magic-text tracking-tighter">
              {initialCharacter ? "RECTIFICAR PERSONAJE" : "CREA TU LEYENDA"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Input */}
            <div>
              <label className="rpg-label text-[10px] text-gray-400 mb-3 block">
                Nombre de tu receptáculo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="Ingresa tu nombre..."
                maxLength={20}
                className="w-full rounded-2xl bg-black/40 border-2 border-white/5 text-white px-6 py-4 text-xl focus:outline-none focus:border-neon-500 shadow-inner transition-all placeholder:text-white/10"
                autoFocus
              />
              {error && (
                <p className="mt-3 text-[10px] font-black uppercase text-red-500 tracking-wider animate-pulse flex items-center gap-2">
                  <span>⚠️</span> {error}
                </p>
              )}
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="rpg-label text-[10px] text-gray-400 mb-4 block">
                Sintonía Espiritual (Avatar)
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.emoji}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.emoji)}
                    className={`aspect-square rounded-2xl glass transition-all transform hover:scale-110 flex flex-col items-center justify-center gap-1 group border-2 ${selectedAvatar === avatar.emoji
                      ? "border-neon-500 bg-neon-500/10 scale-110 shadow-[0_0_15px_rgba(0,242,255,0.3)]"
                      : "border-white/5 hover:border-white/20"
                      }`}
                  >
                    <div className="text-3xl group-hover:animate-bounce">{avatar.emoji}</div>
                    <div className="text-[8px] font-black text-gray-500 group-hover:text-white transition-colors uppercase tracking-widest">{avatar.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview HUD */}
            {name.trim() && (
              <div className="rounded-3xl glass p-6 border border-white/10 relative overflow-hidden group">
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl glass border border-white/10 flex items-center justify-center text-4xl shadow-xl overflow-hidden">
                    {selectedAvatar?.startsWith('http') ? (
                      <img src={selectedAvatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      selectedAvatar
                    )}
                  </div>
                  <div className="text-left">
                    <div className="rpg-label text-[10px] text-cyan-400 mb-0.5">Vista Previa de Rango</div>
                    <div className="text-2xl font-black text-white tracking-tighter uppercase">{name.trim()}</div>
                    <div className="rpg-label text-[9px] opacity-60 mt-1">
                      {initialCharacter
                        ? `Nivel ${initialCharacter.level} • ${initialCharacter.xp} XP`
                        : "NIVEL 1 • INICIADO"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-4">
              {initialCharacter && onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-5 rounded-2xl glass border border-white/5 text-gray-400 font-black uppercase tracking-widest hover:text-white hover:bg-white/5 transition text-xs"
                >
                  ABORTAR
                </button>
              )}
              <button
                type="submit"
                disabled={!name.trim()}
                className={`${initialCharacter && onCancel ? "flex-[1.5]" : "w-full"} py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-neon-500 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-xs`}
              >
                {initialCharacter ? "SINCRONIZAR NÚCLEO" : "MANIFESTAR AVATAR"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

