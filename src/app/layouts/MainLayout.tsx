import { Outlet, useLocation } from 'react-router';
import { Navbar } from '../components/roxi-navbar';
import { Footer } from '../components/roxi-footer';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { Toast } from '../components/Toast';
import { useShop } from '../context/ShopContext';

export function MainLayout() {
  const { cartCount, toast } = useShop();
  const location = useLocation();
  const hideFooter = location.pathname.startsWith('/gio-hang');

  return (
    <div style={{ background: '#0F0D0A', minHeight: '100vh', color: '#F5F0E8', fontFamily: 'DM Sans,sans-serif' }}>
      <Navbar cartCount={cartCount} />
      <main style={{ paddingTop: 64, paddingBottom: 72 }}>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
      <MobileBottomNav />
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
