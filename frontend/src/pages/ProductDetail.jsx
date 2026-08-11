import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { useCart } from "../context/CartContext";

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
        <Link to="/" className="text-indigo-600 hover:underline">
          Back to products
        </Link>
      </div>
    );
  }

  if (!product) {
    return <p className="text-gray-500 dark:text-gray-400">Loading...</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 gap-8">
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        {product.images?.[0] && (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        )}
      </div>

      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{product.category}</p>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{product.name}</h1>
        <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          ${product.price.toFixed(2)}
        </p>
        <p className="mt-4 text-gray-600 dark:text-gray-300">{product.description}</p>

        {product.stock > 0 ? (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{product.stock} in stock</p>
        ) : (
          <p className="mt-4 text-sm text-red-600">Out of stock</p>
        )}

        {product.stock > 0 && (
          <div className="mt-4 flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))
              }
              className="w-20 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
            />
            <button
              type="button"
              onClick={handleAddToCart}
              className="rounded-md bg-indigo-600 text-white px-4 py-2 font-medium hover:bg-indigo-700"
            >
              Add to cart
            </button>
          </div>
        )}

        {added && (
          <p className="mt-3 text-sm text-green-600">
            Added to cart.{" "}
            <button type="button" onClick={() => navigate("/cart")} className="underline">
              View cart
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
