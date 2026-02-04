# language: es
Característica: Búsqueda y Consumo de Libros

  Como un usuario de Bookwise
  Quiero navegar por el catálogo y consumir libros
  Para aumentar mi nivel de sabiduría

  Escenario: Buscar un libro y marcarlo como leído
    Dado que el usuario ya ha completado su perfil inicial
    Cuando navega a la pestaña de "Cátálogo"
    Y busca el tomo "1984"
    Entonces debería ver "1984" en los resultados
    Cuando consume el saber del libro "1984"
    Y navega a la pestaña de "Dashboard"
    Entonces su contador de "Libros Leídos" debería aumentar a 1
