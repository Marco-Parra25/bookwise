import { motion } from "framer-motion";
import AvatarDisplay from "./AvatarDisplay";

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
    <div className="glass p-8 rounded-[2.5rem] relative overflow-hidden group hover:neon-border transition-all duration-500 shadow-2xl">
      {/* Decorative Aura Background */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-magic-500/10 blur-[60px] rounded-full"></div>

      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className="flex items-center gap-6">
          <div className="relative">
            <AvatarDisplay
              avatar={character.avatar}
              equipped={character.equipped}
              size="md"
              className="group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-2">{character.name}</h2>
            <div className="flex items-center gap-2">
              <span className="bg-gold-500 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-sm">MASTER</span>
              <span className="rpg-label text-xs">Nivel {character.level}</span>
            </div>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl glass border-white/10 hover:bg-white/10 hover:scale-105 transition-all text-white"
          >
            Ajustes
          </button>
        )}
      </div>

      {/* XP Bar HUD Style */}
      <div className="mb-8 relative z-10">
        <div className="flex justify-between items-end mb-2">
          <span className="rpg-label text-[10px]">Progreso de Alma</span>
          <span className="font-mono text-xs text-neon-500">
            {character.xp} <span className="text-white/20">/</span> {character.xpToNextLevel} <span className="text-white/40 italic">XP</span>
          </span>
        </div>
        <div className="w-full bg-black/40 rounded-full h-3.5 p-0.5 border border-white/5 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-neon-500 via-indigo-500 to-magic-500 shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all duration-1000"
            style={{ width: `${Math.min(xpPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats - Grid RPG Style */}
      <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
        <div className="glass p-5 rounded-2xl border-white/5 hover:bg-white/5 transition-colors text-center">
          <div className="text-3xl mb-1 filter drop-shadow-md">📘</div>
          <div className="text-3xl font-black text-white">{character.booksRead}</div>
          <div className="rpg-label text-[9px] mt-1">Sapiencia</div>
        </div>
        <div className="glass p-5 rounded-2xl border-white/5 hover:bg-white/5 transition-colors text-center">
          <div className="text-3xl mb-1 filter drop-shadow-md">🏅</div>
          <div className="text-3xl font-black text-white">
            {badges.filter((b) => b.unlocked).length}
          </div>
          <div className="rpg-label text-[9px] mt-1">Conquistas</div>
        </div>
      </div>

      {/* Badges - Trophy Case Style */}
      <div className="relative z-10">
        <h3 className="rpg-label text-[10px] mb-4">Reliquias de Sabiduría</h3>
        <div className="flex flex-wrap gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`group/badge relative flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 ${badge.unlocked
                ? "bg-white/5 border-gold-500/30 shadow-[0_5px_15px_rgba(241,196,15,0.1)]"
                : "bg-black/20 border-white/5 grayscale opacity-30"
                }`}
            >
              <span className="text-2xl transform transition-transform group-hover/badge:scale-125 duration-300">{badge.emoji}</span>
              {/* Tooltip Hidden Logic would go here */}
              <div className="mt-2 rpg-label text-[8px] tracking-normal">{badge.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

