// src/App.jsx
import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import HeroBanner from './components/Layout/HeroBanner';
import ProductCard from './components/Product/ProductCard';
import ProductModal from './components/Product/ProductModal';
import CartSidebar from './components/Cart/CartSidebar';
import AdminPanel from './components/Admin/AdminPanel';
import { useCart } from './hooks/useCart';
import { fetchProducts } from './lib/supabaseClient';

function StorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { items, isOpen, setIsOpen, addItem, removeItem, updateQty, clearCart, total, count } = useCart();

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, activeCategory]);

  const handleSearch = (query, category) => {
    if (query !== undefined) setSearchQuery(query);
    if (category !== undefined) setActiveCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartCount={count}
        onCartOpen={() => setIsOpen(true)}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />

      <main>
        <HeroBanner />

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Section title */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">
                {activeCategory === 'All' ? 'Barcha mahsulotlar' : activeCategory}
              </h2>
              <p className="text-gray-500 text-sm mt-1">{filtered.length} ta mahsulot topildi</p>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-sm text-brand hover:underline font-medium"
              >
                Tozalash ×
              </button>
            )}
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                  <div className="aspect-[3/4] bg-gray-100" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                    <div className="h-8 bg-gray-100 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-gray-700">Mahsulot topilmadi</h3>
              <p className="text-gray-400 text-sm mt-1">Boshqa so'z bilan qidiring</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {filtered.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onView={setSelectedProduct}
                  onAddToCart={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p className="font-black text-gray-900 text-lg mb-1">Vela<span className="text-brand">Shop</span></p>
          <p>© 2025 VelaShop. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addItem}
        />
      )}

      {/* Cart Sidebar */}
      {isOpen && (
        <CartSidebar
          items={items}
          total={total}
          onClose={() => setIsOpen(false)}
          onRemove={removeItem}
          onUpdateQty={updateQty}
          onClear={clearCart}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StorePage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}
