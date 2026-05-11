// src/components/Product/ProductModal.jsx
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react';

const formatPrice = (p) => new Intl.NumberFormat('uz-UZ').format(p) + " so'm";

export default function ProductModal({ product, onClose, onAddToCart }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);

  const images = product.images?.length ? product.images : ['https://via.placeholder.com/600x700?text=No+Image'];

  const handleAdd = () => {
    if (!selectedSize) { setSizeError(true); return; }
    onAddToCart(product, selectedSize);
    onClose();
  };

  const prev = () => setImgIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setImgIdx(i => (i + 1) % images.length);

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white w-full md:max-w-3xl md:rounded-2xl rounded-t-2xl max-h-[95vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="font-bold text-gray-800 text-lg line-clamp-1">{product.name}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-0">
          {/* Image gallery */}
          <div className="md:w-1/2">
            <div className="relative bg-gray-50 aspect-square">
              <img src={images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
              {images.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-2 rounded-full shadow hover:bg-white transition">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-2 rounded-full shadow hover:bg-white transition">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`w-2 h-2 rounded-full transition ${i === imgIdx ? 'bg-brand w-5' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${i === imgIdx ? 'border-brand' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-5 flex flex-col gap-4">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.rating} ({product.review_count} izoh)</span>
            </div>

            {/* Price */}
            <div>
              <div className="text-3xl font-black text-gray-900">{formatPrice(product.price)}</div>
              {product.old_price && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-400 line-through text-sm">{formatPrice(product.old_price)}</span>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    -{Math.round((1 - product.price / product.old_price) * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Installment */}
            <div className="bg-brand/10 rounded-xl p-3 text-sm">
              <span className="font-semibold text-brand">12 oyga bo'lib to'lash:</span>
              <span className="text-gray-700 ml-1">{formatPrice(Math.round(product.price / 12))} / oy</span>
            </div>

            {/* Size selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-700 text-sm">O'lcham tanlang</span>
                {sizeError && <span className="text-red-500 text-xs">O'lchamni tanlang!</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map(size => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`px-3 py-1.5 rounded-lg border-2 text-sm font-semibold transition ${
                      selectedSize === size
                        ? 'border-brand bg-brand text-white'
                        : 'border-gray-200 hover:border-brand text-gray-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h4 className="font-semibold text-gray-700 text-sm mb-1">Tavsif</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 bg-brand text-white font-bold py-3 rounded-xl hover:bg-purple-700 active:scale-95 transition mt-auto"
            >
              <ShoppingCart className="w-5 h-5" />
              Savatga qo'shish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
