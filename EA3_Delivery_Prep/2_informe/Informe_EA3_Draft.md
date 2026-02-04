# Informe Evaluación Parcial 3 (EA3) - TPY1101
**Proyecto:** Bookwise
**Grupo:** [Número de Grupo/Integrantes]

## 1. Plan de Pruebas

Se ha diseñado un plan de pruebas integral para validar las funcionalidades críticas del sistema.

| ID | Caso de Prueba | Descripción | Resultado Agrupado | Estado |
|---|---|---|---|---|
| **CP-01** | Búsqueda E2E | Escenario `search.feature`. | Lista filtrada, libro consumido y XP aumentado. | ✅ Aprobado |
| **CP-02** | Onboarding BDD | Escenario `onboarding.feature`. | Perfil creado, avatar asignado y Dashboard visible. | ✅ Aprobado |
| **CP-03** | Progreso Mapa | Escenario `map_progression.feature`.| Avatar se mueve al nodo 2 tras leer un libro. | ✅ Aprobado |
| **CP-04** | Scraper Master | Ejecutar script de actualización. | Nuevos libros insertados correctamente en DB. | ✅ Aprobado |
| **CP-05** | Login/Registro | Autenticación de usuario. | Acceso al Dashboard personalizado. | ✅ Aprobado |
| **CP-06** | Integración Backend | Llamada API a `/api/books`. | Respuesta JSON correcta con datos reales. | ✅ Aprobado |

| **CP-06** | Integración Backend | Llamada API a `/api/books`. | Respuesta JSON correcta con datos reales. | ✅ Aprobado |

## 2. Resultados y Evidencias (Pruebas Funcionales E2E)

(Ver carpeta `3_evidencias`)
- **Evidencia CP-01**: `evidencia_e2e_search.png` (Playwright Test OK).
- **Evidencia CP-02**: `evidencia_e2e_onboarding.png` (Flujo completo Playwright).
- **Evidencia CP-03**: `evidencia_e2e_mapa.png` (Avatar moviéndose entre nodos).
- **Evidencia CP-04**: `evidencia_scraper_logs.txt` (Detección de libros nuevos).

---
**Nota Técnica - Suite de Pruebas BDD:**
Se implementó una suite de pruebas funcionales utilizando **Playwright** y **BDD (playwright-bdd)** con escenarios en lenguaje natural (Gherkin). Esto garantiza que no solo el código funcione aisladamente, sino que el flujo de usuario completo sea robusto.


## 3. Correcciones y Mejoras (vs EA2)

### 3.1 Frontend: Rediseño Inmersivo Emporium
**Situación anterior:** Diseño 2D/3D básico en ventana pequeña.
**Mejora:** Layout "Full Screen" con Avatar 3D como fondo interactivo.
- **Detalle:** Interfaz flotante, ajuste dinámico de cámara (Bounds).

### 3.2 Frontend: World Map v5.0
**Situación anterior:** Mapa estático.
**Mejora:** Efectos de paralaje y nodos volumétricos.
- **Detalle:** Tilt controlado por mouse, criaturas ambientales.

### 3.3 Backend: Scraper Master/Worker
**Situación anterior:** Scraper monolítico.
**Mejora:** Arquitectura distribuida para mayor resiliencia.

## 4. Conclusiones
Bookwise ha evolucionado a una plataformas inmersiva. La arquitectura actual permite escalabilidad y una experiencia de usuario (UX) de alto nivel gamificado.

---

# INSTRUCCIONES DE EMPAQUETADO FINAL (Para el Estudiante)

Para generar el archivo `EA3_TPY1101_GrupoX.zip` de forma correcta:

1.  **Limpieza:** Borra las carpetas `node_modules` y `.venv` de tus proyectos originales antes de copiar.
2.  **Organización:**
    - Comprime la carpeta `bookwise` y cámbiale el nombre a `frontend.zip`. Muévela a `1_codigo_fuente/`.
    - Comprime la carpeta `backend` y cámbiale el nombre a `backend.zip`. Muévela a `1_codigo_fuente/`.
3.  **Informe:** Guarda este documento como PDF en `2_informe/`.
4.  **ZIP Maestro:** Selecciona las 3 carpetas (`1_codigo_fuente`, `2_informe`, `3_evidencias`) y comprímelas en el archivo final.

