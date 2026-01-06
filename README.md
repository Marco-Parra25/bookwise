# 📚 Bookwise

Una aplicación web moderna para crear perfiles de lectura personalizados y recibir recomendaciones de libros basadas en tus preferencias.

## 🚀 Características

- **Perfil de Lector Personalizado**: Crea tu perfil con edad, tiempo de lectura diario, objetivos y preferencias
- **Sistema de Tags**: Agrega gustos literarios personalizados (misterio, fantasía, romance, etc.)
- **Recomendaciones Inteligentes**: Recibe sugerencias de libros basadas en tu perfil
- **Interfaz Moderna**: Diseño limpio y responsivo con Tailwind CSS
- **Plan de Lectura Anual**: Genera un plan personalizado según tus objetivos

## 🛠️ Tecnologías

- **React 19** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS v4** - Framework de estilos
- **PostCSS** - Procesamiento de CSS

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/bookwise.git
cd bookwise
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## 🎯 Uso

1. Completa el formulario de perfil con:
   - Tu edad (8-90 años)
   - Minutos de lectura por día (5-240)
   - Objetivo de lectura (entretenimiento, aprendizaje, hábito, etc.)
   - Dificultad máxima preferida (1-5)
   - Preferencia de longitud de libros
   - Tags de gustos literarios

2. Haz clic en "Generar recomendaciones" para recibir sugerencias personalizadas

## 📁 Estructura del Proyecto

```
bookwise/
├── src/
│   ├── components/
│   │   └── ProfileForm.jsx    # Componente del formulario de perfil
│   ├── App.jsx                # Componente principal
│   ├── main.jsx               # Punto de entrada
│   └── index.css              # Estilos globales con Tailwind
├── public/                    # Archivos estáticos
├── tailwind.config.js         # Configuración de Tailwind
├── postcss.config.js          # Configuración de PostCSS
└── vite.config.js             # Configuración de Vite
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👤 Autor

Desarrollado como parte de un proyecto de tesis.

---

⭐ Si te gusta este proyecto, ¡dale una estrella!
