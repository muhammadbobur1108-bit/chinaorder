// src/components/Admin/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, LogOut, Upload, X, Eye, Package } from 'lucide-react';
import {
  supabase, signIn, signOut, getSession,
  fetchProducts, createProduct, updateProduct, deleteProduct,
  uploadImage
} from '../../lib/supabaseClient';

const SIZES_ALL = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL'];
const CATEGORIES = ['Shirts', 'Trousers', 'Dresses', 'Jackets', 'Knitwear', 'Accessories'];
const formatPrice = (p) => new Intl.NumberFormat('uz-UZ').format(p);

const EMPTY_FORM = {
  name: '', price: '', old_price: '', category: CATEGORIES[0],
  sizes: [], description: '', images: [], in_stock: true
};

export default function AdminPanel() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSession().then(s => { setSession(s); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) loadProducts();
  }, [session]);

  const loadProducts = async () => {
    try { setProducts(await fetchProducts()); }
    catch (e) { console.error(e); }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); setAuthError('');
    try { await signIn(email, password); }
    catch (e) { setAuthError(e.message); }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadImage));
      setForm(f => ({ ...f, images: [...f.images, ...urls] }));
    } catch (e) { alert('Yuklashda xato: ' + e.message); }
    finally { setUploading(false); }
  };

  const removeImage = (idx) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const toggleSize = (size) => {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size]
    }));
  };

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({
      name: p.name, price: p.price, old_price: p.old_price || '',
      category: p.category, sizes: p.sizes || [], description: p.description || '',
      images: p.images || [], in_stock: p.in_stock
    });
    setEditId(p.id); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) return alert("Nom va narx majburiy!");
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        price: parseFloat(form.price),
        old_price: form.old_price ? parseFloat(form.old_price) : null,
        category: form.category,
        sizes: form.sizes,
        description: form.description,
        images: form.images,
        in_stock: form.in_stock,
      };
      if (editId) await updateProduct(editId, payload);
      else await createProduct(payload);
      await loadProducts();
      setShowForm(false);
    } catch (e) { alert('Xato: ' + e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Mahsulotni o'chirishni tasdiqlaysizmi?")) return;
    try { await deleteProduct(id); await loadProducts(); }
    catch (e) { alert('Xato: ' + e.message); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!session) return (
    <div className="min-h-screen bg-gradient-to-br from-brand/5 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Package className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">VelaShop boshqaruvi</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Parol</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none" />
          </div>
          {authError && <p className="text-red-500 text-xs bg-red-50 p-2 rounded-lg">{authError}</p>}
          <button type="submit" className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition">
            Kirish
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">V</span>
            </div>
            <span className="font-black text-lg">VelaShop <span className="text-brand">Admin</span></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">{session.user.email}</span>
            <button onClick={() => signOut()} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-500 transition px-3 py-2 rounded-xl hover:bg-red-50">
              <LogOut className="w-4 h-4" /> Chiqish
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Jami mahsulotlar", val: products.length, icon: '📦' },
            { label: "Aktiv mahsulotlar", val: products.filter(p => p.in_stock).length, icon: '✅' },
            { label: "Kategoriyalar", val: [...new Set(products.map(p => p.category))].length, icon: '🗂' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-black text-gray-900">{s.val}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Products table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b">
            <h2 className="font-bold text-gray-800 text-lg">Mahsulotlar</h2>
            <button onClick={openCreate}
              className="flex items-center gap-2 bg-brand text-white font-semibold px-4 py-2 rounded-xl hover:bg-purple-700 transition text-sm">
              <Plus className="w-4 h-4" /> Qo'shish
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 font-semibold">
                <tr>
                  <th className="text-left px-5 py-3">Mahsulot</th>
                  <th className="text-left px-3 py-3 hidden sm:table-cell">Kategoriya</th>
                  <th className="text-left px-3 py-3">Narx</th>
                  <th className="text-left px-3 py-3 hidden md:table-cell">Holat</th>
                  <th className="text-right px-5 py-3">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0] || ''} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-800 line-clamp-1">{p.name}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{p.sizes?.join(', ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <span className="bg-brand/10 text-brand text-xs font-semibold px-2 py-0.5 rounded-full">{p.category}</span>
                    </td>
                    <td className="px-3 py-3 font-bold text-gray-900">{formatPrice(p.price)}</td>
                    <td className="px-3 py-3 hidden md:table-cell">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.in_stock ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                        {p.in_stock ? 'Mavjud' : 'Tugadi'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <a href="/" target="_blank" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition" title="Ko'rish">
                          <Eye className="w-4 h-4" />
                        </a>
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-brand/10 text-gray-400 hover:text-brand transition">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p>Mahsulotlar topilmadi</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white w-full md:max-w-2xl rounded-t-2xl md:rounded-2xl max-h-[95vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
              <h3 className="font-bold text-lg text-gray-900">{editId ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-5">
              {/* Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rasmlar (max 5)</label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {form.images.length < 5 && (
                    <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-brand text-gray-400 hover:text-brand transition">
                      {uploading ? <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" /> : <><Upload className="w-5 h-5" /><span className="text-xs mt-1">Yuklash</span></>}
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nomi *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none" placeholder="Mahsulot nomi" />
                </div>
                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Narx (so'm) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none" placeholder="189000" />
                </div>
                {/* Old price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Eski narx (ixtiyoriy)</label>
                  <input type="number" value={form.old_price} onChange={e => setForm(f => ({ ...f, old_price: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none" placeholder="249000" />
                </div>
                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Kategoriya</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand outline-none">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                {/* Stock */}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-gray-700">Mavjud</label>
                  <button onClick={() => setForm(f => ({ ...f, in_stock: !f.in_stock }))}
                    className={`w-12 h-6 rounded-full transition-colors relative ${form.in_stock ? 'bg-brand' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.in_stock ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">O'lchamlar</label>
                <div className="flex flex-wrap gap-2">
                  {SIZES_ALL.map(s => (
                    <button key={s} onClick={() => toggleSize(s)}
                      className={`px-3 py-1.5 rounded-lg border-2 text-sm font-semibold transition ${form.sizes.includes(s) ? 'border-brand bg-brand text-white' : 'border-gray-200 text-gray-600 hover:border-brand'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tavsif</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none resize-none"
                  placeholder="Mahsulot haqida batafsil..." />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition">
                  Bekor qilish
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-brand text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-60">
                  {saving ? 'Saqlanmoqda...' : editId ? 'Yangilash' : 'Qo\'shish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
