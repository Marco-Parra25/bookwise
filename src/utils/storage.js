const STORAGE_KEY = "bookwise_character";
const STORAGE_PROFILE_KEY = "bookwise_profile";

export function saveCharacter(character) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(character));
    return true;
  } catch (error) {
    console.error("Error al guardar personaje:", error);
    return false;
  }
}

export function loadCharacter() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error al cargar personaje:", error);
    return null;
  }
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error("Error al guardar perfil:", error);
    return false;
  }
}

export function loadProfile() {
  try {
    const data = localStorage.getItem(STORAGE_PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error al cargar perfil:", error);
    return null;
  }
}

export function addBookRead(bookId, bookData) {
  const character = loadCharacter();
  if (!character) return false;

  // Evitar duplicados
  if (!character.booksReadIds) {
    character.booksReadIds = [];
  }
  if (character.booksReadIds.includes(bookId)) {
    return false; // Ya fue leído
  }

  character.booksReadIds.push(bookId);
  character.booksRead += 1;

  // Calcular XP basado en páginas y dificultad
  const baseXP = 50;
  const pagesXP = Math.floor((bookData.pages || 200) / 10); // 1 XP cada 10 páginas
  const difficultyXP = (bookData.difficulty || 3) * 5; // 5 XP por nivel de dificultad
  const totalXP = baseXP + pagesXP + difficultyXP;

  // Otorgar Monedas Lumina
  const baseCoins = 50;
  const difficultyBonus = (bookData.difficulty || 1) * 10;
  const totalCoins = baseCoins + difficultyBonus;

  if (character.coins === undefined) character.coins = 0;
  character.coins += totalCoins;

  // Inicializar Inventario/Equipado si son nuevos
  if (!character.inventory) character.inventory = [];
  if (!character.equipped) character.equipped = {};

  character.xp += totalXP;

  // Calcular nivel
  while (character.xp >= character.xpToNextLevel) {
    character.xp -= character.xpToNextLevel;
    character.level += 1;
    character.xpToNextLevel = Math.floor(character.xpToNextLevel * 1.5); // Aumenta exponencialmente
  }

  // Guardar historial de libros
  if (!character.booksHistory) {
    character.booksHistory = [];
  }
  character.booksHistory.push({
    id: bookId,
    title: bookData.title,
    author: bookData.author,
    readAt: new Date().toISOString(),
    xpGained: totalXP,
  });

  return saveCharacter(character);
}

export function getBooksRead() {
  const character = loadCharacter();
  return character?.booksReadIds || [];
}

export function addXPForRecommendations(xpAmount) {
  const character = loadCharacter();
  if (!character) return false;

  // Verificar si ya ganó XP por recomendaciones hoy (evitar spam)
  const today = new Date().toDateString();
  if (!character.lastRecommendationXP) {
    character.lastRecommendationXP = {};
  }

  if (character.lastRecommendationXP.date === today) {
    return false; // Ya ganó XP hoy
  }

  character.xp += xpAmount;
  character.lastRecommendationXP = {
    date: today,
    xp: xpAmount,
  };

  // Calcular nivel
  while (character.xp >= character.xpToNextLevel) {
    character.xp -= character.xpToNextLevel;
    character.level += 1;
    character.xpToNextLevel = Math.floor(character.xpToNextLevel * 1.5);
  }

  return saveCharacter(character);
}

export function purchaseItem(item) {
  const character = loadCharacter();
  if (!character) return { success: false, message: "No se encontró el personaje" };

  if ((character.coins || 0) < item.price) {
    return { success: false, message: "No tienes suficiente Lumina" };
  }

  // Manejar verificación de inventario para No-Consumibles
  if (item.type !== 'consumable') {
    if (!character.inventory) character.inventory = [];
    if (character.inventory.includes(item.id)) {
      return { success: false, message: "Ya posees este objeto" };
    }
    character.inventory.push(item.id);
  }

  // Deducir Costo
  character.coins -= item.price;

  // Manejar efectos de consumibles
  if (item.type === 'consumable') {
    if (item.effect === 'level_up') {
      character.level += 1;
      character.xp = 0; // Restablecer XP para el nuevo nivel
      character.xpToNextLevel = Math.floor(character.xpToNextLevel * 1.5);
    } else if (item.effect === 'xp_boost') {
      character.xp += (item.value || 500);
      // Verificar subida de nivel por potenciador
      while (character.xp >= character.xpToNextLevel) {
        character.xp -= character.xpToNextLevel;
        character.level += 1;
        character.xpToNextLevel = Math.floor(character.xpToNextLevel * 1.5);
      }
    }
  }

  saveCharacter(character);

  const msg = item.type === 'consumable'
    ? `¡Efecto aplicado: ${item.name}!`
    : "¡Compra exitosa!";

  return { success: true, message: msg, coins: character.coins };
}

export function equipItem(category, itemId) {
  const character = loadCharacter();
  if (!character) return false;

  if (!character.equipped) character.equipped = {};

  // Si itemId es nulo, desequipar
  if (itemId === null) {
    delete character.equipped[category];
  } else {
    // Verificar propiedad
    if (!character.inventory?.includes(itemId)) return false;
    character.equipped[category] = itemId;
  }

  return saveCharacter(character);
}

export function addCoins(amount) {
  const character = loadCharacter();
  if (!character) return false;
  character.coins = (character.coins || 0) + amount;
  return saveCharacter(character);
}

