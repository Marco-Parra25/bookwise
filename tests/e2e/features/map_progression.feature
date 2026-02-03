# language: es
Característica: Progresión en el Mapa Mundial

  Como un usuario de Bookwise
  Quiero ver a mi avatar avanzar en el mapa
  Para sentir el progreso de mi aventura

  Escenario: El avatar se mueve al siguiente nodo tras leer un libro
    Dado que el usuario "MAPA-MASTER" ya ha completado su perfil inicial
    Y se encuentra en el "Dashboard" viendo el mapa
    Entonces el avatar debería estar en el nodo "1"
    Cuando navega a la pestaña de "Cátálogo"
    Y busca el tomo "1984"
    Y consume el saber del libro "1984"
    Y navega a la pestaña de "Dashboard"
    Entonces el avatar debería estar en el nodo "2"
    Y el nodo "1" debería estar marcado como "LEÍDO"
