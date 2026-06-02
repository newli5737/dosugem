import { useState, useEffect } from 'react';
import { useAdminAuth } from './AdminAuthContext';
import { api } from '../api/client';
import { formatVND } from '../components/roxi-components';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  status: string;
  total: number;
  payMethod: string;
  createdAt: string;
  items: { productName: string; qty: number; price: number }[];
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chờ xử lý', CONFIRMED: 'Đã xác nhận', SHIPPING: 'Đang giao', DELIVERED: 'Hoàn thành', CANCELLED: 'Đã hủy',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#E8A000', CONFIRMED: '#4A9B8E', SHIPPING: '#64B5F6', DELIVERED: '#4CAF50', CANCELLED: '#C0392B',
};

export function AdminOrders() {
  const { token } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('');

  const load = () => {
    if (!token) return;
    const q = filter ? `?status=${filter}` : '';
    api.admin.get<Order[]>(`/orders${q}`, token)
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]));
  };

  useEffect(() => { load(); }, [token, filter]);

  const updateStatus = async (id: string, status: string) => {
    if (!token) return;
    await api.admin.patch(`/orders/${id}/status`, token, { status });
    load();
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, color: '#F5F0E8', marginBottom: 24 }}>Đơn Hàng</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {[['', 'Tất cả'], ['PENDING', 'Chờ xử lý'], ['CONFIRMED', 'Xác nhận'], ['SHIPPING', 'Đang giao'], ['DELIVERED', 'Hoàn thành']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            style={{ background: filter === val ? 'rgba(201,168,76,.1)' : '#211D18', border: `1px solid ${filter === val ? '#C9A84C' : '#2E2820'}`, color: filter === val ? '#C9A84C' : '#A89F8C', padding: '6px 14px', fontSize: 12, cursor: 'pointer', borderRadius: 4 }}>
            {label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.map(o => (
          <div key={o.id} style={{ background: '#1A1612', border: '1px solid #2E2820', borderRadius: 8, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, color: '#C9A84C', fontSize: 15, marginBottom: 4 }}>{o.orderNumber}</div>
                <div style={{ fontSize: 14, color: '#F5F0E8' }}>{o.customerName} · {o.phone}</div>
                <div style={{ fontSize: 12, color: '#6B6355', marginTop: 4 }}>{new Date(o.createdAt).toLocaleString('vi-VN')}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#C9A84C' }}>{formatVND(o.total)}</div>
                <div style={{ fontSize: 12, color: '#6B6355' }}>{o.payMethod === 'BANK' ? 'Chuyển khoản' : 'COD'}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#A89F8C', marginBottom: 12 }}>
              {o.items.map(i => `${i.productName} ×${i.qty}`).join(' · ')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 999, background: `${STATUS_COLORS[o.status]}22`, color: STATUS_COLORS[o.status] }}>
                {STATUS_LABELS[o.status] ?? o.status}
              </span>
              <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                style={{ background: '#211D18', border: '1px solid #2E2820', color: '#F5F0E8', padding: '6px 10px', fontSize: 12, borderRadius: 4 }}>
                {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
        ))}
        {orders.length === 0 && <p style={{ color: '#6B6355', textAlign: 'center', padding: 40 }}>Chưa có đơn hàng</p>}
      </div>
    </div>
  );
}
