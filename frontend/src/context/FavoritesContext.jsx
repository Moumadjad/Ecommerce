import { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext(null);
const STORAGE_KEY = "favorites";

function readStoredFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [items, setItems] = useState(readStoredFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function isFavorite(productId) {
    return items.some((item) => item.productId === productId);
  }

  function toggleFavorite(product) {
    setItems((prev) =>
      prev.some((item) => item.productId === product._id)
        ? prev.filter((item) => item.productId !== product._id)
        : [
            ...prev,
            {
              productId: product._id,
              name: product.name,
              price: product.price,
              image: product.images?.[0],
              category: typeof product.category === "object" ? product.category?.name : product.category,
              stock: product.stock,
            },
          ]
    );
  }

  function removeFavorite(productId) {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }

  return (
    <FavoritesContext.Provider value={{ items, isFavorite, toggleFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
}
