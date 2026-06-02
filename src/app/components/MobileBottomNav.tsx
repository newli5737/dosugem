import { Home, Grid3X3, Search, ShoppingBag, Heart } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { useShop } from '../context/ShopContext';

const NAV = [
  { path: '/', icon: Home, label: 'Trang Chủ' },
  { path: '/danh-muc', icon: Grid3X3, label: 'Danh Mục' },
  { path: '/tim-kiem', icon: Search, label: 'Tìm Kiếm' },
  { path: '/gio-hang', icon: ShoppingBag, label: 'Giỏ Hàng', badge: 'cart' as const },
  { path: '/yeu-thich', icon: Heart, label: 'Yêu Thích', badge: 'wishlist' as const },
];

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, wishlist } = useShop();

  return (
    <nav className="mobile-bottom-nav" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
      background: 'rgba(15,13,10,.97)', borderTop: '1px solid #2E2820',
      backdropFilter: 'blur(14px)', display: 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 60, maxWidth: 500, margin: '0 auto' }}>
        {NAV.map(({ path, icon: Icon, label, badge }) => {
          const active = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          const count = badge === 'cart' ? cartCount : badge === 'wishlist' ? wishlist.length : 0;
          return (
            <button key={path} onClick={() => navigate(path)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                color: active ? '#C9A84C' : '#6B6355', position: 'relative', padding: '6px 12px',
                transition: 'color .2s',
              }}>
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, fontFamily: 'DM Sans,sans-serif' }}>{label}</span>
              {count > 0 && (
                <span style={{
                  position: 'absolute', top: 2, right: 4,
                  background: '#C9A84C', color: '#0F0D0A',
                  borderRadius: 999, minWidth: 16, height: 16, fontSize: 9, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                }}>{count}</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
