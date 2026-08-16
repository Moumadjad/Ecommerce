import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { useCart } from "../context/CartContext";
import { btn, input, link } from "../lib/ui";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setError("");
    setProduct(null);
    api
      .get(`/products/${id}`)
      .then(({ data }) => setProduct(data.product))
      .catch(() => setError("Product not found"));
  }, [id]);

  function handleAddToCart() {
    addToCart(product, quantity);
    setAdded(true);
  }

  if (error) {
    return (
      <div>
        <p className="text-red-600">{error}</p>
        <Link to="/" className={link()}>
          Back to products
        </Link>
      </div>
    );
  }

  if (!product) {
    return <p className="text-gray-500 dark:text-gray-400">Loading...</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 gap-10">
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
        {product.images?.[0] && (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        )}
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
          {product.category?.name}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {product.name}
        </h1>
        <p className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
          ${product.price.toFixed(2)}
        </p>
        <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>

        {product.stock > 0 ? (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{product.stock} in stock</p>
        ) : (
          <p className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">Out of stock</p>
        )}

        {product.stock > 0 && (
          <div className="mt-6 flex items-center gap-3">
            <div className="w-20 shrink-0">
              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))
                }
                className={input()}
              />
            </div>
            <button type="button" onClick={handleAddToCart} className={btn("primary", "lg", "shrink-0")}>
              Add to cart
            </button>
          </div>
        )}

        {added && (
          <p className="mt-4 text-sm text-green-600 dark:text-green-400">
            Added to cart.{" "}
            <button type="button" onClick={() => navigate("/cart")} className="underline underline-offset-2">
              View cart
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
