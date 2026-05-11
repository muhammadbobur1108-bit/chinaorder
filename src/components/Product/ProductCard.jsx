// src/components/Product/ProductCard.jsx
import { ShoppingCart, Star } from 'lucide-react';

const formatPrice = (p) => new Intl.NumberFormat('uz-UZ').format(p) + " so'm";
const installment = (price) => Math.round(price / 12);

export default function ProductCard({ product, onView, onAddToCart }) {
  const img = product.images?.[0] || 'https://via.placeholder.com/400x500?text=No+Image';
  const discount = product.old_price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : null;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-[3/4]" onClick={() => onView(product)}>
        <img
          src={img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-bold px-3 py-1 rounded-full text-sm">Tugadi</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 gap-1.5">
        {/* Rating */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-gray-700">{product.rating}</span>
          <span>({product.review_count})</span>
        </div>

        {/* Name */}
        <h3
          className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-brand transition cursor-pointer"
          onClick={() => onView(product)}
        >
          {product.name}
        </h3>

        {/* Installment badge */}
        <div className="inline-flex items-center gap-1 bg-brand/10 text-brand text-xs font-semibold px-2 py-0.5 rounded-full w-fit">
          <span>📦</span>
          <span>Oyiga {formatPrice(installment(product.price))}</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-base font-black text-gray-900">{formatPrice(product.price)}</span>
          {product.old_price && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(product.old_price)}</span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={() => onView(product)}
          disabled={!product.in_stock}
          className="w-full flex items-center justify-center gap-2 bg-brand text-white font-semibold text-sm py-2 rounded-xl hover:bg-purple-700 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed mt-1"
        >
          <ShoppingCart className="w-4 h-4" />
          Savatga
        </button>
      </div>
    </div>
  );
}
