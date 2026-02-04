# language: es
Característica: Onboarding de Usuario
  Como un nuevo lector
  Quiero crear mi avatar y definir mis gustos
  Para comenzar mi aventura en Bookwise

  Escenario: Onboarding completo desde cero hasta el Dashboard
    Dado que un nuevo usuario entra a la aplicación
    Cuando completa el recorrido de bienvenida
    Y forja un nuevo personaje llamado "HEROE-ALPHA" con el avatar "Mago"
    Y define sus gustos literarios como:
      | Campo    | Valor                 |
      | Género   | Acción y Explosiones  |
      | Hobby    | Videojuegos y Tecnología|
      | Vibra    | Relajado y en Calma   |
      | Edad     | 25                    |
    Entonces debería ver su Dashboard con el rango "INICIADO" y el nombre "HEROE-ALPHA"
