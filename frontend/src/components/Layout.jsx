import { Outlet, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartBar from "./CartBar";
import Navbar from "./Navbar";

export default function Layout() {
  const { items } = useCart();
  const location = useLocation();
  const showCartBar = items.length > 0 && location.pathname !== "/cart";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className={`max-w-7xl mx-auto px-4 pt-10 ${showCartBar ? "pb-28" : "pb-10"}`}>
        <Outlet />
      </main>
      <CartBar />
    </div>
  );
}
