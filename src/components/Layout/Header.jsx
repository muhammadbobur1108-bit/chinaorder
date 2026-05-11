// src/components/Layout/Header.jsx
import { useState } from 'react';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';

export default function Header({ cartCount, onCartOpen, onSearch, searchQuery }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const categories = ['All', 'Shirts', 'Trousers', 'Dresses', 'Jackets', 'Knitwear'];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <span className="text-white font-black text-sm">V</span>
          </div>
          <span className="font-black text-xl tracking-tight text-gray-900">
            Vela<span className="text-brand">Shop</span>
          </span>
        </a>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Mahsulot qidirish..."
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm transition"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search toggle */}
          <button
            onClick={() => setSearchOpen(s => !s)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          <a
            href="/admin"
            className="hidden sm:flex p-2 rounded-xl hover:bg-gray-100 transition"
            title="Admin Panel"
          >
            <User className="w-5 h-5 text-gray-600" />
          </a>

          {/* Cart */}
          <button
            onClick={onCartOpen}
            className="relative p-2 rounded-xl hover:bg-gray-100 transition"
          >
            <ShoppingBag className="w-5 h-5 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu */}
          <button
            onClick={() => setMenuOpen(s => !s)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Mahsulot qidirish..."
              value={searchQuery}
              onChange={e => onSearch(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm transition"
            />
          </div>
        </div>
      )}

      {/* Category nav */}
      <nav className="border-t border-gray-100 bg-white overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 py-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onSearch('', cat)}
              className="shrink-0 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-brand hover:text-white transition whitespace-nowrap text-gray-600"
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
