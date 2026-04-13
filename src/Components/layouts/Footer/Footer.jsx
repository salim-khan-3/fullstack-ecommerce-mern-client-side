import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  const sections = [
    {
      title: "Shop",
      links: [
        { label: "New Arrivals",    to: "/listing?search=new"      },
        { label: "Featured Items",  to: "/listing?search=featured" },
        { label: "Best Sellers",    to: "/listing?search=popular"  },
        { label: "On Sale",         to: "/listing?search=sale"     },
        { label: "All Products",    to: "/listing"                 },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "My Profile",   to: "/my-account" },
        { label: "My Orders",    to: "/orders"     },
        { label: "Wishlist",     to: "/my-list"    },
        { label: "Cart",         to: "/cart"       },
        { label: "Sign In",      to: "/login"      },
      ],
    },
    {
      title: "Help",
      links: [
        { label: "FAQ",              to: "#" },
        { label: "Shipping Policy",  to: "#" },
        { label: "Return Policy",    to: "#" },
        { label: "Track Order",      to: "/orders" },
        { label: "Contact Us",       to: "#" },
      ],
    },
  ];

  const socials = [
    {
      label: "Facebook",
      href: "#",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      ),
    },
    {
      label: "Instagram",
      href: "#",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: "Twitter / X",
      href: "#",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "YouTube",
      href: "#",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-[#0f0f0f] text-white pt-16 pb-8 px-4 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .ft-root { font-family: 'DM Sans', sans-serif; }
        .ft-display { font-family: 'Syne', sans-serif; }
        .ft-link { position: relative; display: inline-block; }
        .ft-link::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0;
          width: 0; height: 1px;
          background: #2bbef9;
          transition: width 0.25s ease;
        }
        .ft-link:hover::after { width: 100%; }
        .ft-social:hover { transform: translateY(-3px); }
        .ft-social { transition: transform 0.2s ease, background 0.2s ease; }
        .ft-divider {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          height: 1px;
        }
      `}</style>

      <div className="ft-root container mx-auto max-w-7xl">

        {/* ── Top Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 pb-12">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h2 className="ft-display text-3xl font-black text-white mb-4 tracking-tight">
              Shop<span className="text-[#2bbef9]">.</span>BD
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
              Bangladesh এর সেরা অনলাইন শপিং প্ল্যাটফর্ম। সেরা পণ্য, সেরা দাম, দ্রুত ডেলিভারি।
            </p>

            {/* Features */}
            <div className="space-y-3">
              {[
                { icon: "🚚", text: "Free delivery on orders over ৳500" },
                { icon: "🔒", text: "Secure payment via SSLCommerz" },
                { icon: "↩️", text: "Easy 7-day return policy" },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="text-base">{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-8">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className="ft-social w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#2bbef9] hover:text-white hover:border-[#2bbef9]">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="ft-display text-xs font-bold uppercase tracking-[3px] text-gray-500 mb-5">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}
                      className="ft-link text-sm text-gray-400 hover:text-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="ft-divider mb-8" />

        {/* ── Payment Methods ── */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="text-xs text-gray-600 uppercase tracking-widest mr-2">We Accept</span>
          {["bKash", "Nagad", "Rocket", "Visa", "Mastercard"].map((method) => (
            <span key={method}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 font-medium">
              {method}
            </span>
          ))}
        </div>

        {/* ── Bottom Bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {year} Shop.BD — All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a key={item} href="#"
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;