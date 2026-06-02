import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Package, ShoppingCart, Clock, DollarSign } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { api } from '../api/client';
import { formatVND } from '../components/roxi-components';

export function AdminDashboard() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState({ productCount: 0, orderCount: 0, pendingOrders: 0, revenue: 0 });

  useEffect(() => {
    if (!token) return;
    api.admin.get<typeof stats>('/stats', token).then(setStats).catch(() => {});
  }, [token]);

  const cards = [
    { icon: Package, label: 'Sản phẩm', value: stats.productCount, color: '#C9A84C' },
    { icon: ShoppingCart, label: 'Tổng đơn hàng', value: stats.orderCount, color: '#4A9B8E' },
    { icon: Clock, label: 'Chờ xử lý', value: stats.pendingOrders, color: '#E8A000' },
    { icon: DollarSign, label: 'Doanh thu', value: formatVND(stats.revenue), color: '#C9A84C' },
  ];

  return (
    <div>
      <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, color: '#F5F0E8', marginBottom: 8 }}>Tổng Quan</h1>
      <p style={{ color: '#6B6355', marginBottom: 32, fontSize: 14 }}>DOSU Gem — Bảng điều khiển quản lý bán hàng</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16, marginBottom: 32 }}>
        {cards.map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{ background: '#1A1612', border: '1px solid #2E2820', borderRadius: 8, padding: 24 }}>
            <Icon size={22} style={{ color, marginBottom: 12 }} />
            <div style={{ fontSize: 28, fontWeight: 700, color: '#F5F0E8', marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 13, color: '#6B6355' }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/admin/san-pham" style={{ background: '#C9A84C', color: '#0F0D0A', padding: '12px 24px', borderRadius: 4, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>+ Thêm sản phẩm</Link>
        <Link to="/admin/don-hang" style={{ background: '#211D18', color: '#C9A84C', border: '1px solid #C9A84C', padding: '12px 24px', borderRadius: 4, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>Xem đơn hàng</Link>
      </div>
    </div>
  );
}
