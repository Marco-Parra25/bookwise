import { useState, useEffect } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import CharacterCreation from "./components/CharacterCreation";
import CharacterProfile from "./components/CharacterProfile";
import ProfileForm from "./components/ProfileForm";
import { fetchRecommendations } from "./services/api";
import {
  loadCharacter,
  saveCharacter,
  loadProfile,
  saveProfile,
  addBookRead,
  getBooksRead,
} from "./utils/storage";

export default function App() {
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Perfil del personaje */}
        <CharacterProfile character={character} onEdit={handleEditCharacter} />

        {/* Formulario de perfil (si no hay perfil guardado) */}
        {!profile && (
          <ProfileForm
            onSubmitProfile={handleProfile}
            initialProfile={loadProfile()}
          />
        )}

        {/* Recomendaciones */}
        {profile && (
          <div className="rounded-2xl border bg-white shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Recomendaciones para ti
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Libros personalizados según tus gustos
                </p>
              </div>
              {recs.length > 0 && (
                <button
                  onClick={() => handleProfile(profile, false)}
                  className="text-sm px-4 py-2 rounded-lg border hover:bg-gray-50"
                >
                  Actualizar
                </button>
              )}
            </div>

            {loading && (
              <div className="mt-4 text-sm text-gray-700">Generando...</div>
            )}

            {errorMsg && (
              <div className="mt-4 text-sm text-red-600">{errorMsg}</div>
            )}

            {!loading && !errorMsg && recs.length === 0 && (
              <div className="mt-4 text-sm text-gray-600">
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
                    className={`rounded-xl border p-4 bg-white transition-all ${
                      isRead ? "opacity-75 bg-green-50 border-green-200" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {b.title}
                        </div>
                        <div className="text-sm text-gray-600">{b.author}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs px-2 py-1 rounded-full border bg-gray-50">
                          Score: {b.score}
                        </span>
                        {isRead && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                            ✓ Leído
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-700">{b.why}</div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {(b.tags ?? []).slice(0, 6).map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xs text-gray-600">
                        {b.pages ? `${b.pages} págs` : ""}{" "}
                        {b.difficulty ? `• Dificultad ${b.difficulty}/5` : ""}
                      </div>
                      {!isRead && (
                        <button
                          onClick={() => handleBookRead(b)}
                          className="text-xs px-3 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        >
                          Marcar como leído ✓
                        </button>
                      )}
                    </div>
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
