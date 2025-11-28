// src/utils/favorites.js

/**
 * Get all favorite products (full objects) from localStorage
 */
export const getFavorites = () => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("favoriteProducts");
  return stored ? JSON.parse(stored) : [];
};

/**
 * Check if a product is favorited by ID
 */
export const isFavorite = (productId) => {
  return getFavorites().some((p) => p._id === productId);
};

/**
 * Toggle favorite: Add full product if not exists, remove if exists
 * Returns: { added: true/false, favorites: updatedArray }
 */
export const toggleFavorite = (product) => {
  const favorites = getFavorites();
  const existsIndex = favorites.findIndex((p) => p._id === product._id);

  let updatedFavorites;
  let added;

  if (existsIndex !== -1) {
    // Remove
    updatedFavorites = favorites.filter((_, i) => i !== existsIndex);
    added = false;
  } else {
    // Add full product
    updatedFavorites = [...favorites, { ...product }];
    added = true;
  }

  localStorage.setItem("favoriteProducts", JSON.stringify(updatedFavorites));
  return { added, favorites: updatedFavorites };
};

/**
 * Remove favorite by ID
 */
export const removeFavorite = (productId) => {
  const favorites = getFavorites();
  const updated = favorites.filter((p) => p._id !== productId);
  localStorage.setItem("favoriteProducts", JSON.stringify(updated));
  return updated;
};
