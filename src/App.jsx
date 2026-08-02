import React, { useState, useMemo } from "react";
import { ShoppingBag, X, Plus, Minus, Menu, ArrowRight } from "lucide-react";

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=JetBrains+Mono:wght@400;500;700&display=swap');
  .xe-display { font-family: 'Anton', sans-serif; }
  .xe-mono { font-family: 'JetBrains Mono', monospace; }
  @keyframes xe-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .xe-marquee-track { display: inline-flex; animation: xe-marquee 22s linear infinite; white-space: nowrap; }
  @media (prefers-reduced-motion: reduce) {
    .xe-marquee-track { animation: none; }
  }
  .xe-card { transition: border-color 0.2s ease, transform 0.2s ease; }
  .xe-card:hover { border-color: #D4FF00 !important; transform: translateY(-2px); }
  .xe-card:hover .xe-icon-stroke { stroke: #D4FF00 !important; }
  .xe-btn { transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease; }
  .xe-btn:active { transform: scale(0.97); }
  .xe-corner { position: absolute; width: 10px; height: 10px; }
  .xe-focus:focus-visible { outline: 2px solid #D4FF00; outline-offset: 2px; }
  .xe-drawer { transition: transform 0.3s ease; }
  .xe-input::placeholder { color: #7A7A7A; }
`;

const COLORS = {
  bg: "#0A0A0A",
  card: "#121212",
  cardBorder: "#262626",
  off: "#EDEAE0",
  offDim: "#B8B5AC",
  accent: "#D4FF00",
  rust: "#9A3B24",
  gray: "#7A7A7A",
};

const PRODUCTS = [
  { id: "XE-001", name: "BLACKOUT HOODIE", cat: "HOODIES", price: 128, color: "BLK", status: "LOW STOCK", icon: "hoodie" },
  { id: "XE-002", name: "RIOT TEE", cat: "TEES", price: 48, color: "BLK", status: "NEW", icon: "tee" },
  { id: "XE-003", name: "UTILITY CARGO", cat: "BOTTOMS", price: 138, color: "OLV", status: "NEW", icon: "cargo" },
  { id: "XE-004", name: "SIEGE VEST", cat: "OUTERWEAR", price: 168, color: "BLK", status: "LIMITED", icon: "vest" },
  { id: "XE-005", name: "GHOST CREWNECK", cat: "HOODIES", price: 108, color: "GRY", status: null, icon: "crew" },
  { id: "XE-006", name: "FLIGHT JACKET", cat: "OUTERWEAR", price: 220, color: "BLK", status: "SOLD OUT", icon: "jacket" },
  { id: "XE-007", name: "STENCIL TEE", cat: "TEES", price: 52, color: "WHT", status: null, icon: "tee" },
  { id: "XE-008", name: "RECON PANT", cat: "BOTTOMS", price: 128, color: "BLK", status: "LOW STOCK", icon: "cargo" },
];

const CATEGORIES = ["ALL", "HOODIES", "TEES", "OUTERWEAR", "BOTTOMS"];

function GarmentIcon({ type, className }) {
  const p = { fill: "none", strokeWidth: 1.4, strokeLinejoin: "round", strokeLinecap: "round" };
  const paths = {
    hoodie: (
      <>
        <path d="M35 20 Q35 8 50 8 Q65 8 65 20" className={className} {...p} />
        <path d="M28 30 L35 20 L40 26 L60 26 L65 20 L72 30 L68 40 L64 34 L64 85 L36 85 L36 34 L32 40 Z" className={className} {...p} />
        <circle cx="50" cy="30" r="2" className={className} {...p} />
      </>
    ),
    tee: (
      <>
        <path d="M38 18 L28 26 L34 38 L40 34 L40 85 L60 85 L60 34 L66 38 L72 26 L62 18 Q56 24 50 24 Q44 24 38 18 Z" className={className} {...p} />
      </>
    ),
    cargo: (
      <>
        <path d="M32 12 L68 12 L66 85 L54 85 L52 45 L48 45 L46 85 L34 85 Z" className={className} {...p} />
        <rect x="36" y="38" width="12" height="14" className={className} {...p} />
        <rect x="52" y="38" width="12" height="14" className={className} {...p} />
      </>
    ),
    vest: (
      <>
        <path d="M38 20 L34 24 L36 40 L38 85 L48 85 L48 40 L52 40 L52 85 L62 85 L64 40 L66 24 L62 20 Q56 26 50 26 Q44 26 38 20 Z" className={className} {...p} />
      </>
    ),
    crew: (
      <>
        <path d="M30 28 L38 20 Q44 26 50 26 Q56 26 62 20 L70 28 L65 40 L64 34 L64 85 L36 85 L36 34 L35 40 Z" className={className} {...p} />
        <ellipse cx="50" cy="21" rx="8" ry="3" className={className} {...p} />
      </>
    ),
    jacket: (
      <>
        <path d="M34 18 L28 24 L26 34 L32 38 L36 30 L36 85 L44 85 L44 40 L50 40 L50 85 L64 85 L64 30 L68 38 L74 34 L72 24 L66 18 Q58 26 50 24 Q42 26 34 18 Z" className={className} {...p} />
        <line x1="50" y1="24" x2="50" y2="82" className={className} {...p} />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 100 96" className="w-full h-full">
      {paths[type] || paths.tee}
    </svg>
  );
}

function CornerMarks() {
  return (
    <>
      <div className="xe-corner" style={{ top: 8, left: 8, borderTop: `1px solid ${COLORS.gray}`, borderLeft: `1px solid ${COLORS.gray}` }} />
      <div className="xe-corner" style={{ top: 8, right: 8, borderTop: `1px solid ${COLORS.gray}`, borderRight: `1px solid ${COLORS.gray}` }} />
      <div className="xe-corner" style={{ bottom: 8, left: 8, borderBottom: `1px solid ${COLORS.gray}`, borderLeft: `1px solid ${COLORS.gray}` }} />
      <div className="xe-corner" style={{ bottom: 8, right: 8, borderBottom: `1px solid ${COLORS.gray}`, borderRight: `1px solid ${COLORS.gray}` }} />
    </>
  );
}

function StatusStamp({ status }) {
  if (!status) return null;
  const isSoldOut = status === "SOLD OUT";
  return (
    <div
      className="xe-mono absolute top-3 left-3 px-2 py-1 text-xs font-bold tracking-wider"
      style={{
        color: isSoldOut ? COLORS.gray : COLORS.bg,
        backgroundColor: isSoldOut ? "transparent" : COLORS.accent,
        border: isSoldOut ? `1px solid ${COLORS.gray}` : "none",
        transform: "rotate(-2deg)",
      }}
    >
      {status}
    </div>
  );
}

export default function XessentialsStore() {
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [category, setCategory] = useState("ALL");
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  const filtered = useMemo(
    () => (category === "ALL" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === category)),
    [category]
  );

  const addToCart = (product) => {
    if (product.status === "SOLD OUT") return;
    setCart((prev) => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }));
  };

  const updateQty = (id, delta) => {
    setCart((prev) => {
      const next = { ...prev };
      const qty = (next[id] || 0) + delta;
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  };

  const cartItems = Object.entries(cart).map(([id, qty]) => ({
    ...PRODUCTS.find((p) => p.id === id),
    qty,
  }));
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.qty * i.price, 0);

  const tickerText = "FREE SHIPPING OVER $150 \u00A0\u2022\u00A0 DROP 04 LIVE NOW \u00A0\u2022\u00A0 NO RESTOCKS \u00A0\u2022\u00A0 240 UNITS ONLY \u00A0\u2022\u00A0 ";

  return (
    <div className="xe-mono min-h-screen" style={{ backgroundColor: COLORS.bg, color: COLORS.off }}>
      <style>{FONTS}</style>

      <div className="overflow-hidden border-b py-2" style={{ borderColor: COLORS.cardBorder, backgroundColor: "#000" }}>
        <div className="xe-marquee-track text-xs tracking-widest" style={{ color: COLORS.accent }}>
          <span>{tickerText.repeat(4)}</span>
          <span>{tickerText.repeat(4)}</span>
        </div>
      </div>

      <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b backdrop-blur" style={{ borderColor: COLORS.cardBorder, backgroundColor: "rgba(10,10,10,0.9)" }}>
        <span className="xe-display text-2xl tracking-wide" style={{ letterSpacing: "0.03em" }}>
          XESSENTIALS<span style={{ color: COLORS.accent }}>.</span>
        </span>

        <div className="hidden md:flex items-center gap-8 text-xs tracking-widest">
          <a href="#shop" className="xe-focus hover:opacity-70">SHOP</a>
          <a href="#drop" className="xe-focus hover:opacity-70">DROP 04</a>
          <a href="#manifesto" className="xe-focus hover:opacity-70">MANIFESTO</a>
        </div>

        <div className="flex items-center gap-4">
          <button
            aria-label="Open cart"
            onClick={() => setCartOpen(true)}
            className="xe-focus xe-btn relative flex items-center gap-2 px-3 py-2 border"
            style={{ borderColor: COLORS.cardBorder }}
          >
            <ShoppingBag size={16} />
            <span className="text-xs">CART</span>
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2 flex items-center justify-center rounded-full text-xs font-bold"
                style={{ width: 18, height: 18, backgroundColor: COLORS.accent, color: COLORS.bg }}
              >
                {cartCount}
              </span>
            )}
          </button>
          <button className="xe-focus md:hidden" aria-label="Toggle menu" onClick={() => setMenuOpen((v) => !v)}>
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 py-4 border-b text-xs tracking-widest" style={{ borderColor: COLORS.cardBorder }}>
          <a href="#shop" className="xe-focus" onClick={() => setMenuOpen(false)}>SHOP</a>
          <a href="#drop" className="xe-focus" onClick={() => setMenuOpen(false)}>DROP 04</a>
          <a href="#manifesto" className="xe-focus" onClick={() => setMenuOpen(false)}>MANIFESTO</a>
        </div>
      )}

      <header
        className="relative flex flex-col items-center justify-center text-center px-6 py-24 md:py-36 border-b overflow-hidden"
        style={{
          borderColor: COLORS.cardBorder,
          backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 12px)`,
        }}
      >
        <p className="text-xs tracking-[0.3em] mb-6" style={{ color: COLORS.accent }}>DROP 04 &mdash; RELEASED 08.01.26</p>
        <h1
          className="xe-display leading-[0.85] uppercase"
          style={{ fontSize: "clamp(2.75rem, 10vw, 8rem)", letterSpacing: "0.01em" }}
        >
          NO FRILLS.<br />NO FILLER.
        </h1>
        <p className="mt-6 max-w-md text-sm" style={{ color: COLORS.offDim }}>
          Built for the street, not the runway. Limited units. No restocks. Wear it till it's gone.
        </p>
        
          href="#shop"
          className="xe-focus xe-btn mt-10 inline-flex items-center gap-2 px-8 py-4 text-sm font-bold tracking-widest"
          style={{ backgroundColor: COLORS.accent, color: COLORS.bg }}
        >
          SHOP DROP 04 <ArrowRight size={16} />
        </a>
      </header>

      <div id="drop" className="grid grid-cols-2 md:grid-cols-4 border-b text-xs tracking-widest" style={{ borderColor: COLORS.cardBorder }}>
        {[
          ["DROP NO.", "04"],
          ["RELEASE", "08.01.26"],
          ["UNITS", "240"],
          ["STATUS", "LIVE"],
        ].map(([label, val], i) => (
          <div
            key={label}
            className="px-6 py-5 border-r last:border-r-0"
            style={{ borderColor: COLORS.cardBorder }}
          >
            <p style={{ color: COLORS.gray }}>{label}</p>
            <p className="mt-1" style={{ color: i === 3 ? COLORS.accent : COLORS.off }}>{val}</p>
          </div>
        ))}
      </div>

      <div id="shop" className="flex gap-2 overflow-x-auto px-6 py-6 border-b" style={{ borderColor: COLORS.cardBorder }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="xe-focus xe-btn flex-shrink-0 px-4 py-2 text-xs tracking-widest border"
            style={{
              borderColor: category === c ? COLORS.accent : COLORS.cardBorder,
              backgroundColor: category === c ? COLORS.accent : "transparent",
              color: category === c ? COLORS.bg : COLORS.off,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="xe-card relative border p-5 flex flex-col"
            style={{ borderColor: COLORS.cardBorder, backgroundColor: COLORS.card }}
          >
            <CornerMarks />
            <StatusStamp status={product.status} />
            <div className="aspect-square flex items-center justify-center py-6">
              <div className="w-24 h-24">
                <GarmentIcon type={product.icon} className="xe-icon-stroke" />
                <style>{`.xe-icon-stroke { stroke: ${COLORS.offDim}; }`}</style>
              </div>
            </div>
            <p className="text-xs" style={{ color: COLORS.gray }}>{product.id} &mdash; {product.color}</p>
            <p className="mt-1 text-sm font-bold tracking-wide">{product.name}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm" style={{ color: COLORS.accent }}>${product.price}</span>
              <button
                onClick={() => addToCart(product)}
                disabled={product.status === "SOLD OUT"}
                className="xe-focus xe-btn px-3 py-2 text-xs tracking-widest border disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ borderColor: COLORS.cardBorder }}
              >
                {product.status === "SOLD OUT" ? "GONE" : "ADD"}
              </button>
            </div>
          </div>
        ))}
      </section>

      <section id="manifesto" className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6 py-24 border-t" style={{ borderColor: COLORS.cardBorder }}>
        <h2 className="xe-display uppercase leading-[0.9]" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
          The Manifesto
        </h2>
        <div className="text-sm leading-relaxed space-y-4" style={{ color: COLORS.offDim }}>
          <p>Every piece ships in a numbered run. Once it's gone, it's gone &mdash; we don't reprint, we don't restock.</p>
          <p>Heavyweight fabric, boxy fit, no logos you have to explain. Built to survive more washes than the trend that made it.</p>
          <p style={{ color: COLORS.off }}>This is street utility, not runway theatre.</p>
        </div>
      </section>

      <section className="border-t px-6 py-16" style={{ borderColor: COLORS.cardBorder, backgroundColor: COLORS.card }}>
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em]" style={{ color: COLORS.accent }}>ACCESS</p>
          <h3 className="xe-display uppercase mt-2" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
            Get On The Manifest
          </h3>
          <p className="mt-2 text-sm" style={{ color: COLORS.offDim }}>
            Early access to drops. No spam, no noise.
          </p>
          {joined ? (
            <p className="mt-6 text-sm" style={{ color: COLORS.accent }}>YOU'RE ON THE LIST.</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setJoined(true);
              }}
              className="mt-6 flex flex-col sm:flex-row gap-3 justify-center"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL ADDRESS"
                className="xe-input xe-focus flex-1 sm:max-w-xs px-4 py-3 text-xs tracking-widest bg-transparent border"
                style={{ borderColor: COLORS.cardBorder, color: COLORS.off }}
              />
              <button
                type="submit"
                className="xe-focus xe-btn px-6 py-3 text-xs font-bold tracking-widest"
                style={{ backgroundColor: COLORS.accent, color: COLORS.bg }}
              >
                JOIN
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t px-6 py-10" style={{ borderColor: COLORS.cardBorder }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs tracking-widest">
          <div>
            <p style={{ color: COLORS.gray }}>SHIP TO</p>
            <p className="mt-1">THE STREET</p>
            <p style={{ color: COLORS.offDim }}>WORLDWIDE DISTRIBUTION</p>
          </div>
          <div>
            <p style={{ color: COLORS.gray }}>TRACKING</p>
            <p className="mt-1">
              <a href="#" className="xe-focus hover:opacity-70">INSTAGRAM</a>
            </p>
            <p>
              <a href="#" className="xe-focus hover:opacity-70">TIKTOK</a>
            </p>
          </div>
          <div>
            <p style={{ color: COLORS.gray }}>MANIFEST NO.</p>
            <div className="mt-2 flex gap-[2px] h-8" aria-hidden="true">
              {[3,1,2,4,1,3,2,1,4,2,1,3,2,4,1,2,3,1,2,4].map((w, i) => (
                <div key={i} style={{ width: w, backgroundColor: COLORS.off }} />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row justify-between gap-2 text-xs" style={{ borderColor: COLORS.cardBorder, color: COLORS.gray }}>
          <span>&copy; 2026 XESSENTIALS. ALL UNITS FINAL SALE.</span>
          <span>DEMO STORE &mdash; NO REAL ORDERS PROCESSED</span>
        </div>
      </footer>

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            onClick={() => setCartOpen(false)}
          />
          <div
            className="xe-drawer relative w-full max-w-sm h-full overflow-y-auto p-6 flex flex-col"
            style={{ backgroundColor: COLORS.off, color: COLORS.bg }}
          >
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "#00000022" }}>
              <span className="xe-display text-xl uppercase">Your Cart</span>
              <button aria-label="Close cart" onClick={() => setCartOpen(false)} className="xe-focus">
                <X size={20} />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
                <p className="text-sm" style={{ color: "#5a5a5a" }}>Cart's empty.</p>
                <p className="text-xs" style={{ color: "#8a8a8a" }}>Add something from Drop 04.</p>
              </div>
            ) : (
              <>
                <div className="flex-1 mt-4 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 border-b pb-4" style={{ borderColor: "#00000015" }}>
                      <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center border" style={{ borderColor: "#00000022" }}>
                        <div className="w-10 h-10">
                          <GarmentIcon type={item.icon} className="xe-cart-icon" />
                          <style>{`.xe-cart-icon { stroke: ${COLORS.bg}; }`}</style>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs" style={{ color: "#7a7a7a" }}>{item.id}</p>
                        <p className="text-sm font-bold">{item.name}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-3 border px-2 py-1" style={{ borderColor: "#00000022" }}>
                            <button aria-label={`Decrease ${item.name} quantity`} className="xe-focus" onClick={() => updateQty(item.id, -1)}>
                              <Minus size={12} />
                            </button>
                            <span className="text-xs w-4 text-center">{item.qty}</span>
                            <button aria-label={`Increase ${item.name} quantity`} className="xe-focus" onClick={() => updateQty(item.id, 1)}>
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-sm">${item.price * item.qty}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t" style={{ borderColor: "#00000022" }}>
                  <div className="flex justify-between text-sm mb-4">
                    <span style={{ color: "#5a5a5a" }}>TOTAL</span>
                    <span className="font-bold">${cartTotal}</span>
                  </div>
                  {checkedOut ? (
                    <p className="text-center text-xs tracking-widest py-4" style={{ color: COLORS.rust }}>
                      ORDER MANIFESTED &mdash; THANKS FOR RIDING WITH US
                    </p>
                  ) : (
                    <button
                      onClick={() => setCheckedOut(true)}
                      className="xe-focus xe-btn w-full py-4 text-xs font-bold tracking-widest"
                      style={{ backgroundColor: COLORS.bg, color: COLORS.off }}
                    >
                      CHECKOUT
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
