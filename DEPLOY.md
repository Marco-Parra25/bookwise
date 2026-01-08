# 🚀 Guía de Despliegue - Bookwise

## Frontend en Vercel

### Pasos para Desplegar

1. **Preparar el Repositorio:**
   ```bash
   git add .
   git commit -m "Preparado para Vercel"
   git push origin main
   ```

2. **Conectar con Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión con GitHub
   - Click en "Add New Project"
   - Selecciona tu repositorio `bookwise`
   - Vercel detectará automáticamente que es Vite

3. **Configurar Variables de Entorno:**
   - En la configuración del proyecto
   - Ve a "Environment Variables"
   - Agrega:
     ```
     VITE_API_URL = https://tu-api-desplegada.com
     ```

4. **Desplegar:**
   - Click en "Deploy"
   - Vercel construirá y desplegará automáticamente
   - Obtendrás una URL como: `bookwise.vercel.app`

### Configuración Automática

El archivo `vercel.json` ya está configurado con:
- ✅ Framework detectado: Vite
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Rewrites para SPA (Single Page Application)

### Actualizaciones Automáticas

Cada vez que hagas push a `main`, Vercel:
1. Detecta los cambios
2. Construye el proyecto
3. Despliega automáticamente
4. Te notifica del resultado


## Variables de Entorno en Vercel

### Desarrollo
```
VITE_API_URL=http://localhost:3001
```

### Producción
```
VITE_API_URL=https://tu-api-desplegada.com
```

## Verificar Despliegue

1. **Frontend funcionando:**
   - Visita tu URL de Vercel
   - Debe cargar la aplicación

2. **API conectada:**
   - Abre la consola del navegador
   - Verifica que las llamadas API funcionen
   - Revisa Network tab para ver requests

3. **Variables de entorno:**
   - Verifica que `VITE_API_URL` esté configurada
   - Puedes verificar en Vercel Dashboard → Settings → Environment Variables

## Troubleshooting

### Error: "Failed to fetch"
- Verifica que `VITE_API_URL` esté configurada correctamente
- Asegúrate de que la API esté desplegada y funcionando
- Revisa CORS en la API

### Error: "Build failed"
- Revisa los logs en Vercel
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que Node.js version sea compatible

### La app no carga
- Verifica que `vercel.json` esté presente
- Revisa que el build se complete correctamente
- Verifica los logs de Vercel

## Dominio Personalizado

1. En Vercel Dashboard → Settings → Domains
2. Agrega tu dominio
3. Configura DNS según las instrucciones
4. Espera a que se propague (puede tardar hasta 24h)

