# language: es
Característica: El Emporium - Personalización del Avatar

  Como un usuario de Bookwise
  Quiero comprar accesorios en la tienda
  Para personalizar mi identidad visual

  Escenario: Adquirir un accesorio en el Emporium
    Dado que el usuario "ALQUIMISTA" ya ha completado su perfil inicial
    Cuando navega a la pestaña de "Emporium"
    Y compra el ítem "Sombrero de Mago"
    Entonces el ítem "Sombrero de Mago" debería estar marcado como "Equipado"
