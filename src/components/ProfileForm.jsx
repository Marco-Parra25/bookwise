import { useState } from "react";

export default function ProfileForm({ onSubmitProfile, initialProfile }) {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({
    movieGenre: "",
    hobby: "",
    mood: "",
    age: initialProfile?.age ?? 20,
    time: initialProfile?.minutesPerDay ?? 20,
  });

  const STEPS = [
    {
      title: "¿Qué tipo de historias te gustan?",
      subtitle: "Si tu vida fuera una película, ¿cómo sería?",
      field: "movieGenre",
      options: [
        { id: "accion", label: "Acción y Explosiones", icon: "💥", tags: ["aventura", "suspenso", "thriller"] },
        { id: "misterio", label: "Misterio y Detective", icon: "🕵️‍♂️", tags: ["misterio", "criminal", "policial"] },
        { id: "romance", label: "Historias de Amor", icon: "💖", tags: ["romance", "drama", "sentimental"] },
        { id: "ciencia-ficcion", label: "Viajes al Futuro / Espacio", icon: "🚀", tags: ["ciencia ficción", "distopía", "tecnología"] },
        { id: "comedia", label: "Algo para reír", icon: "😂", tags: ["humor", "comedia", "relatos cortos"] },
        { id: "terror", label: "Sustos y Pesadillas", icon: "👻", tags: ["terror", "horror", "sobrenatural"] },
      ]
    },
    {
      title: "¿Qué te apasiona en el mundo real?",
      subtitle: "Dinos qué haces en tu tiempo libre.",
      field: "hobby",
      options: [
        { id: "videojuegos", label: "Videojuegos y Tecnología", icon: "🎮", tags: ["tecnología", "cyberpunk", "negocios"] },
        { id: "naturaleza", label: "Viajes y Naturaleza", icon: "🌿", tags: ["naturaleza", "viajes", "geografía"] },
        { id: "historia", label: "Aprender del Pasado", icon: "🏛️", tags: ["historia", "biografía", "histórico"] },
        { id: "deportes", label: "Deportes y Salud", icon: "⚽", tags: ["salud", "deporte", "motivación"] },
        { id: "arte", label: "Arte y Creatividad", icon: "🎨", tags: ["arte", "diseño", "música"] },
        { id: "personas", label: "Entender a la Gente", icon: "🧠", tags: ["psicología", "autoayuda", "sociedad"] },
      ]
    },
    {
      title: "¿Cómo quieres sentirte al leer?",
      subtitle: "Elige la vibra de tu próxima lectura.",
      field: "mood",
      options: [
        { id: "relajado", label: "Relajado y en Calma", icon: "🛁", tags: ["bienestar", "poesía", "naturaleza"] },
        { id: "empoderado", label: "Motivado y con Energía", icon: "🔥", tags: ["liderazgo", "negocios", "superación"] },
        { id: "intrigado", label: "Con el cerebro a mil", icon: "🧠", tags: ["filosofía", "ciencia", "ensayo"] },
        { id: "conmovido", label: "Emocionado hasta las lágrimas", icon: "💧", tags: ["drama", "clásicos", "biografías"] },
      ]
    }
  ];

  const handleSelect = (field, value) => {
    setSelections(prev => ({ ...prev, [field]: value }));
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setStep(STEPS.length); // Ir al paso final (edad/tiempo)
    }
  };

  const handleSubmit = () => {
    // Collect tags from all selections
    const movieTags = STEPS[0].options.find(o => o.id === selections.movieGenre)?.tags || [];
    const hobbyTags = STEPS[1].options.find(o => o.id === selections.hobby)?.tags || [];
    const moodTags = STEPS[2].options.find(o => o.id === selections.mood)?.tags || [];

    // Merge and deduplicate
    const finalTags = Array.from(new Set([...movieTags, ...hobbyTags, ...moodTags]));

    const profile = {
      age: Number(selections.age),
      minutesPerDay: Number(selections.time),
      goal: "entretener",
      prefersShort: selections.time < 30, // Heuristic
      difficultyMax: selections.hobby === "historia" || selections.hobby === "personas" ? 4 : 3,
      tags: finalTags
    };

    onSubmitProfile(profile);
  };

  const current = STEPS[step];

  return (
    <div className="w-full mx-auto flex flex-col justify-center">
      <div className="rounded-[2rem] overflow-hidden transition-all duration-500">

        {/* Progress Bar */}
        <div className="h-1.5 bg-white/5 w-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--atm-accent)] to-magic-500 transition-all duration-500 shadow-[0_0_10px_var(--atm-glow)]"
            style={{ width: `${(step / (STEPS.length)) * 100}%` }}
          ></div>
        </div>

        {step < STEPS.length ? (
          <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-white mb-2 leading-tight uppercase tracking-tighter">
                {current.title}
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
                {current.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {current.options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(current.field, opt.id)}
                  className={`
                    group relative p-4 rounded-2xl border transition-all duration-300 transform active:scale-95
                    ${selections[current.field] === opt.id
                      ? 'border-[var(--atm-accent)] bg-[var(--atm-accent)]/10 shadow-[0_0_15px_var(--atm-glow)]'
                      : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl group-hover:rotate-12 transition-transform">{opt.icon}</span>
                    <span className="font-bold text-sm text-gray-200 uppercase tracking-tight">{opt.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="mt-6 text-[10px] text-gray-500 hover:text-white font-black uppercase tracking-widest flex items-center gap-2 transition"
              >
                ← Volver
              </button>
            )}
          </div>
        ) : (
          <div className="p-6 md:p-8 animate-in zoom-in duration-500 text-center">
            <h2 className="text-xl font-black text-white mb-6 uppercase tracking-widest">
              ¡Invocación Final! 🚀
            </h2>

            <div className="space-y-6 max-w-sm mx-auto">
              <div className="text-left">
                <label className="rpg-label block mb-2">Tu edad</label>
                <input
                  type="number"
                  value={selections.age}
                  onChange={(e) => setSelections(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full text-xl font-black bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:hud-border text-white transition-all outline-none"
                />
              </div>

              <div className="text-left">
                <label className="rpg-label block mb-2">Minutos de lectura / día</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5" max="120" step="5"
                    value={selections.time}
                    onChange={(e) => setSelections(prev => ({ ...prev, time: e.target.value }))}
                    className="flex-1 accent-[var(--atm-accent)] h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="w-12 font-black text-[var(--atm-accent)] text-xs">{selections.time}m</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-black uppercase tracking-widest shadow-lg hover:shadow-[var(--atm-accent)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                🔮 Ver Destino
              </button>

              <button
                onClick={() => setStep(STEPS.length - 1)}
                className="text-[10px] text-gray-500 hover:text-white font-black uppercase tracking-widest transition"
              >
                ← Revisar elecciones
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
