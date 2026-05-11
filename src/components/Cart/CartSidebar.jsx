// src/components/Cart/CartSidebar.jsx
import { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Send } from 'lucide-react';

const formatPrice = (p) => new Intl.NumberFormat('uz-UZ').format(p) + " so'm";

const TELEGRAM_USERNAME = 'your_telegram_username'; // 🔧 Change this

export default function CartSidebar({ items, total, onClose, onRemove, onUpdateQty, onClear }) {
  const [checkout, setCheckout] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleOrder = () => {
    if (!form.name || !form.phone) return;
    setSending(true);

    // Build Telegram message
    const lines = items.map(i =>
      `• ${i.product.name} (${i.size}) x${i.qty} = ${formatPrice(i.product.price * i.qty)}`
    );
    const message = [
      '🛍 *Yangi Buyurtma!*',
      '',
      `👤 Ism: ${form.name}`,
      `📞 Telefon: ${form.phone}`,
      form.address ? `📍 Manzil: ${form.address}` : '',
      '',
      '*Mahsulotlar:*',
      ...lines,
      '',
      `💰 *Jami: ${formatPrice(total)}*`,
    ].filter(Boolean).join('\n');

    const encoded = encodeURIComponent(message);
    const telegramUrl = `https://t.me/${TELEGRAM_USERNAME}?text=${encoded}`;

    setTimeout(() => {
      window.open(telegramUrl, '_blank');
      setSending(false);
      setSent(true);
      onClear();
    }, 800);
  };

  if (sent) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Buyurtma jo'natildi!</h2>
        <p className="text-gray-500 text-sm mb-6">Telegram orqali siz bilan bog'lanamiz.</p>
        <button onClick={onClose} className="bg-brand text-white font-bold px-6 py-3 rounded-xl hover:bg-purple-700 transition">
          Yopish
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      {/* Backdrop */}
      <div className="flex-1 bg-black/50 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand" />
            <h2 className="font-black text-lg text-gray-900">Savat</h2>
            {items.length > 0 && (
              <span className="bg-brand text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {items.reduce((s, i) => s + i.qty, 0)}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
              <p className="text-gray-400 font-medium">Savat bo'sh</p>
              <p className="text-gray-300 text-sm mt-1">Mahsulotlarni qo'shing</p>
            </div>
          ) : checkout ? (
            /* Checkout form */
            <div className="p-5 flex flex-col gap-4">
              <h3 className="font-bold text-gray-800">Ma'lumotlaringizni kiriting</h3>
              {[
                { key: 'name', label: 'Ismingiz *', placeholder: 'Ism Familiya', type: 'text' },
                { key: 'phone', label: 'Telefon raqam *', placeholder: '+998 90 000 00 00', type: 'tel' },
                { key: 'address', label: 'Manzil', placeholder: "Toshkent, ...", type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition"
                  />
                </div>
              ))}

              {/* Order summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-700 text-sm mb-2">Buyurtma:</h4>
                {items.map(i => (
                  <div key={i.key} className="flex justify-between text-sm text-gray-600 py-1">
                    <span className="line-clamp-1 flex-1">{i.product.name} ({i.size}) ×{i.qty}</span>
                    <span className="font-semibold shrink-0 ml-2">{formatPrice(i.product.price * i.qty)}</span>
                  </div>
                ))}
                <div className="border-t mt-2 pt-2 flex justify-between font-black text-gray-900">
                  <span>Jami</span>
                  <span className="text-brand">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Cart items */
            <div className="p-4 flex flex-col gap-3">
              {items.map(item => (
                <div key={item.key} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                  <img
                    src={item.product.images?.[0] || 'https://via.placeholder.com/80'}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">O'lcham: <span className="font-bold text-brand">{item.size}</span></p>
                    <p className="font-black text-sm text-gray-900 mt-1">{formatPrice(item.product.price)}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => onRemove(item.key)} className="p-1 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg">
                      <button onClick={() => onUpdateQty(item.key, item.qty - 1)} className="p-1 hover:bg-gray-100 rounded-l-lg transition">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.key, item.qty + 1)} className="p-1 hover:bg-gray-100 rounded-r-lg transition">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Jami summa:</span>
              <span className="text-xl font-black text-brand">{formatPrice(total)}</span>
            </div>

            {checkout ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setCheckout(false)}
                  className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition"
                >
                  ← Orqaga
                </button>
                <button
                  onClick={handleOrder}
                  disabled={sending || !form.name || !form.phone}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 active:scale-95 transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {sending ? 'Yuborilmoqda...' : 'Buyurtma berish'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCheckout(true)}
                className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-purple-700 active:scale-95 transition"
              >
                Rasmiylashtirish →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
