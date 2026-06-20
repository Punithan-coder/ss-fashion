import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/helpers';
import { API_BASE_URL, getImageUrl } from '../config';

interface AdminProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  images: string[];
  description?: string;
  stock: number;
  shippingCost?: number;
  active: boolean;
  addedAt: string;
}

const categories = [
  'Dresses',
  'Kurtis',
  'Sarees',
  'Tops',
  'Shirts',
  'Jeans',
  'Ethnic Wear',
  'Western Wear',
  'Co-ords',
];

const defaultForm = {
  name: '',
  price: 0,
  category: 'Dresses',
  image: '',
  images: [] as string[],
  stock: 0,
  shippingCost: 0,
  active: true,
  description: '',
};

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('ssfashion-admin-token');

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchProducts();
  }, [navigate, token]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      setError('Unable to load inventory.');
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (key: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const readImageFile = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    });
  };

const handleFileChange = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const files = Array.from(event.target.files || []);

  if (files.length === 0) return;

  const maxSize = 10 * 1024 * 1024; // 10MB

  for (const file of files) {
    if (file.size > maxSize) {
      setError('Image size must be less than 10MB');
      event.target.value = '';
      return;
    }
  }

 

  const existingImages = form.images || [];

    const allowedCount = Math.min(10 - existingImages.length, files.length);
    const selectedFiles = files.slice(0, allowedCount);
    const newImages = await Promise.all(selectedFiles.map(readImageFile));
    const images = [...existingImages, ...newImages].slice(0, 10);

    setForm((prev) => ({
      ...prev,
      images,
      image: images[0] || prev.image,
    }));
    setImagePreview(images[0] || '');
    setError('');
    event.target.value = '';
  };

  const handleImageRemove = (index: number) => {
    const images = (form.images || []).filter((_, i) => i !== index);
    setForm((prev) => ({
      ...prev,
      images,
      image: images[0] || '',
    }));
    if (images.length) {
      setImagePreview(images[0]);
    } else {
      setImagePreview('');
    }
    setError('');
  };

  const handleSetFeatured = (index: number) => {
    const images = [...(form.images || [])];
    if (index < 0 || index >= images.length) return;
    const [selected] = images.splice(index, 1);
    images.unshift(selected);
    setForm((prev) => ({
      ...prev,
      images,
      image: selected,
    }));
    setImagePreview(selected);
    setError('');
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      return;
    }

    const images = [...(form.images || [])];
    const [movedImage] = images.splice(draggedIndex, 1);
    images.splice(index, 0, movedImage);

    setForm((prev) => ({
      ...prev,
      images,
      image: images[0] || prev.image,
    }));
    setImagePreview(images[0] || '');
    setDraggedIndex(null);
  };

  const handleSelect = (product: AdminProduct) => {
    const images = product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];

    setSelectedId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      image: images[0] || product.image,
      images,
      stock: product.stock,
      shippingCost: product.shippingCost || 0,
      active: product.active,
      description: product.description || '',
    });
    setImageFile(null);
    setImagePreview(images[0] || product.image || '');
    setStatusMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSelectedId(null);
    setForm(defaultForm);
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setStatusMessage('');
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return navigate('/admin');
    if (!form.images || form.images.length === 0) {
      setError('Please upload at least one product image.');
      return;
    }

    const normalizedForm = {
      ...form,
      image: form.images[0],
      images: form.images.slice(0, 10),
    };

    const url = selectedId ? `${API_BASE_URL}/api/products/${selectedId}` : `${API_BASE_URL}/api/products`;
    const method = selectedId ? 'PUT' : 'POST';

    setIsSubmitting(true);
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(normalizedForm),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Unable to save product.');
        return;
      }

      const message = selectedId ? 'Product updated successfully.' : 'Product added successfully.';
      setStatusMessage(message);

      const savedProduct = data.product;
      setProducts((prev) => {
        if (selectedId) {
          return prev.map((product) => (product.id === savedProduct.id ? savedProduct : product));
        }
        return [savedProduct, ...prev];
      });

      handleReset();
    } catch (err) {
      setError('Unable to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return navigate('/admin');
    if (!window.confirm('Delete this product from inventory?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        setError('Unable to delete product.');
        return;
      }
      setProducts((prev) => prev.filter((product) => product.id !== id));
      setStatusMessage('Product removed from inventory.');
    } catch (err) {
      setError('Unable to delete product.');
    }
  };

  const logout = () => {
    localStorage.removeItem('ssfashion-admin-token');
    navigate('/admin');
  };

  const recentAdditions = [...products]
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, 5);

  const total = products.length;
  const activeCount = products.filter((product) => product.active).length;
  const outOfStockCount = products.filter((product) => product.stock <= 0).length;

  return (
    <div className="page min-h-screen bg-lavender-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-rose-600 mb-2">Admin Panel</p>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">Product Management</h1>
            <p className="text-stone-600 mt-2">Manage inventory, pricing, stock and collections from a secure dashboard.</p>
          </div>
          <button onClick={logout} className="btn-luxury-secondary rounded-full px-6 py-3 self-start md:self-auto">
            Log out
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <div className="bg-white rounded-[28px] p-6 shadow-lg">
            <p className="text-sm uppercase tracking-[0.35em] text-rose-600 mb-3">Total Products</p>
            <p className="text-4xl font-semibold text-stone-900">{total}</p>
          </div>
          <div className="bg-white rounded-[28px] p-6 shadow-lg">
            <p className="text-sm uppercase tracking-[0.35em] text-rose-600 mb-3">Active Products</p>
            <p className="text-4xl font-semibold text-stone-900">{activeCount}</p>
          </div>
          <div className="bg-white rounded-[28px] p-6 shadow-lg">
            <p className="text-sm uppercase tracking-[0.35em] text-rose-600 mb-3">Out of Stock</p>
            <p className="text-4xl font-semibold text-stone-900">{outOfStockCount}</p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div className="bg-white rounded-[32px] p-4 sm:p-8 shadow-xl">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-rose-600 mb-2">Inventory</p>
                <h2 className="text-xl sm:text-3xl font-semibold text-stone-900">Add or edit a product</h2>
              </div>
              <button onClick={handleReset} className="btn-luxury-secondary rounded-full px-5 py-3 self-start sm:self-auto">
                New Product
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm text-stone-700">
                  Product Name
                  <input
                    value={form.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    className="w-full rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm text-stone-700">
                  Price (₹)
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => updateForm('price', Number(e.target.value))}
                    className="w-full rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm text-stone-700">
                  Shipping Cost (₹)
                  <input
                    type="number"
                    value={form.shippingCost}
                    onChange={(e) => updateForm('shippingCost', Number(e.target.value))}
                    className="w-full rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm text-stone-700">
                  Category
                  <select
                    value={form.category}
                    onChange={(e) => updateForm('category', e.target.value)}
                    className="w-full rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm text-stone-700">
                  Stock Quantity
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => updateForm('stock', Number(e.target.value))}
                    className="w-full rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    required
                  />
                </label>
              </div>

              <div className="space-y-4 text-sm text-stone-700">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="block font-semibold text-stone-900">Product Images</p>
                    <p className="text-xs text-stone-500">Upload up to 10 product shots, then drag to reorder and select the featured image.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center justify-center rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 transition"
                  >
                    Add More Images
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="rounded-[28px] border border-rose-200 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.35em] text-rose-600">
                    <span>{form.images?.length || 0} / 10 images added</span>
                    <span>{form.images?.length ? 'Drag to reorder' : 'Upload your first images'}</span>
                  </div>

                  {form.images?.length ? (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {form.images.map((src, index) => (
                        <div
                          key={`${src}-${index}`}
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={(event) => handleDragOver(event, index)}
                          onDrop={() => handleDrop(index)}
                          className={`group rounded-[24px] border p-3 shadow-sm transition ${draggedIndex === index ? 'border-rose-500 bg-rose-50' : 'border-rose-100 bg-white hover:border-rose-200'}`}
                        >
                          <div className="relative overflow-hidden rounded-3xl bg-stone-100">
                            <img src={getImageUrl(src)} alt={`Product image ${index + 1}`} className="h-40 w-full object-cover" />
                          </div>
                          <div className="mt-3 flex flex-col gap-2 text-sm">
                            <div className="flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => handleSetFeatured(index)}
                                className={`rounded-full px-3 py-2 text-xs font-semibold transition ${index === 0 ? 'bg-rose-100 text-rose-700' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
                              >
                                {index === 0 ? 'Featured' : 'Set as Featured'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleImageRemove(index)}
                                className="rounded-full bg-stone-100 px-3 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200"
                              >
                                Remove
                              </button>
                            </div>
                            <span className="text-xs text-stone-500">{index === 0 ? 'Primary display image' : `Image ${index + 1}`}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center rounded-[24px] border-dashed border-rose-200 bg-rose-50 text-center text-sm text-stone-500">
                      No images added yet. Click “Add More Images” to select files from your device.
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm text-stone-700">
                  Active Product
                  <select
                    value={form.active ? 'true' : 'false'}
                    onChange={(e) => updateForm('active', e.target.value === 'true')}
                    className="w-full rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </label>
              </div>

              <label className="space-y-2 text-sm text-stone-700">
                Description
                <textarea
                  value={form.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  rows={4}
                  className="w-full rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </label>

              {error && <p className="text-rose-600">{error}</p>}
              {statusMessage && <p className="text-rose-700 font-semibold">{statusMessage}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-luxury w-full rounded-full px-6 py-4 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Saving...' : selectedId ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-[32px] p-8 shadow-xl overflow-x-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-rose-600 mb-2">Inventory List</p>
                  <h2 className="text-2xl font-semibold text-stone-900">Manage Products</h2>
                </div>
              </div>

              {loading ? (
                <p className="text-stone-600">Loading products...</p>
              ) : products.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-rose-200 bg-rose-50 p-10 text-center">
                  <p className="text-lg font-semibold text-stone-900 mb-2">No inventory items yet.</p>
                  <p className="text-sm text-stone-500">Add your first product using the form on the left to begin building your collection.</p>
                </div>
              ) : (
                <div className="grid gap-5">
                  {products.map((product) => (
                    <div key={product.id} className="card-luxury bg-white p-6 shadow-xl">
                      <div className="grid gap-4 md:grid-cols-[110px_minmax(0,1fr)]">
                        <div className="overflow-hidden rounded-[28px] bg-rose-50">
                          <img
                            src={getImageUrl(product.image || product.images?.[0] || '')}
                            alt={product.name}
                            className="h-full w-full object-cover min-h-[120px]"
                          />
                        </div>
                        <div className="flex flex-col justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.35em] text-rose-500 mb-2">{product.category}</p>
                            <h3 className="text-xl font-semibold text-stone-900">{product.name}</h3>
                            <p className="mt-2 text-sm text-stone-500 line-clamp-2">{product.description || 'No description provided.'}</p>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm text-stone-500">Price</p>
                              <p className="text-lg font-semibold text-stone-900">{formatPrice(product.price)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-stone-500">Stock</p>
                              <p className="text-lg font-semibold text-stone-900">{product.stock}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-rose-100 pt-5">
                        <span className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${product.active ? 'bg-rose-100 text-rose-700' : 'bg-stone-100 text-stone-500'}`}>
                          {product.active ? 'Active' : 'Inactive'}
                        </span>
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => handleSelect(product)}
                            className="btn-luxury-secondary rounded-full px-4 py-3"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product.id)}
                            className="btn-luxury rounded-full px-4 py-3"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-xl">
              <p className="text-sm uppercase tracking-[0.35em] text-rose-600 mb-4">Recent additions</p>
              <div className="space-y-4">
                {recentAdditions.map((product) => (
                  <div key={product.id} className="rounded-3xl bg-rose-50 p-5">
                    <p className="font-semibold text-stone-900">{product.name}</p>
                    <p className="text-sm text-stone-600">{product.category} • {formatPrice(product.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
