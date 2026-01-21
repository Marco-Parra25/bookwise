import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function WelcomeScreen({ onStart }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "BIENVENIDO A BOOKWISE",
      subtitle: "Una aventura épica te espera",
      content: (
        <div className="space-y-6 text-center">
          <p className="text-xl text-blue-100/90 leading-relaxed">
            Tu viaje no requiere espadas ni hechizos, sino <span className="magic-text font-bold">libros y sabiduría</span>.
          </p>
          <div className="py-4">
            <div className="inline-block p-6 rounded-full glass neon-border animate-float-slow">
              <span className="text-6xl">📖</span>
            </div>
          </div>
          <p className="text-gray-400">
            Cada página que consumas fortalecerá tu alma y expandirá tus horizontes en este reino digital.
          </p>
        </div>
      ),
    },
    {
      title: "EL CAMINO DEL SABIO",
      subtitle: "Domina las mecánicas del reino",
      content: (
        <div className="space-y-4 w-full">
          {[
            { id: "01", title: "FORJA TU AVATAR", desc: "Elige tu identidad y apariencia inicial", icon: "👤" },
            { id: "02", title: "SINTONIZA TU MENTE", desc: "Define tus intereses para recibir visiones", icon: "🎯" },
            { id: "03", title: "ADQUIERE CONOCIMIENTO", desc: "Descubre pergaminos y tomos únicos", icon: "📜" },
            { id: "04", title: "ALCANZA LA APOTEOSIS", desc: "Gana XP, reliquias y sube de nivel", icon: "💎" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 rounded-xl glass hover:neon-border transition-all group">
              <span className="text-2xl group-hover:scale-125 transition-transform">{item.icon}</span>
              <div>
                <p className="rpg-label text-xs mb-1">{item.id} // {item.title}</p>
                <p className="text-sm text-gray-300">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "RECUENTO DE RELIQUIAS",
      subtitle: "Tu progreso es tu poder",
      content: (
        <div className="space-y-4 w-full">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "EXPERIENCIA", val: "XP INFINITO", icon: "⭐", colors: "from-yellow-400/20 to-orange-500/20" },
              { label: "LOGROS", val: "100+ BADGES", icon: "🎖️", colors: "from-purple-400/20 to-pink-500/20" },
              { label: "RANGO", val: "NIVEL DE LEYENDA", icon: "📊", colors: "from-blue-400/20 to-cyan-500/20" },
              { label: "TOMOS", val: "BIBLIOTECA VIVA", icon: "📚", colors: "from-green-400/20 to-emerald-500/20" },
            ].map((stat, i) => (
              <div key={i} className={`rounded-2xl glass p-5 border border-white/5 bg-gradient-to-br ${stat.colors} group hover:neon-border transition-all`}>
                <div className="text-3xl mb-3 group-hover:animate-bounce">{stat.icon}</div>
                <div className="rpg-label text-[10px] opacity-70 mb-1">{stat.label}</div>
                <div className="font-bold text-white text-sm">{stat.val}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];

  async function handleGoogleLogin() {
    try {
      const { error } = await import("../services/supabase").then(m =>
        m.supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        })
      );
      if (error) throw error;
    } catch (err) {
      alert("Error al iniciar sesión: " + err.message);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden animate-aurora">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0"></div>

      {/* HUD Accents */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

      <ThemeToggle />

      <div className="max-w-xl w-full relative z-10">
        <div className="glass-heavy rounded-[2rem] p-10 md:p-14 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="rpg-label text-cyan-400 mb-2 tracking-[0.3em]">{currentStep.subtitle}</p>
            <h1 className="text-4xl md:text-5xl font-black magic-text tracking-tighter">
              {currentStep.title}
            </h1>
          </div>

          {/* Content Area */}
          <div className="mb-10 min-h-[320px] flex items-center justify-center">
            {currentStep.content}
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-3 mb-10">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === step
                    ? "w-12 bg-cyan-400 shadow-[0_0_10px_#00f2ff]"
                    : "w-3 bg-white/10 hover:bg-white/30"
                  }`}
                aria-label={`Sector ${i + 1}`}
              />
            ))}
          </div>

          {/* Navigation & Actions */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4">
              {step > 0 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-4 rounded-xl glass border border-white/5 text-gray-400 font-bold hover:text-white hover:bg-white/5 transition uppercase text-xs tracking-widest"
                >
                  ATRÁS
                </button>
              ) : (
                <div className="flex-1"></div>
              )}

              {step < steps.length - 1 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="flex-[2] py-4 rounded-xl bg-cyan-500 text-black font-black hover:bg-cyan-400 transition shadow-[0_0_20px_rgba(0,242,255,0.3)] uppercase text-xs tracking-widest"
                >
                  SIGUIENTE NIVEL →
                </button>
              ) : (
                <div className="flex-[2] flex gap-3">
                  <button
                    onClick={onStart}
                    className="flex-1 py-4 rounded-xl glass border border-white/5 text-gray-400 font-bold hover:text-white hover:bg-white/5 transition uppercase text-[10px] tracking-widest"
                  >
                    INVITADO
                  </button>
                  <button
                    onClick={handleGoogleLogin}
                    className="flex-[2] py-4 rounded-xl bg-white text-black font-black hover:bg-gray-200 transition shadow-xl flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google Sync
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

