import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useFavorites } from "../context/FavoritesContext";
import { link } from "../lib/ui";

export default function Favorites() {
  const { items } = useFavorites();

  const products = items.map((item) => ({
    _id: item.productId,
    name: item.name,
    price: item.price,
    images: item.image ? [item.image] : [],
    category: item.category,
    stock: item.stock,
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">
        Favorites
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No favorites yet.{" "}
          <Link to="/" className={link()}>
            Browse products
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
