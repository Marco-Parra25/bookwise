const STORAGE_KEY = "bookwise_character";
const STORAGE_PROFILE_KEY = "bookwise_profile";

export function saveCharacter(character) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(character));
    return true;
  } catch (error) {
    console.error("Error saving character:", error);
    return false;
  }
}

export function loadCharacter() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading character:", error);
    return null;
  }
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error("Error saving profile:", error);
    return false;
  }
}

export function loadProfile() {
  try {
    const data = localStorage.getItem(STORAGE_PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading profile:", error);
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
  const totalXP = baseXP + pagesXP + difficultyXP;

  // Award Lumina Coins
  const baseCoins = 50;
  const difficultyBonus = (bookData.difficulty || 1) * 10;
  const totalCoins = baseCoins + difficultyBonus;

  if (character.coins === undefined) character.coins = 0;
  character.coins += totalCoins;

  // Initialize Inventory/Equipped if new
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
  if (!character) return { success: false, message: "No character found" };

  if ((character.coins || 0) < item.price) {
    return { success: false, message: "No tienes suficiente Lumina" };
  }

  if (!character.inventory) character.inventory = [];
  if (character.inventory.includes(item.id)) {
    return { success: false, message: "Ya posees este objeto" };
  }

  character.coins -= item.price;
  character.inventory.push(item.id);
  saveCharacter(character);
  return { success: true, message: "¡Compra exitosa!", coins: character.coins };
}

export function equipItem(category, itemId) {
  const character = loadCharacter();
  if (!character) return false;

  if (!character.equipped) character.equipped = {};

  // If itemId is null, unequip
  if (itemId === null) {
    delete character.equipped[category];
  } else {
    // Verify ownership
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

