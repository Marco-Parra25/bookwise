import { useState, useEffect } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import CharacterCreation from "./components/CharacterCreation";
import CharacterProfile from "./components/CharacterProfile";
import ProfileForm from "./components/ProfileForm";
import BookSearch from "./components/BookSearch";
import ThemeToggle from "./components/ThemeToggle";
import { useTheme } from "./hooks/useTheme";
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

export default function App() {
  // Inicializar tema
  useTheme();

  const [character, setCharacter] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCharacterCreation, setShowCharacterCreation] = useState(false);
  const [profile, setProfile] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Cargar datos al iniciar
  useEffect(() => {
    const savedCharacter = loadCharacter();
    const savedProfile = loadProfile();

    if (savedCharacter) {
      setCharacter(savedCharacter);
      if (savedProfile) {
        setProfile(savedProfile);
        // Cargar recomendaciones si ya hay perfil
        handleProfile(savedProfile, false);
      }
    } else {
      // Si no hay personaje, mostrar bienvenida
      setShowWelcome(true);
    }
  }, []);

  function handleWelcomeComplete() {
    setShowWelcome(false);
    setShowCharacterCreation(true);
  }

  function handleCharacterCreated(newCharacter) {
    saveCharacter(newCharacter);
    setCharacter(newCharacter);
    setShowCharacterCreation(false);
  }

  async function handleProfile(profileData, shouldSave = true) {
    if (shouldSave) {
      saveProfile(profileData);
    }
    setProfile(profileData);
    setLoading(true);
    setErrorMsg("");
    setRecs([]);

    try {
      const data = await fetchRecommendations(profileData);
      setRecs(data.recommendations ?? []);

      // Otorgar XP por generar recomendaciones (solo primera vez del día)
      if (data.xpGained && shouldSave) {
        const xpAdded = addXPForRecommendations(data.xpGained);
        if (xpAdded) {
          // Recargar personaje actualizado
          const updatedCharacter = loadCharacter();
          setCharacter(updatedCharacter);

          // Mostrar notificación
          setTimeout(() => {
            alert(`✨ ¡Ganaste ${data.xpGained} XP por generar recomendaciones! 🎉`);
          }, 500);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  function handleBookRead(book) {
    const success = addBookRead(book.id, book);
    if (success) {
      // Recargar personaje actualizado
      const updatedCharacter = loadCharacter();
      setCharacter(updatedCharacter);

      // Mostrar notificación de éxito
      alert(`¡Felicidades! Has ganado XP por leer "${book.title}" 🎉`);
    } else {
      alert("Este libro ya fue marcado como leído.");
    }
  }

  function handleEditCharacter() {
    setShowCharacterCreation(true);
  }

  function handleCharacterUpdated(updatedCharacter) {
    saveCharacter(updatedCharacter);
    setCharacter(updatedCharacter);
    setShowCharacterCreation(false);
  }

  function handleCancelEdit() {
    setShowCharacterCreation(false);
  }

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'search'

  // Pantalla de bienvenida
  if (showWelcome) {
    return <WelcomeScreen onStart={handleWelcomeComplete} />;
  }

  // Creación de personaje
  if (showCharacterCreation) {
    return (
      <CharacterCreation
        onComplete={character ? handleCharacterUpdated : handleCharacterCreated}
        initialCharacter={character}
        onCancel={character ? handleCancelEdit : null}
      />
    );
  }

  // Si no hay personaje, mostrar bienvenida (fallback)
  if (!character) {
    return <WelcomeScreen onStart={handleWelcomeComplete} />;
  }

  // Vista principal con personaje
  return (
    <div className="min-h-screen relative p-6 transition-colors">
      {/* Fondo épico sutil */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
            opacity: '0.4',
          }}
        ></div>
        <div className="absolute inset-0 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-sm"></div>
      </div>

      <ThemeToggle />
      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        {/* Navigation Tabs */}
        {profile && (
          <div className="flex justify-center mb-6">
            <div className="bg-white dark:bg-gray-800 p-1 rounded-xl border dark:border-gray-700 shadow-sm inline-flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile'
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
              >
                Mi Perfil & Recomendaciones
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'search'
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
              >
                Explorar Catálogo 🔍
              </button>
            </div>
          </div>
        )}

        {/* View: Search */}
        {profile && activeTab === 'search' && (
          <BookSearch onBookRead={handleBookRead} />
        )}

        {/* View: Profile (Default) */}
        {activeTab === 'profile' && (
          <>
            {/* Perfil del personaje */}
            <CharacterProfile character={character} onEdit={handleEditCharacter} />

            {/* Formulario de perfil (si no hay perfil guardado) */}
            {!profile && (
              <div className="flex justify-center">
                <ProfileForm
                  onSubmitProfile={handleProfile}
                  initialProfile={loadProfile()}
                />
              </div>
            )}
          </>
        )}

        {/* Recomendaciones */}
        {profile && activeTab === 'profile' && (
          <div className="rounded-2xl border dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Recomendaciones para ti
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Libros personalizados según tus gustos
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setProfile(null)}
                  className="text-sm px-4 py-2 rounded-lg border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  ⚙️ Editar Gustos
                </button>
                {recs.length > 0 && (
                  <button
                    onClick={() => handleProfile(profile, false)}
                    className="text-sm px-4 py-2 rounded-lg border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    🔄 Actualizar
                  </button>
                )}
              </div>
            </div>

            {loading && (
              <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">Generando...</div>
            )}

            {errorMsg && (
              <div className="mt-4 text-sm text-red-600 dark:text-red-400">{errorMsg}</div>
            )}

            {!loading && !errorMsg && recs.length === 0 && (
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Completa el formulario y presiona "Generar recomendaciones".
              </div>
            )}

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {recs.map((b) => {
                const booksRead = getBooksRead();
                const isRead = booksRead.includes(b.id);

                return (
                  <div
                    key={b.id}
                    className={`rounded-xl border dark:border-gray-700 p-4 bg-white dark:bg-gray-800 transition-all ${isRead ? "opacity-75 bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700" : ""
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {b.title}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{b.author}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs px-2 py-1 rounded-full border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          Score: {b.score}
                        </span>
                        {isRead && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 font-medium">
                            ✓ Leído
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">{b.why}</div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {(b.tags ?? []).slice(0, 6).map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {b.pages ? `${b.pages} págs` : ""}{" "}
                        {b.difficulty ? `• Dificultad ${b.difficulty}/5` : ""}
                      </div>
                      {!isRead && (
                        <button
                          onClick={() => handleBookRead(b)}
                          className="text-xs px-3 py-1 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
                        >
                          Marcar como leído ✓
                        </button>
                      )}
                    </div>

                    {/* Sección de Bibliotecas */}
                    {b.libraries && b.libraries.length > 0 && (
                      <div className="mt-4 pt-3 border-t dark:border-gray-700">
                        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                          <span>📚</span>
                          <span>Dónde encontrarlo:</span>
                        </div>
                        <div className="space-y-2">
                          {b.libraries.slice(0, 2).map((lib, idx) => {
                            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lib.address || lib.name)}`;
                            
                            return (
                              <div
                                key={idx}
                                className={`text-xs p-2 rounded-lg border ${lib.available
                                  ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                                  : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-60"
                                  }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                      {lib.name}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-400 mt-0.5">
                                      {lib.address}
                                    </div>
                                    {lib.distance && (
                                      <div className="text-gray-500 dark:text-gray-500 text-[10px] mt-0.5">
                                        📍 {lib.distance}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-shrink-0 flex items-center gap-1.5">
                                    {lib.available ? (
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 font-medium">
                                        Disponible
                                      </span>
                                    ) : (
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 font-medium">
                                        No disponible
                                      </span>
                                    )}
                                    <a
                                      href={mapsUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center gap-1"
                                      title="Abrir en Google Maps"
                                    >
                                      🗺️ Mapa
                                    </a>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {b.libraries.length > 2 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                              +{b.libraries.length - 2} biblioteca(s) más
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
