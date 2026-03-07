import { useEffect, useState } from 'react';
import TopStrip from '../../Header/TopStrip/TopStrip';
import MiddleHeader from '../../Header/MiddleHeader/MiddleHeader';
import CategoryNavigation from '../../Header/CategoryNavigation/CategoryNavigation';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ── DESKTOP (lg+): Only CategoryNavigation sticks ── */}
      <div className="hidden lg:block">
        <TopStrip />
        <MiddleHeader />
      </div>
      <div className="hidden lg:block sticky top-0 z-40">
        <CategoryNavigation />
      </div>

      {/* ── MOBILE (< lg): All 3 are sticky ── */}
      <div className="lg:hidden sticky top-0 z-40">
        <TopStrip />
        <MiddleHeader />
        <CategoryNavigation />
      </div>
    </>
  );
};

export default Navbar;