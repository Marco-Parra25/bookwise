import { useMemo, useState } from "react";

const DEFAULT_SUGGESTED_TAGS = [
  "misterio",
  "suspenso",
  "fantasía",
  "ciencia ficción",
  "romance",
  "terror",
  "historia",
  "autoayuda",
  "psicología",
  "negocios",
  "biografías",
  "aventura",
];

function normalizeTag(tag) {
  return tag.trim().toLowerCase();
}

export default function ProfileForm({
  onSubmitProfile,
  suggestedTags = DEFAULT_SUGGESTED_TAGS,
  initialProfile,
}) {
  const [age, setAge] = useState(initialProfile?.age ?? 20);
  const [minutesPerDay, setMinutesPerDay] = useState(
    initialProfile?.minutesPerDay ?? 20
  );
  const [goal, setGoal] = useState(initialProfile?.goal ?? "entretener");
  const [prefersShort, setPrefersShort] = useState(
    initialProfile?.prefersShort ?? true
  );
  const [difficultyMax, setDifficultyMax] = useState(
    initialProfile?.difficultyMax ?? 3
  );

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(initialProfile?.tags ?? ["misterio"]);

  const tagsSet = useMemo(() => new Set(tags.map(normalizeTag)), [tags]);

  function addTag(raw) {
    const t = normalizeTag(raw);
    if (!t) return;
    if (t.length > 25) return; // evita tags gigantes
    if (tagsSet.has(t)) return;
    setTags((prev) => [...prev, t]);
  }

  function removeTag(tagToRemove) {
    const t = normalizeTag(tagToRemove);
    setTags((prev) => prev.filter((x) => normalizeTag(x) !== t));
  }

  function onTagKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
      setTagInput("");
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      // borra el último tag si el input está vacío
      removeTag(tags[tags.length - 1]);
    }
  }

  function addManyFromInput(raw) {
    raw
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .forEach(addTag);
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Validaciones mínimas
    const safeAge = Number(age);
    const safeMinutes = Number(minutesPerDay);
    const safeDifficulty = Number(difficultyMax);

    if (!Number.isFinite(safeAge) || safeAge < 8 || safeAge > 90) {
      alert("Edad inválida (8 a 90).");
      return;
    }
    if (!Number.isFinite(safeMinutes) || safeMinutes < 5 || safeMinutes > 240) {
      alert("Minutos por día inválidos (5 a 240).");
      return;
    }
    if (
      !Number.isFinite(safeDifficulty) ||
      safeDifficulty < 1 ||
      safeDifficulty > 5
    ) {
      alert("Dificultad máx inválida (1 a 5).");
      return;
    }
    if (tags.length === 0) {
      alert("Agrega al menos 1 gusto (tag).");
      return;
    }

    const profile = {
      age: safeAge,
      minutesPerDay: safeMinutes,
      goal,
      prefersShort,
      difficultyMax: safeDifficulty,
      tags: tags.map(normalizeTag),
    };

    onSubmitProfile?.(profile);
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="rounded-3xl bg-white shadow-xl border border-gray-100 overflow-hidden">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">📝</span>
            <h2 className="text-2xl md:text-3xl font-bold">
              Crea tu Perfil Lector
            </h2>
          </div>
          <p className="text-indigo-100 text-sm md:text-base">
            Cuéntanos sobre ti y te recomendaremos los mejores libros para tu aventura
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 bg-gradient-to-b from-white to-gray-50">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="🎂 Edad" icon="🎂">
              <input
                type="number"
                min={8}
                max={90}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 bg-white transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 hover:border-gray-300"
                placeholder="Ej: 21"
              />
            </Field>

            <Field label="⏱️ Minutos de lectura por día" icon="⏱️">
              <input
                type="number"
                min={5}
                max={240}
                value={minutesPerDay}
                onChange={(e) => setMinutesPerDay(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 bg-white transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 hover:border-gray-300"
                placeholder="Ej: 20"
              />
            </Field>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="🎯 Objetivo" icon="🎯">
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 bg-white transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 hover:border-gray-300 cursor-pointer"
              >
                <option value="entretener">🎮 Entretenerme</option>
                <option value="aprender">📚 Aprender</option>
                <option value="habito">🔄 Crear hábito</option>
                <option value="productividad">⚡ Productividad</option>
                <option value="emocional">💚 Bienestar emocional</option>
              </select>
            </Field>

            <Field label="📊 Dificultad máxima" icon="📊">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-medium mb-3">
                  <span className="text-green-600">🟢 Fácil</span>
                  <span className="font-bold text-indigo-600 text-xl bg-indigo-50 px-4 py-1 rounded-full">
                    {difficultyMax}
                  </span>
                  <span className="text-red-600">🔴 Difícil</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 h-3 bg-gradient-to-r from-green-300 via-yellow-300 to-red-300 rounded-full"></div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={difficultyMax}
                    onChange={(e) => setDifficultyMax(e.target.value)}
                    className="relative w-full h-3 bg-transparent appearance-none cursor-pointer slider"
                    style={{
                      background: 'transparent'
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 font-medium">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>
              <style>{`
                .slider::-webkit-slider-thumb {
                  appearance: none;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: linear-gradient(135deg, #6366f1, #8b5cf6);
                  cursor: pointer;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  border: 2px solid white;
                }
                .slider::-moz-range-thumb {
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: linear-gradient(135deg, #6366f1, #8b5cf6);
                  cursor: pointer;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  border: 2px solid white;
                }
              `}</style>
            </Field>
          </div>

          {/* Preferences */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-100 p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📏</span>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Preferencia de longitud
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Si activas "cortos", prioriza libros con menos páginas.
                </div>
              </div>
            </div>

            <label className="inline-flex items-center gap-3 select-none cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={prefersShort}
                  onChange={(e) => setPrefersShort(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-14 h-7 rounded-full transition-all duration-300 ${
                  prefersShort ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-300'
                }`}>
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 mt-0.5 ${
                    prefersShort ? 'translate-x-7' : 'translate-x-0.5'
                  }`}></div>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-800 group-hover:text-indigo-600 transition">
                Prefiero libros cortos
              </span>
            </label>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-end justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏷️</span>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    Gustos (tags)
                  </div>
                  <div className="text-xs text-gray-600">
                    Escribe un gusto y presiona <b>Enter</b> o <b>,</b> para agregar.
                  </div>
                </div>
              </div>

              {tags.length > 0 && (
                <button
                  type="button"
                  onClick={() => setTags([])}
                  className="text-xs px-3 py-2 rounded-lg border-2 border-red-200 text-red-600 bg-red-50 hover:bg-red-100 font-medium transition"
                >
                  Limpiar todo
                </button>
              )}
            </div>

            <div className="rounded-2xl border-2 border-gray-200 bg-white p-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 transition">
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg transition"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="opacity-90 hover:opacity-100 hover:scale-110 transition-transform"
                      aria-label={`Eliminar ${t}`}
                      title="Eliminar"
                    >
                      ✕
                    </button>
                  </span>
                ))}

                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={onTagKeyDown}
                  onBlur={() => {
                    if (tagInput.trim()) {
                      addManyFromInput(tagInput);
                      setTagInput("");
                    }
                  }}
                  className="min-w-[180px] flex-1 px-3 py-2 text-sm outline-none bg-transparent placeholder-gray-400"
                  placeholder="Escribe tus gustos aquí..."
                />
              </div>
            </div>

            {/* suggested */}
            <div className="mt-4">
              <div className="text-xs font-medium text-gray-700 mb-3 flex items-center gap-2">
                <span>💡</span>
                <span>Sugerencias rápidas:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((t) => {
                  const active = tagsSet.has(normalizeTag(t));
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => (active ? removeTag(t) : addTag(t))}
                      className={[
                        "text-xs px-4 py-2 rounded-full border-2 font-medium transition-all transform hover:scale-105",
                        active
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-md"
                          : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50",
                      ].join(" ")}
                      title={active ? "Quitar" : "Agregar"}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t-2 border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-lg">💡</span>
                <span>Tip: mientras más tags, mejores recomendaciones.</span>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-4 text-base font-semibold hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100"
              >
                <span>✨</span>
                <span>Generar Recomendaciones</span>
                <span>🚀</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children, icon }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        {label}
      </label>
      <div>{children}</div>
    </div>
  );
}
