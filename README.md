# 📚 Bookwise - Sistema de Recomendaciones de Libros

Una aplicación web moderna y gamificada para crear perfiles de lectura personalizados y recibir recomendaciones inteligentes de libros.

## ✨ Características

- 🎮 **Sistema Gamificado**: Crea tu personaje, gana XP, sube de nivel y desbloquea badges.
- 🤖 **Recomendaciones con IA**: Usa Gemini AI para recomendaciones personalizadas basadas en tu perfil.
- 🎨 **Avatar Studio Pro**: Sistema avanzado de personalización con alineación 3D para accesorios (Astronauta, Mago, etc.).
- 📚 **Catálogo de Bibliometro**: Integración con el catálogo de Bibliometro para disponibilidad real.
- 🧪 **Calidad de Código**: Suite completa de pruebas unitarias para asegurar la estabilidad del núcleo.
- 🇪🇸 **Documentación en Español**: Comentarios del código íntegramente en español para mejor mantenimiento.
- 🌙 **Modo Oscuro**: Interfaz premium con soporte para tema claro/oscuro.
- 📱 **Responsive**: Diseño adaptado para una experiencia perfecta en móviles y tablets.

## 🏗️ Arquitectura

### Frontend
- **React 19 + Vite**: Última versión para máximo rendimiento.
- **Tailwind CSS v4**: Framework de estilos de última generación.
- **Vitest**: Motor de pruebas unitarias rápido y fiable.
- **Framer Motion**: Animaciones fluidas y efectos 3D.
- **Supabase**: Gestión de perfiles y persistencia de datos.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js v18 o superior
- npm o yarn

### Instalación

```bash
# Iniciar el proyecto
npm install

# Configurar variables de entorno
cp .env.example .env
# Configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
```

### Desarrollo y Pruebas

```bash
# Iniciar servidor de desarrollo
npm run dev

# Ejecutar pruebas unitarias
npm test
```

## 📁 Estructura del Proyecto

```
bookwise/
├── src/
│   ├── components/       # Componentes React (Avatar, Store, Map, etc.)
│   ├── hooks/            # Hooks personalizados (useTheme, etc.)
│   ├── services/         # Servicios de API y Base de Datos (Supabase)
│   ├── test/             # ✅ Suite de Pruebas Unitarias
│   ├── utils/            # Utilidades de almacenamiento y lógica
│   ├── App.jsx           # Componente raíz
│   └── main.jsx          # Punto de entrada (Configuración de Tema)
├── public/               # Activos estáticos
└── package.json          # Dependencias y Scripts
```

## 🎮 Funcionalidades Premium

### Avatar Studio
Personalización milimétrica para diferentes tipos de avatares. Incluye lógica de posicionamiento específica para que los accesorios (máscaras, sombreros, lentes) se ajusten perfectamente a la fisionomía de cada emoji.

### Sistema de Progresión
- **XP Quántica**: Ganancia dinámica basada en páginas y dificultad.
- **Mapa Evolutivo**: Un mapamundi 3D interactivo que muestra tu avance.
- **Emporium**: Tienda de accesorios con previsualización en tiempo real.

## 📝 Licencia

ISC
