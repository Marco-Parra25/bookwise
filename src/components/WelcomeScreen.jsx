import { useState } from "react";

export default function WelcomeScreen({ onStart }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "¡Bienvenido a Bookwise! 📚",
      content: (
        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            Una aventura épica te espera... pero no con espadas y dragones, sino con <strong>libros y conocimiento</strong>.
          </p>
          <p className="text-gray-600">
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
                <p className="font-semibold text-gray-900">Crea tu personaje</p>
                <p className="text-sm text-gray-600">Elige tu nombre y personaliza tu avatar</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">2️⃣</span>
              <div>
                <p className="font-semibold text-gray-900">Completa tu perfil</p>
                <p className="text-sm text-gray-600">Cuéntanos qué te gusta leer</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">3️⃣</span>
              <div>
                <p className="font-semibold text-gray-900">Recibe recomendaciones</p>
                <p className="text-sm text-gray-600">Te sugerimos libros perfectos para ti</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">4️⃣</span>
              <div>
                <p className="font-semibold text-gray-900">¡Lee y gana recompensas!</p>
                <p className="text-sm text-gray-600">Cada libro completado te da XP, badges y más</p>
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📖</div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
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
                  i === step ? "w-8 bg-indigo-600" : "w-2 bg-gray-300"
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
                className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
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

