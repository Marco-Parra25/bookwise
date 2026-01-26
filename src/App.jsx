import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import DynamicAtmosphere from "./components/DynamicAtmosphere";
import MotionCard from "./components/MotionCard";
import WelcomeScreen from "./components/WelcomeScreen";
import CharacterCreation from "./components/CharacterCreation";
import CharacterProfile from "./components/CharacterProfile";
import ProfileForm from "./components/ProfileForm";
import BookSearch from "./components/BookSearch";
import ThemeToggle from "./components/ThemeToggle";
import WorldMap from "./components/WorldMap";
import { useTheme } from "./hooks/useTheme";
import Store from "./components/Store";
import { fetchRecommendations } from "./services/api";
import {
  loadCharacter,
  saveCharacter,
  loadProfile,
  saveProfile,
  addBookRead,
  getBooksRead,
  addXPForRecommendations,
} from "./utils/storage";
import { db } from "./services/db";
import { supabase } from "./services/supabase";

export default function App() {
  const [character, setCharacter] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCharacterCreation, setShowCharacterCreation] = useState(false);
  const [profile, setProfile] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'search'
  const [readingHistory, setReadingHistory] = useState([]);
  const [user, setUser] = useState(null);

  // Cargar datos al iniciar
  useEffect(() => {
    const savedCharacter = loadCharacter();
    const savedProfile = loadProfile();

    if (savedCharacter) {
      setCharacter(savedCharacter);
      if (savedProfile) {
        setProfile(savedProfile);
        handleProfile(savedProfile, false);
      }
    } else {
      setShowWelcome(true);
    }

    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          syncWithSupabase(session.user);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
          syncWithSupabase(session.user);
        } else {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  async function syncWithSupabase(supabaseUser) {
    try {
      const dbProfile = await db.getProfile(supabaseUser.id);
      if (dbProfile) {
        const syncedCharacter = {
          name: dbProfile.character_name,
          avatar: dbProfile.avatar_url,
          level: dbProfile.level,
          xp: dbProfile.xp,
          xpToNextLevel: dbProfile.xp_to_next_level,
          booksRead: dbProfile.books_read_count
        };
        setCharacter(syncedCharacter);
        saveCharacter(syncedCharacter);
        if (dbProfile.preferences) {
          handleProfile(dbProfile.preferences, false);
        }
        // Load reading history from Supabase
        const history = await db.getReadingHistory(supabaseUser.id);
        if (history) setReadingHistory(history);

        setShowWelcome(false);
        setShowCharacterCreation(false);
      } else if (!character) {
        setShowWelcome(false);
        setShowCharacterCreation(true);
      }
    } catch (err) {
      console.error("Error syncing with Supabase:", err);
    }
  }

  const triggerApotheosis = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() * 0.5 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() * 0.5 } });
    }, 250);
  };

  const checkLevelUp = (oldChar, newChar) => {
    if (newChar.level > oldChar.level) {
      setTimeout(() => {
        triggerApotheosis();
        alert(`✨ ¡APOTEOSIS! Has ascendido al Nivel ${newChar.level} 🎉`);
      }, 500);
    }
  };

  async function handleProfile(profileData, shouldSave = true) {
    if (shouldSave) saveProfile(profileData);
    setProfile(profileData);
    setLoading(true);
    setErrorMsg("");
    setRecs([]);

    if (shouldSave && user) {
      db.upsertProfile(user.id, { preferences: profileData }).catch(console.error);
    }

    try {
      const data = await fetchRecommendations(profileData);
      setRecs(data.recommendations ?? []);

      if (data.xpGained && shouldSave) {
        const oldChar = character;
        const xpAdded = addXPForRecommendations(data.xpGained);
        if (xpAdded) {
          const updatedCharacter = loadCharacter();
          setCharacter(updatedCharacter);
          if (user) {
            db.upsertProfile(user.id, {
              xp: updatedCharacter.xp,
              level: updatedCharacter.level,
              xp_to_next_level: updatedCharacter.xpToNextLevel
            }).catch(console.error);
          }
          checkLevelUp(oldChar, updatedCharacter);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  async function handleBookRead(book) {
    const oldChar = character;
    const success = addBookRead(book.id, book);
    if (success) {
      const updatedCharacter = loadCharacter();
      setCharacter(updatedCharacter);

      // Feedback inmediato
      checkLevelUp(oldChar, updatedCharacter);
      if (updatedCharacter.level === oldChar.level) {
        alert(`¡Felicidades! Has ganado XP por leer "${book.title}" 🎉`);
      }

      // Sincronización en segundo plano
      if (user) {
        try {
          await db.addReadingHistory(user.id, book);
          await db.upsertProfile(user.id, {
            xp: updatedCharacter.xp,
            level: updatedCharacter.level,
            xp_to_next_level: updatedCharacter.xpToNextLevel,
            books_read_count: updatedCharacter.booksRead
          });
          // Update local history state
          const newHistory = await db.getReadingHistory(user.id);
          if (newHistory) setReadingHistory(newHistory);
        } catch (err) {
          console.error("Error saving book to cloud:", err);
        }
      }
    } else {
      alert("Este libro ya fue marcado como leído.");
    }
  }

  async function handleCharacterCreated(newChar) {
    saveCharacter(newChar);
    setCharacter(newChar);
    setShowCharacterCreation(false);
    if (user) {
      await db.upsertProfile(user.id, {
        character_name: newChar.name,
        avatar_url: newChar.avatar,
        level: newChar.level,
        xp: newChar.xp,
        xp_to_next_level: newChar.xpToNextLevel,
        books_read_count: newChar.booksRead
      });
    }
  }

  async function handleCharacterUpdated(newChar) {
    saveCharacter(newChar);
    setCharacter(newChar);
    setShowCharacterCreation(false);
    if (user) {
      await db.upsertProfile(user.id, {
        character_name: newChar.name,
        avatar_url: newChar.avatar,
        level: newChar.level,
        xp: newChar.xp,
        xp_to_next_level: newChar.xpToNextLevel,
        books_read_count: newChar.booksRead
      });
    }
  }

  async function handleLogout() {
    if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      localStorage.removeItem("bookwise_character");
      localStorage.removeItem("bookwise_profile");
      if (supabase) await supabase.auth.signOut();
      setCharacter(null);
      setProfile(null);
      setUser(null);
      setShowWelcome(true);
    }
  }

  if (showWelcome) return <WelcomeScreen onStart={() => { setShowWelcome(false); setShowCharacterCreation(true); }} />;
  if (showCharacterCreation) return <CharacterCreation onComplete={character ? handleCharacterUpdated : handleCharacterCreated} initialCharacter={character} onCancel={character ? () => setShowCharacterCreation(false) : null} />;
  if (!character) return <WelcomeScreen onStart={() => { setShowWelcome(false); setShowCharacterCreation(true); }} />;

  return (
    <div className="min-h-screen relative overflow-hidden animate-aurora transition-colors duration-1000 selection:bg-neon-500/30">
      <DynamicAtmosphere />

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[var(--atm-accent)] opacity-10 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[var(--atm-accent)] opacity-5 blur-[120px] animate-pulse delay-700"></div>
      </div>

      <ThemeToggle />

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 glass p-6 rounded-[2rem] border-b-4 border-white/5">
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer" onClick={() => setShowCharacterCreation(true)}>
              <div className="w-20 h-20 rounded-2xl overflow-hidden glass border-2 border-white/20 shadow-2xl transition-transform group-hover:scale-110">
                {character.avatar?.startsWith('http') ? (
                  <img src={character.avatar} alt={character.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">{character.avatar}</div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gold-500 text-black font-black px-3 py-1 rounded-lg text-xs shadow-lg ring-2 ring-white/50">
                NVL {character.level}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black tracking-tighter magic-text uppercase glitch-hover cursor-default">{character.name}</h1>
                {user && (
                  <div title="Sincronizado con Google" className="bg-green-500/10 text-green-400 border border-green-500/20 rounded-full p-1.5 animate-pulse">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-3 h-3" alt="G" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-[var(--atm-accent)] to-magic-500 transition-all duration-1000" style={{ width: `${(character.xp / character.xpToNextLevel) * 100}%` }}></div>
                </div>
                <span className="rpg-label text-[10px]">{character.xp}/{character.xpToNextLevel} XP</span>
              </div>
            </div>
          </div>

          <nav className="flex bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-inner">
            {['profile', 'search', 'store'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab
                  ? 'bg-gradient-to-r from-[var(--atm-accent)] to-indigo-500 text-black shadow-[0_0_20px_var(--atm-glow)] scale-105'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                {tab === 'profile' ? 'Dashboard' : tab === 'search' ? 'Catálogo' : 'Emporium'}
              </button>
            ))}
          </nav>
        </header>

        <main className="relative">
          <AnimatePresence mode="wait">
            {activeTab === 'search' ? (
              <motion.div key="search" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}>
                <BookSearch onBookRead={handleBookRead} />
              </motion.div>
            ) : activeTab === 'store' ? (
              <motion.div key="store" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                <Store
                  onUpdateProfile={() => setCharacter(loadCharacter())}
                  currentCoins={character.coins}
                  inventory={character.inventory}
                  equipped={character.equipped}
                />
              </motion.div>
            ) : (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {/* Upper Section: Stats & Map */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-8 space-y-8">
                    <MotionCard>
                      <WorldMap
                        level={character.level}
                        xp={character.xp}
                        xpToNextLevel={character.xpToNextLevel}
                        booksRead={character.booksRead}
                        history={readingHistory}
                        avatar={character.avatar}
                      />
                    </MotionCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <MotionCard delay={0.1}>
                        <div className="glass p-6 rounded-3xl flex items-center justify-between group hover:hud-border transition-all">
                          <div>
                            <div className="rpg-label mb-1">Libros Leídos</div>
                            <div className="text-4xl font-black text-white">{character.booksRead}</div>
                          </div>
                          <div className="text-5xl opacity-20 group-hover:opacity-100 transition-opacity">📚</div>
                        </div>
                      </MotionCard>
                      <MotionCard delay={0.2}>
                        <div className="glass p-6 rounded-3xl flex items-center justify-between group hover:hud-border transition-all">
                          <div>
                            <div className="rpg-label mb-1">Hitos Logrados</div>
                            <div className="text-4xl font-black text-white">0</div>
                          </div>
                          <div className="text-5xl opacity-20 group-hover:opacity-100 transition-opacity">🏆</div>
                        </div>
                      </MotionCard>
                    </div>
                  </div>

                  <div className="lg:col-span-4">
                    <MotionCard delay={0.3}>
                      <CharacterProfile
                        character={character}
                        onEdit={() => setShowCharacterCreation(true)}
                        isDashboardView={true}
                      />
                    </MotionCard>
                  </div>
                </div>

                {/* Profile Creation Centered & Symmetric */}
                {!profile && (
                  <div className="max-w-4xl mx-auto pt-8">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      <MotionCard className="glass rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
                        <div className="p-6 md:p-12">
                          <div className="text-center py-8 border-b border-white/5 mb-10">
                            <span className="text-6xl mb-6 block animate-float-slow">🔮</span>
                            <h3 className="text-4xl font-black text-white uppercase tracking-tighter magic-text">Crea tu destino lector</h3>
                            <p className="rpg-label text-[10px] mt-4 opacity-50 tracking-[0.3em]">REQUISITO DE MISIÓN PRINCIPAL</p>
                          </div>
                          <div className="max-w-2xl mx-auto">
                            <ProfileForm
                              onSubmitProfile={handleProfile}
                              initialProfile={loadProfile()}
                            />
                          </div>
                        </div>
                      </MotionCard>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {profile && activeTab === 'profile' && (
          <div className="glass p-8 md:p-12 rounded-[2.5rem] mt-12 relative z-10 border border-white/5">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 text-center md:text-left">
              <div>
                <p className="rpg-label text-[var(--atm-accent)] mb-1 tracking-widest">Visiones del Destino</p>
                <h3 className="text-3xl font-black magic-text">RECOMENDACIONES PARA TI</h3>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={() => setProfile(null)} className="px-5 py-2 rounded-xl glass border border-white/10 text-xs font-bold hover:hud-border transition-all uppercase tracking-widest text-gray-400 hover:text-white">⚙️ Gustos</button>
                {recs.length > 0 && <button onClick={() => handleProfile(profile, false)} className="px-5 py-2 rounded-xl glass border border-white/10 text-xs font-bold hover:hud-border transition-all uppercase tracking-widest text-gray-400 hover:text-white">🔄 Act.</button>}
                <button onClick={handleLogout} className="px-5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all uppercase tracking-widest">🚪 Salir</button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <div className="w-16 h-16 border-4 border-[var(--atm-accent)]/20 border-t-[var(--atm-accent)] rounded-full animate-spin mb-4"></div>
                <p className="rpg-label text-[var(--atm-accent)] animate-bounce">Invocando tomos sagrados...</p>
              </div>
            ) : errorMsg ? (
              <div className="glass p-6 rounded-2xl border-red-500/30 text-red-400 text-center"><p className="font-bold">⚠️ Error en la invocación</p><p className="text-sm opacity-80">{errorMsg}</p></div>
            ) : recs.length === 0 ? (
              <div className="glass p-12 rounded-3xl text-center border-dashed border-2 border-white/5"><p className="text-gray-500 uppercase tracking-widest text-sm font-bold">Define tu perfil para recibir visiones del catálogo</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recs.map((b, idx) => {
                  const isRead = getBooksRead().includes(b.id);
                  return (
                    <MotionCard key={b.id} delay={idx * 0.1} className={`group relative rounded-[2rem] glass p-1 transition-all duration-500 ${isRead ? "opacity-60 grayscale-[0.5]" : ""}`}>
                      <div className="h-full rounded-[1.9rem] p-6 flex flex-col relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--atm-accent)]/10 blur-[60px] group-hover:bg-[var(--atm-accent)]/20 transition-all"></div>
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <p className="rpg-label text-[10px] text-magic-500 mb-1">Volumen Sugerido</p>
                            <h4 className="text-xl font-black text-white leading-tight uppercase tracking-tighter group-hover:text-[var(--atm-accent)] transition-colors">{b.title}</h4>
                            <p className="text-sm text-gray-400 font-medium italic mt-1">por {b.author}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="bg-white/5 px-3 py-1 rounded-lg border border-white/10 text-[10px] font-black tracking-widest text-[var(--atm-accent)] shadow-[0_0_15px_var(--atm-glow)]">MATCH: {b.score}%</div>
                            {isRead && <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg border border-green-500/30 text-[10px] font-black tracking-widest flex items-center gap-1"><span>✓</span> CONSUMIDO</div>}
                          </div>
                        </div>
                        <div className="text-sm text-gray-300/80 leading-relaxed mb-6 line-clamp-3 group-hover:line-clamp-none transition-all duration-700">"{b.why}"</div>
                        <div className="flex flex-wrap gap-2 mb-6">{(b.tags ?? []).slice(0, 4).map((t) => <span key={t} className="text-[9px] px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-gray-400 uppercase font-black tracking-tighter group-hover:border-[var(--atm-accent)]/30 group-hover:text-white transition-all">#{t}</span>)}</div>
                        <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                          <div className="flex items-center gap-3">{b.pages && <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{b.pages} PÁGS</div>}{b.difficulty && <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-sm ${i < b.difficulty ? 'bg-amber-500 shadow-[0_0_5px_#f59e0b]' : 'bg-white/10'}`}></div>)}</div>}</div>
                          {!isRead && <button onClick={() => handleBookRead(b)} className="px-4 py-2 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[var(--atm-accent)] transition-all shadow-xl active:scale-95">Marcar Leído</button>}
                        </div>
                        {b.libraries?.length > 0 && (
                          <div className="mt-8 pt-6 border-t border-white/5">
                            <p className="rpg-label text-[9px] mb-4">LOCALIZACIÓN DE LA RELIQUIA</p>
                            <div className="space-y-3">
                              {b.libraries.slice(0, 2).map((lib, lIdx) => (
                                <div key={lIdx} className={`p-4 rounded-2xl glass border border-white/5 transition-all group/lib ${lib.available ? "hover:border-blue-500/30" : "opacity-40"}`}>
                                  <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1"><span className="font-bold text-xs text-white uppercase tracking-tight">{lib.name}</span>{lib.available ? <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> : <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}</div>
                                      <p className="text-[10px] text-gray-500 line-clamp-1">{lib.address}</p>
                                    </div>
                                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lib.address || lib.name)}`} target="_blank" rel="noopener noreferrer" className="h-10 w-10 flex items-center justify-center rounded-xl glass border border-white/10 text-lg hover:bg-blue-500 hover:text-white transition-all shadow-lg active:scale-90">🗺️</a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </MotionCard>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
