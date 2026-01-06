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
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Crea tu perfil lector
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Completa estos datos y te armamos recomendaciones + un plan anual.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Edad">
              <input
                type="number"
                min={8}
                max={90}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                placeholder="Ej: 21"
              />
            </Field>

            <Field label="Minutos de lectura por día">
              <input
                type="number"
                min={5}
                max={240}
                value={minutesPerDay}
                onChange={(e) => setMinutesPerDay(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                placeholder="Ej: 20"
              />
            </Field>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Objetivo">
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 bg-white"
              >
                <option value="entretener">Entretenerme</option>
                <option value="aprender">Aprender</option>
                <option value="habito">Crear hábito</option>
                <option value="productividad">Productividad</option>
                <option value="emocional">Bienestar emocional</option>
              </select>
            </Field>

            <Field label="Dificultad máxima (1 fácil – 5 difícil)">
              <input
                type="range"
                min={1}
                max={5}
                value={difficultyMax}
                onChange={(e) => setDifficultyMax(e.target.value)}
                className="w-full"
              />
              <div className="mt-1 text-xs text-gray-600">
                Seleccionado: <span className="font-medium">{difficultyMax}</span>
              </div>
            </Field>
          </div>

          {/* Preferences */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between rounded-xl border bg-gray-50 p-4">
            <div>
              <div className="text-sm font-medium text-gray-900">
                Preferencia de longitud
              </div>
              <div className="text-xs text-gray-600">
                Si activas “cortos”, prioriza libros con menos páginas.
              </div>
            </div>

            <label className="inline-flex items-center gap-2 select-none">
              <input
                type="checkbox"
                checked={prefersShort}
                onChange={(e) => setPrefersShort(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm text-gray-800">Prefiero libros cortos</span>
            </label>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Gustos (tags)
                </div>
                <div className="text-xs text-gray-600">
                  Escribe un gusto y presiona <b>Enter</b> o <b>,</b> para agregar.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTags([])}
                className="text-xs px-3 py-2 rounded-lg border bg-white hover:bg-gray-50"
              >
                Limpiar tags
              </button>
            </div>

            <div className="mt-3 rounded-xl border bg-white p-3">
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-2 rounded-full bg-black text-white px-3 py-1 text-xs"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="opacity-80 hover:opacity-100"
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
                  className="min-w-[180px] flex-1 px-2 py-1 text-sm outline-none"
                  placeholder="Ej: thriller, detectives…"
                />
              </div>
            </div>

            {/* suggested */}
            <div className="mt-3">
              <div className="text-xs text-gray-600 mb-2">
                Sugerencias rápidas:
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
                        "text-xs px-3 py-2 rounded-full border transition",
                        active
                          ? "bg-black text-white border-black"
                          : "bg-white hover:bg-gray-50",
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
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="text-xs text-gray-600">
              Tip: mientras más tags, mejores recomendaciones.
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-black text-white px-5 py-3 text-sm font-medium hover:bg-black/90"
            >
              Generar recomendaciones
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
