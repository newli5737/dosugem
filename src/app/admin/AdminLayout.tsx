import { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router';
import { LayoutDashboard, Package, FolderOpen, ShoppingCart, Tag, LogOut, Gem } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

const NAV = [
  { path: '/admin', icon: LayoutDashboard, label: 'Tổng Quan', exact: true },
  { path: '/admin/san-pham', icon: Package, label: 'Sản Phẩm' },
  { path: '/admin/danh-muc', icon: FolderOpen, label: 'Danh Mục' },
  { path: '/admin/don-hang', icon: ShoppingCart, label: 'Đơn Hàng' },
  { path: '/admin/ma-giam-gia', icon: Tag, label: 'Mã Giảm Giá' },
];

export function AdminLayout() {
  const { token, admin, logout } = useAdminAuth();
  const location = useLocation();

  if (!token) return <Navigate to="/admin/dang-nhap" replace />;

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#0F0D0A', color: '#F5F0E8', fontFamily: 'DM Sans,sans-serif' }}>
      <aside className="admin-sidebar" style={{ width: 240, background: '#1A1612', borderRight: '1px solid #2E2820', padding: '24px 0', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #2E2820' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Gem size={20} style={{ color: '#C9A84C' }} />
            <span style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, color: '#C9A84C', fontWeight: 600 }}>DOSU Gem</span>
          </div>
          <div style={{ fontSize: 11, color: '#6B6355' }}>CMS Quản Lý</div>
        </div>
        <nav className="admin-nav" style={{ padding: '16px 12px', flex: 1 }}>
          {NAV.map(({ path, icon: Icon, label, exact }) => {
            const active = exact ? location.pathname === path : location.pathname.startsWith(path);
            return (
              <Link key={path} to={path} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 4, marginBottom: 4,
                color: active ? '#C9A84C' : '#A89F8C', background: active ? 'rgba(201,168,76,.08)' : 'transparent',
                textDecoration: 'none', fontSize: 14, fontWeight: active ? 600 : 400,
              }}>
                <Icon size={16} /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="admin-sidebar-footer" style={{ padding: '16px 20px', borderTop: '1px solid #2E2820' }}>
          <div style={{ fontSize: 12, color: '#6B6355', marginBottom: 8 }}>{admin?.name}</div>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#A89F8C', cursor: 'pointer', fontSize: 13 }}>
            <LogOut size={14} /> Đăng xuất
          </button>
          <Link to="/" style={{ display: 'block', marginTop: 12, fontSize: 12, color: '#C9A84C', textDecoration: 'none' }}>← Về website</Link>
        </div>
      </aside>
      <main className="admin-main" style={{ flex: 1, padding: 32, overflow: 'auto', minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}

export function AdminLoginPage() {
  const { token, login, loading } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (token) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0F0D0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans,sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ background: '#1A1612', border: '1px solid #2E2820', borderRadius: 8, padding: 40, width: 400, maxWidth: '90vw' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Gem size={32} style={{ color: '#C9A84C', marginBottom: 12 }} />
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, color: '#F5F0E8', marginBottom: 4 }}>DOSU Gem CMS</h1>
          <p style={{ fontSize: 13, color: '#6B6355' }}>Đăng nhập quản trị</p>
        </div>
        {error && <div style={{ background: 'rgba(192,57,43,.1)', border: '1px solid #C0392B', color: '#C0392B', padding: '10px 14px', borderRadius: 4, fontSize: 13, marginBottom: 16 }}>{error}</div>}
        <label style={{ display: 'block', fontSize: 12, color: '#6B6355', marginBottom: 6 }}>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" required
          style={{ width: '100%', background: '#211D18', border: '1px solid #2E2820', borderRadius: 4, color: '#F5F0E8', padding: '12px 14px', fontSize: 14, marginBottom: 16, boxSizing: 'border-box' }} />
        <label style={{ display: 'block', fontSize: 12, color: '#6B6355', marginBottom: 6 }}>Mật khẩu</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" required
          style={{ width: '100%', background: '#211D18', border: '1px solid #2E2820', borderRadius: 4, color: '#F5F0E8', padding: '12px 14px', fontSize: 14, marginBottom: 24, boxSizing: 'border-box' }} />
        <button type="submit" disabled={loading}
          style={{ width: '100%', height: 48, background: '#C9A84C', color: '#0F0D0A', border: 'none', fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', borderRadius: 4 }}>
          {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
        </button>
        <p style={{ fontSize: 11, color: '#6B6355', marginTop: 16, textAlign: 'center' }}>Mặc định: admin@dosugem.site / admin123</p>
      </form>
    </div>
  );
}
