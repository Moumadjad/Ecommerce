import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/client";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  images: "",
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing) return;

    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        const p = data.product;
        setForm({
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          stock: p.stock,
          images: (p.images || []).join(", "),
        });
      })
      .catch(() => setError("Failed to load product"))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {isEditing ? "Edit product" : "New product"}
      </h2>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded px-3 py-2">{error}</p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
        <input
          type="text"
          name="name"
          required
          value={form.name}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          name="description"
          required
          rows={3}
          value={form.description}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Price ($)
          </label>
          <input
            type="number"
            name="price"
            required
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label>
          <input
            type="number"
            name="stock"
            required
            min="0"
            value={form.stock}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
        <input
          type="text"
          name="category"
          required
          value={form.category}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Image URLs (comma-separated)
        </label>
        <input
          type="text"
          name="images"
          value={form.images}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-indigo-600 text-white px-5 py-2.5 font-medium hover:bg-indigo-700 disabled:opacity-50"
      >
        {submitting ? "Saving..." : isEditing ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
