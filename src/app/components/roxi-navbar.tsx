import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const NAV = [
  { label: 'Quả Cầu', path: '/danh-muc/qua-cau' },
  { label: 'Vật Phẩm', path: '/danh-muc/vat-pham' },
  { label: 'Linh Vật', path: '/danh-muc/linh-vat' },
  { label: 'Tượng Phật', path: '/danh-muc/tuong-phat' },
  { label: 'Trang Sức', path: '/danh-muc/trang-suc' },
  { label: 'Quà Tặng', path: '/danh-muc/qua-tang' },
];

export function Navbar({ cartCount = 0 }: { cartCount?: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { wishlist } = useShop();

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, background: scrolled ? 'rgba(15,13,10,.94)' : '#0F0D0A', backdropFilter: scrolled ? 'blur(14px)' : 'none', borderBottom: '1px solid #2E2820', transition: 'all .3s' }}>
      <div className="navbar-inner" style={{ maxWidth: 1440, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', height: 64, gap: 24 }}>
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', flexShrink: 0 }}>
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 600, color: '#C9A84C', letterSpacing: '0.08em', lineHeight: 1 }}>DOSU Gem</div>
          <div style={{ fontSize: 9, letterSpacing: '0.25em', color: '#6B6355', textTransform: 'uppercase', fontFamily: 'DM Sans,sans-serif', marginTop: 2 }}>Đá Quý · Phong Thủy</div>
        </div>

        <div className="desktop-nav" style={{ display: 'flex', gap: 2, flex: 1, justifyContent: 'center' }}>
          {NAV.map(item => (
            <button key={item.label}
              onClick={() => navigate(item.path)}
              onMouseEnter={() => item.label === 'Quả Cầu' && setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
              style={{ background: location.pathname.startsWith(item.path) ? 'rgba(201,168,76,.08)' : 'none', border: 'none', color: location.pathname.startsWith(item.path) ? '#C9A84C' : '#A89F8C', fontFamily: 'DM Sans,sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: '8px 11px', borderRadius: 2, transition: 'color .2s', display: 'flex', alignItems: 'center', gap: 3, letterSpacing: '0.015em' }}
            >
              {item.label}
              {item.label === 'Quả Cầu' && <ChevronDown size={11} />}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <button onClick={() => navigate('/tim-kiem')} className="desktop-icon" style={{ background: 'none', border: 'none', color: '#A89F8C', cursor: 'pointer', padding: 4, transition: 'color .2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
            onMouseLeave={e => (e.currentTarget.style.color = '#A89F8C')}>
            <Search size={17} />
          </button>
          <button onClick={() => navigate('/yeu-thich')} className="desktop-icon" style={{ background: 'none', border: 'none', color: '#A89F8C', cursor: 'pointer', padding: 4, position: 'relative', transition: 'color .2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
            onMouseLeave={e => (e.currentTarget.style.color = '#A89F8C')}>
            <Heart size={17} />
            {wishlist.length > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, background: '#C9A84C', color: '#0F0D0A', borderRadius: 999, width: 16, height: 16, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{wishlist.length}</span>
            )}
          </button>
          <button onClick={() => navigate('/gio-hang')} style={{ background: 'none', border: 'none', color: '#A89F8C', cursor: 'pointer', padding: 4, position: 'relative', transition: 'color .2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
            onMouseLeave={e => (e.currentTarget.style.color = '#A89F8C')}>
            <ShoppingBag size={17} />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, background: '#C9A84C', color: '#0F0D0A', borderRadius: 999, width: 16, height: 16, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>
            )}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-menu-btn" style={{ background: 'none', border: 'none', color: '#A89F8C', cursor: 'pointer', display: 'none' }}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {megaOpen && (
        <div onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}
          className="desktop-nav"
          style={{ position: 'absolute', top: 64, left: 0, right: 0, background: '#1A1612', borderTop: '2px solid #C9A84C', borderBottom: '1px solid #2E2820', animation: 'megaIn .15s ease', zIndex: 300 }}>
          <style>{`@keyframes megaIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
          <div style={{ maxWidth: 1440, margin: '0 auto', padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 260px', gap: 48 }}>
            {[
              { title: 'Thạch Anh', links: ['Thạch Anh Đen', 'Thạch Anh Tím', 'Thạch Anh Hồng', 'Thạch Anh Trắng', 'Thạch Anh Vàng', 'Thạch Anh Xanh'] },
              { title: 'Đá Núi Lửa', links: ['Obsidian Đen', 'Đá Mắt Hổ', 'Labradorite', 'Đá Mặt Trăng'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 17, color: '#C9A84C', marginBottom: 14, borderBottom: '1px solid #2E2820', paddingBottom: 8 }}>{col.title}</div>
                {col.links.map(l => (
                  <div key={l} onClick={() => navigate('/danh-muc/qua-cau')}
                    style={{ color: '#A89F8C', fontSize: 13, padding: '5px 0', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', transition: 'color .15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#A89F8C')}>{l}</div>
                ))}
              </div>
            ))}
            <div>
              <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 17, color: '#C9A84C', marginBottom: 14, borderBottom: '1px solid #2E2820', paddingBottom: 8 }}>Theo Mệnh</div>
              {[['#C0C0C0', 'Mệnh Kim'], ['#4CAF50', 'Mệnh Mộc'], ['#64B5F6', 'Mệnh Thủy'], ['#EF5350', 'Mệnh Hỏa'], ['#A1887F', 'Mệnh Thổ']].map(([color, label]) => (
                <div key={label} onClick={() => navigate('/danh-muc')}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#A89F8C', fontSize: 13, padding: '5px 0', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', transition: 'color .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#A89F8C')}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />{label}
                </div>
              ))}
            </div>
            <div style={{ background: '#211D18', borderRadius: 4, overflow: 'hidden', border: '1px solid #2E2820' }}>
              <img src="https://images.unsplash.com/photo-1521133573892-e44906baee46?w=260&h=150&fit=crop&auto=format" alt="" style={{ width: '100%', height: 130, objectFit: 'cover' }} />
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: 10, color: '#6B6355', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'DM Sans,sans-serif', marginBottom: 5 }}>Nổi Bật</div>
                <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 15, color: '#F5F0E8', lineHeight: 1.35, marginBottom: 8 }}>Quả Cầu Thạch Anh Tím 1.8kg</div>
                <div style={{ color: '#C9A84C', fontSize: 14, fontWeight: 600, fontFamily: 'DM Sans,sans-serif', marginBottom: 10 }}>4.200.000 đ</div>
                <button onClick={() => navigate('/san-pham/qua-cau-thach-anh-tim-1-8kg')}
                  style={{ width: '100%', background: 'none', border: '1px solid #C9A84C', color: '#C9A84C', padding: '6px 0', fontSize: 12, fontFamily: 'DM Sans,sans-serif', cursor: 'pointer', borderRadius: 2, transition: 'all .2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#C9A84C'; (e.currentTarget as HTMLButtonElement).style.color = '#0F0D0A'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = '#C9A84C'; }}>
                  Xem ngay →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div style={{ background: '#1A1612', borderTop: '1px solid #2E2820', padding: '12px 24px 20px' }}>
          {NAV.map(item => (
            <div key={item.label} onClick={() => navigate(item.path)}
              style={{ color: location.pathname.startsWith(item.path) ? '#C9A84C' : '#A89F8C', padding: '13px 0', borderBottom: '1px solid #2E282433', fontFamily: 'DM Sans,sans-serif', fontSize: 15, cursor: 'pointer', fontWeight: location.pathname.startsWith(item.path) ? 600 : 400 }}>
              {item.label}
            </div>
          ))}
          <div onClick={() => navigate('/tim-kiem')} style={{ color: '#A89F8C', padding: '13px 0', fontFamily: 'DM Sans,sans-serif', fontSize: 15, cursor: 'pointer' }}>Tìm Kiếm</div>
        </div>
      )}
    </nav>
  );
}
