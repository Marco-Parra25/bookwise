# language: es
Característica: Sistema de Apoteosis y Niveles (HU-05)

  Como un aventurero de Bookwise
  Quiero ganar XP y subir de nivel al leer libros
  Para sentir gratificación por mi progreso

  Escenario: Ganar XP y subir de nivel tras una lectura
    Dado que el usuario "HEROE-TEST" ya ha completado su perfil inicial
    Cuando navega a la pestaña de "Cátálogo"
    Y busca el tomo "1984"
    Y consume el saber del libro "1984"
    Entonces su nivel debería ser mayor a 0
    Y su contador de "Libros Leídos" debería aumentar a 1
