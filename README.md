# 📚 Bookwise - Sistema de Recomendaciones de Libros

Una aplicación web moderna y gamificada para crear perfiles de lectura personalizados y recibir recomendaciones inteligentes de libros.

## ✨ Características

- 🎮 **Sistema Gamificado**: Crea tu personaje, gana XP, sube de nivel y desbloquea badges
- 🤖 **Recomendaciones con IA**: Usa Gemini AI para recomendaciones personalizadas
- 📚 **Catálogo de Bibliometro**: Integración con catálogo de Bibliometro vía Firebase
- 🏆 **Sistema de Recompensas**: Gana XP leyendo libros y generando recomendaciones
- 📍 **Ubicaciones de Bibliotecas**: Encuentra dónde conseguir cada libro en Santiago
- 🌙 **Modo Oscuro**: Interfaz con soporte para tema claro/oscuro
- 📱 **Responsive**: Diseño adaptado para móviles y tablets

## 🏗️ Arquitectura

### Frontend
- React 19 + Vite
- Tailwind CSS v4
- Desplegado en Vercel
- Consume API externa configurada en `VITE_API_URL`

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js v18 o superior
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/bookwise.git
cd bookwise

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env y agregar la URL de tu backend
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Producción

```bash
# Construir para producción
npm run build

# Previsualizar build
npm run preview
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz:

```env
# URL de la API (backend externo)
VITE_API_URL=http://localhost:3001
```

**Para producción en Vercel:**
- Configura `VITE_API_URL` en las variables de entorno de Vercel
- Apunta a tu API desplegada

## 🚢 Despliegue en Vercel

### Opción 1: Desde GitHub (Recomendado)

1. **Conecta tu repositorio a Vercel:**
   - Ve a [Vercel](https://vercel.com)
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Vite

2. **Configura Variables de Entorno:**
   - En la configuración del proyecto en Vercel
   - Agrega: `VITE_API_URL` = `https://tu-backend.com`

3. **Despliega:**
   - Vercel desplegará automáticamente en cada push a `main`

### Opción 2: Desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

## 📁 Estructura del Proyecto

```
bookwise/
├── src/
│   ├── components/          # Componentes React
│   │   ├── WelcomeScreen.jsx
│   │   ├── CharacterCreation.jsx
│   │   ├── CharacterProfile.jsx
│   │   ├── ProfileForm.jsx
│   │   └── ThemeToggle.jsx
│   ├── hooks/               # Custom hooks
│   │   └── useTheme.js
│   ├── services/            # Servicios API
│   │   └── api.js
│   ├── utils/               # Utilidades
│   │   └── storage.js
│   ├── App.jsx              # Componente principal
│   ├── main.jsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── public/                  # Archivos estáticos
├── .env.example            # Ejemplo de variables de entorno
├── vercel.json             # Configuración de Vercel
├── vite.config.js          # Configuración de Vite
└── package.json            # Dependencias
```

## 🎮 Funcionalidades

### Sistema Gamificado

- **Creación de Personaje**: Elige nombre y avatar
- **Sistema de XP**: Gana experiencia leyendo libros
- **Niveles**: Sube de nivel automáticamente
- **Badges**: Desbloquea logros especiales
- **Recompensas**: XP por generar recomendaciones

### Recomendaciones

- **Perfil Personalizado**: Basado en edad, gustos y objetivos
- **IA Inteligente**: Recomendaciones con Gemini AI
- **Explicaciones**: Cada recomendación incluye por qué es perfecta para ti
- **Bibliotecas**: Muestra dónde conseguir cada libro

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Previsualiza build de producción
- `npm run lint` - Ejecuta el linter


## 🛠️ Tecnologías

- **React 19** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS v4** - Framework de estilos

## 📝 Licencia

ISC
