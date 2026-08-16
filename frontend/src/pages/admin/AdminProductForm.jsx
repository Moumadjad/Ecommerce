import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/client";
import { btn, card, input, label as labelClass } from "../../lib/ui";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  images: "",
  isActive: true,
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get("/categories", { params: { includeInactive: true } })
      .then(({ data }) => setCategories(data.categories))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEditing) return;

    api
      .get(`/products/${id}`, { params: { includeInactive: true } })
      .then(({ data }) => {
        const p = data.product;
        setForm({
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category?._id || "",
          stock: p.stock,
          images: (p.images || []).join(", "),
          isActive: p.isActive,
        });
      })
      .catch(() => setError("Failed to load product"))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  function handleChange(e) {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock),
      isActive: form.isActive,
      images: form.images
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean),
    };

    try {
      if (isEditing) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-gray-500 dark:text-gray-400">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">
        {isEditing ? "Edit product" : "New product"}
      </h1>

      <form onSubmit={handleSubmit} className={card("max-w-lg p-6 space-y-4")}>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div>
          <label className={labelClass()}>Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className={input("mt-1")}
          />
        </div>

        <div>
          <label className={labelClass()}>Description</label>
          <textarea
            name="description"
            required
            rows={3}
            value={form.description}
            onChange={handleChange}
            className={input("mt-1")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass()}>Price ($)</label>
            <input
              type="number"
              name="price"
              required
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className={input("mt-1")}
            />
          </div>
          <div>
            <label className={labelClass()}>Stock</label>
            <input
              type="number"
              name="stock"
              required
              min="0"
              value={form.stock}
              onChange={handleChange}
              className={input("mt-1")}
            />
          </div>
        </div>

        <div>
          <label className={labelClass()}>Category</label>
          {categories.length === 0 ? (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No categories yet.{" "}
              <Link to="/admin/categories" className="text-amber-700 dark:text-amber-400 hover:underline">
                Create one first
              </Link>
              .
            </p>
          ) : (
            <select
              name="category"
              required
              value={form.category}
              onChange={handleChange}
              className={input("mt-1")}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                  {!cat.isActive ? " (inactive)" : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className={labelClass()}>Image URLs (comma-separated)</label>
          <input
            type="text"
            name="images"
            value={form.images}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className={input("mt-1")}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 accent-amber-700 focus:ring-1 focus:ring-amber-600 dark:bg-gray-800 cursor-pointer"
          />
          Active (visible to customers)
        </label>

        <button type="submit" disabled={submitting} className={btn("primary")}>
          {submitting ? "Saving..." : isEditing ? "Save changes" : "Create product"}
        </button>
      </form>
    </div>
  );
}
