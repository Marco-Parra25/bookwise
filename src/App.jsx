import { useState } from "react";
import ProfileForm from "./components/ProfileForm";

export default function App() {
  const [profile, setProfile] = useState(null);

  return (
    <>
      {/* 🔴 BLOQUE DE PRUEBA */}
      <div className="bg-red-500 text-white p-6 text-center">
        Si esto NO se ve rojo, Tailwind no está cargando.
      </div>

      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <ProfileForm
            onSubmitProfile={(p) => {
              setProfile(p);
              console.log("Perfil:", p);
            }}
          />

          {profile && (
            <pre className="mt-6 text-xs bg-white border rounded-xl p-4 overflow-auto">
              {JSON.stringify(profile, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </>
  );
}
