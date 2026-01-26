import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomeScreen({ onStart }) {
  const [step, setStep] = useState(0);
  const [demoLevel, setDemoLevel] = useState(1);

  // Cycle demo level for the "Evolución" slide
  useEffect(() => {
    if (step === 2) { // Index of "ARSENAL DE LEYENDA"
      const interval = setInterval(() => {
        setDemoLevel((prev) => (prev === 1 ? 25 : prev === 25 ? 99 : 1));
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setDemoLevel(1);
    }
  }, [step]);

  const steps = [
    {
      title: "BIENVENIDO A BOOKWISE",
      subtitle: "Una aventura épica te espera",
      content: (
        <div className="space-y-6 text-center">
          <p className="text-xl text-blue-100/90 leading-relaxed">
            Tu viaje no requiere espadas ni hechizos, sino <span className="magic-text font-bold">libros y sabiduría</span>.
          </p>
          <div className="py-8 relative inline-block">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
            <div className="relative p-6 rounded-full glass neon-border animate-float-slow z-10">
              <span className="text-7xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">📖</span>
            </div>
            {/* Particles */}
            <div className="absolute -top-4 -right-4 text-2xl animate-bounce delay-700">✨</div>
            <div className="absolute bottom-0 -left-6 text-xl animate-bounce delay-100">✨</div>
          </div>
          <p className="text-gray-400 max-w-md mx-auto">
            Cada página que consumas fortalecerá tu alma y expandirá tus horizontes en este reino digital.
          </p>
        </div>
      ),
    },
    {
      title: "EL CAMINO DEL SABIO",
      subtitle: "Domina las mecánicas del reino",
      content: (
        <div className="space-y-3 w-full max-w-md">
          {[
            { id: "01", title: "FORJA TU AVATAR", desc: "Elige tu identidad", icon: "👤", color: "text-blue-400" },
            { id: "02", title: "SINTONIZA TU MENTE", desc: "Recibe visiones por IA", icon: "🔮", color: "text-purple-400" },
            { id: "03", title: "ADQUIERE CONOCIMIENTO", desc: "Lee y gana XP", icon: "📜", color: "text-yellow-400" },
            { id: "04", title: "ALCANZA LA APOTEOSIS", desc: "Ascensión de nivel", icon: "⚡", color: "text-cyan-400" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-xl glass border border-white/5 hover:bg-white/5 transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg bg-black/30 flex items-center justify-center text-xl ${item.color} group-hover:scale-110 transition-transform`}>{item.icon}</div>
              <div className="text-left">
                <p className="rpg-label text-[10px] mb-0.5 text-gray-500">{item.id}</p>
                <p className="font-bold text-gray-200 text-sm">{item.title}</p>
                <p className="text-[10px] text-gray-400">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      title: "ARSENAL DE LEYENDA",
      subtitle: "Evoluciona y desbloquea poder",
      content: (
        <div className="w-full text-center">
          <div className="relative h-64 w-full flex items-center justify-center">

            {/* Evolution Stage Indicator */}
            <div className="absolute top-0 left-0 right-0 flex justify-center gap-8 z-0 opacity-30">
              <div className={`transition-all duration-500 ${demoLevel === 1 ? 'scale-125 opacity-100 text-white' : 'scale-90'}`}>NOVATO</div>
              <div className={`transition-all duration-500 ${demoLevel === 25 ? 'scale-125 opacity-100 text-cyan-400' : 'scale-90'}`}>VETERANO</div>
              <div className={`transition-all duration-500 ${demoLevel === 99 ? 'scale-125 opacity-100 text-yellow-400' : 'scale-90'}`}>LEYENDA</div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={demoLevel}
                initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                {/* Aura */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px] transition-all duration-1000
                  ${demoLevel === 1 ? 'w-32 h-32 bg-gray-500/20' :
                    demoLevel === 25 ? 'w-48 h-48 bg-cyan-500/30' :
                      'w-64 h-64 bg-yellow-500/40 animate-pulse'}`}
                />

                {/* Avatar Container */}
                <div className={`relative w-40 h-40 rounded-3xl glass flex items-center justify-center text-8xl border-4 transition-all duration-500 shadow-2xl
                  ${demoLevel === 1 ? 'border-gray-600' :
                    demoLevel === 25 ? 'border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)]' :
                      'border-yellow-400 shadow-[0_0_50px_rgba(234,179,8,0.6)]'}`}
                >
                  {demoLevel === 1 && "🧙‍♂️"}
                  {demoLevel === 25 && "🧙‍♂️"}
                  {demoLevel === 99 && "🤴"}

                  {/* Accessories */}
                  {demoLevel >= 25 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      className="absolute -right-4 -top-4 text-4xl drop-shadow-lg"
                    >
                      ✨
                    </motion.div>
                  )}
                  {demoLevel === 99 && (
                    <>
                      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: -85, opacity: 1 }} className="absolute text-6xl drop-shadow-[0_0_10px_gold]">👑</motion.div>
                      <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: -60, opacity: 1 }} className="absolute text-5xl">🛡️</motion.div>
                      <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 60, opacity: 1 }} className="absolute text-5xl">⚔️</motion.div>
                    </>
                  )}
                </div>

                {/* Level Badge */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black px-4 py-1 rounded-full border border-white/20 text-xs font-black tracking-widest uppercase">
                  Nivel {demoLevel}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="mt-8 text-sm text-gray-400">
            Desbloquea <span className="text-white font-bold">auras, skins y reliquias</span> a medida que devoras libros.
          </p>
        </div>
      )
    },
    {
      title: "RECUENTO DE RELIQUIAS",
      subtitle: "Tu progreso es tu poder",
      content: (
        <div className="space-y-6 w-full max-w-md">
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "EXPERIENCIA",
                val: "XP INFINITO",
                desc: "Gana puntos por cada página leída y acción completada",
                icon: "⭐",
                bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400"
              },
              {
                label: "LOGROS",
                val: "100+ BADGES",
                desc: "Desbloquea medallas por géneros, rachas y hitos",
                icon: "🏅",
                bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400"
              },
              {
                label: "RANGO",
                val: "NIVEL DE LEYENDA",
                desc: "Evoluciona tu avatar desde Novato hasta un ser Mítico",
                icon: "📊",
                bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400"
              },
              {
                label: "TOMOS",
                val: "BIBLIOTECA VIVA",
                desc: "Tu historial de lectura afecta el mundo que te rodea",
                icon: "📚",
                bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400"
              },
            ].map((stat, i) => (
              <div key={i} className={`rounded-2xl p-4 border ${stat.border} ${stat.bg} hover:scale-105 transition-transform duration-300 group flex flex-col justify-between h-full`}>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-3xl group-hover:rotate-12 transition-transform">{stat.icon}</div>
                    <div className={`rpg-label text-[9px] opacity-80 ${stat.text}`}>{stat.label}</div>
                  </div>
                  <div className="font-bold text-white text-sm mb-2">{stat.val}</div>
                </div>
                <p className="text-[10px] text-gray-400 leading-tight border-t border-white/5 pt-2 mt-1">
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white/20"></span>
            <span className="w-2 h-2 rounded-full bg-white/20"></span>
            <span className="w-8 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_cyan]"></span>
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
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden animate-aurora selection:bg-cyan-500/30">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0"></div>

      {/* Cinematic Bars */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10"></div>

      <ThemeToggle />

      <div className="max-w-xl w-full relative z-20 perspective-[1000px]">
        <motion.div
          key={step}
          initial={{ opacity: 0, rotateX: -10, y: 20 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="glass-heavy rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]"></div>

          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <p className="rpg-label text-cyan-400 mb-2 tracking-[0.4em] uppercase text-[10px]">{currentStep.subtitle}</p>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase drop-shadow-lg">
              {currentStep.title}
            </h1>
          </div>

          {/* Content Area */}
          <div className="mb-8 min-h-[340px] flex items-center justify-center relative z-10">
            {currentStep.content}
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === step
                  ? "w-10 bg-cyan-400 shadow-[0_0_10px_#06b6d4]"
                  : "w-2 bg-white/10 hover:bg-white/30"
                  }`}
                aria-label={`Paso ${i + 1}`}
              />
            ))}
          </div>

          {/* Navigation & Actions */}
          <div className="flex flex-col gap-3 relative z-10">
            <div className="flex justify-between items-center gap-3">
              {step > 0 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-4 rounded-xl glass border border-white/5 text-gray-400 font-bold hover:text-white hover:bg-white/5 transition uppercase text-[10px] tracking-widest"
                >
                  ATRÁS
                </button>
              ) : (
                <div className="flex-1"></div>
              )}

              {step < steps.length - 1 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-black hover:brightness-110 transition shadow-[0_0_20px_rgba(6,182,212,0.4)] uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
                >
                  CONTINUAR <span>→</span>
                </button>
              ) : (
                <div className="flex-[2] flex gap-3">
                  <button
                    onClick={onStart}
                    className="flex-1 py-4 rounded-xl glass border border-white/5 text-gray-400 font-bold hover:text-white hover:bg-white/5 transition uppercase text-[10px] tracking-widest"
                  >
                    MODO INVITADO
                  </button>
                  <button
                    onClick={handleGoogleLogin}
                    className="flex-[1.5] py-4 rounded-xl bg-white text-black font-black hover:bg-gray-100 transition shadow-xl flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest"
                  >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="G" />
                    INICIAR SESIÓN
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

