import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function WelcomeScreen({ onStart }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "¡Bienvenido a Bookwise! 📚",
      content: (
        <div className="space-y-4">
          <p className="text-lg text-gray-700 dark:text-gray-200">
            Una aventura épica te espera... pero no con espadas y dragones, sino con <strong>libros y conocimiento</strong>.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Cada libro que leas te dará experiencia, recompensas y hará crecer tu personaje lector.
          </p>
        </div>
      ),
    },
    {
      title: "¿Cómo funciona? 🎮",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <span className="text-2xl">1️⃣</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Crea tu personaje</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Elige tu nombre y personaliza tu avatar</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">2️⃣</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Completa tu perfil</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Cuéntanos qué te gusta leer</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">3️⃣</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Recibe recomendaciones</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Te sugerimos libros perfectos para ti</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">4️⃣</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">¡Lee y gana recompensas!</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Cada libro completado te da XP, badges y más</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Sistema de Recompensas 🏆",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 p-4 text-white">
              <div className="text-3xl mb-2">⭐</div>
              <div className="font-semibold">Experiencia (XP)</div>
              <div className="text-sm opacity-90">Gana XP leyendo libros</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 p-4 text-white">
              <div className="text-3xl mb-2">🎖️</div>
              <div className="font-semibold">Badges</div>
              <div className="text-sm opacity-90">Logros especiales</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 p-4 text-white">
              <div className="text-3xl mb-2">📊</div>
              <div className="font-semibold">Niveles</div>
              <div className="text-sm opacity-90">Sube de nivel</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 p-4 text-white">
              <div className="text-3xl mb-2">📚</div>
              <div className="font-semibold">Biblioteca</div>
              <div className="text-sm opacity-90">Tus libros leídos</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      {/* Imagen de fondo épica */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=2128&q=80)',
          }}
        >
          {/* Overlay con gradiente para mejor legibilidad - más transparente */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/60 via-purple-600/60 to-pink-600/60 dark:from-indigo-900/70 dark:via-purple-900/70 dark:to-pink-900/70"></div>
          {/* Efecto de brillo sutil */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
        </div>
      </div>
      
      <ThemeToggle />
      <div className="max-w-2xl w-full relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 transition-colors">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📖</div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {currentStep.title}
            </h1>
          </div>

          {/* Content */}
          <div className="mb-8 min-h-[300px] flex items-center">
            {currentStep.content}
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-2 rounded-full transition-all ${
                  i === step ? "w-8 bg-indigo-600 dark:bg-indigo-400" : "w-2 bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`Ir al paso ${i + 1}`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                ← Anterior
              </button>
            ) : (
              <div></div>
            )}

            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
              >
                Siguiente →
              </button>
            ) : (
              <button
                onClick={onStart}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
              >
                ¡Comenzar Aventura! 🚀
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

