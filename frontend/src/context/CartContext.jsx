import { createContext, useContext, useEffect, useRef, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const STORAGE_KEY = "cart";

function readStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function mapServerCart(cart) {
  return cart.items
    .filter((item) => item.product)
    .map((item) => ({
      productId: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.images?.[0],
      stock: item.product.stock,
      quantity: item.quantity,
    }));
}

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState(readStoredCart);
  const syncedForUser = useRef(null);

  // Once logged in, the server cart is the source of truth. Any items added
  // as a guest (localStorage) are merged into it once, on first login.
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      syncedForUser.current = null;
      setItems(readStoredCart());
      return;
    }

    if (syncedForUser.current === user.id) return;
    syncedForUser.current = user.id;

    const guestItems = readStoredCart();

    async function sync() {
      try {
        if (guestItems.length > 0) {
          const { data } = await api.post("/cart/merge", {
            items: guestItems.map((item) => ({ product: item.productId, quantity: item.quantity })),
          });
          localStorage.removeItem(STORAGE_KEY);
          setItems(mapServerCart(data.cart));
        } else {
          const { data } = await api.get("/cart");
          setItems(mapServerCart(data.cart));
        }
      } catch {
        // Network/API hiccup: leave the guest cart as-is rather than losing it.
      }
    }

    sync();
  }, [user, authLoading]);

  // Guests persist to localStorage; logged-in users are backed by the server.
  useEffect(() => {
    if (!user) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, user]);

  async function addToCart(product, quantity = 1) {
    if (user) {
      try {
        const { data } = await api.post("/cart/items", { product: product._id, quantity });
        setItems(mapServerCart(data.cart));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to add item to cart");
      }
      return;
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      const maxQty = product.stock;

      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, maxQty);
        return prev.map((item) =>
          item.productId === product._id ? { ...item, quantity: nextQty } : item
        );
      }

      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0],
          stock: product.stock,
          quantity: Math.min(quantity, maxQty),
        },
      ];
    });
  }

  async function updateQuantity(productId, quantity) {
    if (user) {
      try {
        const { data } = await api.put(`/cart/items/${productId}`, { quantity });
        setItems(mapServerCart(data.cart));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to update quantity");
      }
      return;
    }

    setItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  async function removeFromCart(productId) {
    if (user) {
      try {
        const { data } = await api.delete(`/cart/items/${productId}`);
        setItems(mapServerCart(data.cart));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to remove item");
      }
      return;
    }

    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }

  async function clearCart() {
    if (user) {
      try {
        await api.delete("/cart");
      } catch {
        // Best-effort: the order was already created either way.
      }
    }
    setItems([]);
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
