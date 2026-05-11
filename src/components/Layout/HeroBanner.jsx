// src/components/Layout/HeroBanner.jsx
export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand via-purple-600 to-indigo-700 text-white">
      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20 flex flex-col md:flex-row items-center gap-8">
        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <span className="inline-block bg-white/20 backdrop-blur text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wider uppercase">
            Yangi Kolleksiya 2025
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
            Zamonaviy<br />
            <span className="text-yellow-300">Moda</span> Dunyosi
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-md">
            Eng so'nggi trendlar va premium sifatli kiyimlar sizni kutmoqda. Hozir xarid qiling!
          </p>
          <div className="flex gap-3 justify-center md:justify-start flex-wrap">
            <button className="bg-white text-brand font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 hover:text-gray-900 transition shadow-lg">
              Xarid qilish →
            </button>
            <button className="border border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition">
              Ko'proq bilish
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 md:flex-col">
          {[
            { val: '10K+', label: "Mijozlar" },
            { val: '500+', label: "Mahsulotlar" },
            { val: '4.9★', label: "Reyting" },
          ].map(s => (
            <div key={s.label} className="text-center bg-white/15 backdrop-blur rounded-2xl px-6 py-4 border border-white/20">
              <div className="text-2xl font-black text-yellow-300">{s.val}</div>
              <div className="text-white/70 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
