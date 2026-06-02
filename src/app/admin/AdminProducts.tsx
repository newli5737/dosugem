import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { api } from '../api/client';
import { formatVND } from '../components/roxi-components';
import type { Product } from '../api/client';

export function AdminProducts() {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState<(Product & { published?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!token) return;
    api.admin.get<(Product & { published?: boolean })[]>('/products', token)
      .then(setProducts).finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Xóa sản phẩm này?')) return;
    await api.admin.delete(`/products/${id}`, token);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, color: '#F5F0E8' }}>Sản Phẩm</h1>
        <Link to="/admin/san-pham/them" style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#C9A84C', color: '#0F0D0A', padding: '10px 20px', borderRadius: 4, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
          <Plus size={16} /> Thêm mới
        </Link>
      </div>
      {loading ? <p style={{ color: '#6B6355' }}>Đang tải...</p> : (
        <div style={{ background: '#1A1612', border: '1px solid #2E2820', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2E2820', color: '#6B6355', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px' }}>Ảnh</th>
                <th style={{ padding: '12px 16px' }}>Tên</th>
                <th style={{ padding: '12px 16px' }}>Giá</th>
                <th style={{ padding: '12px 16px' }}>Tồn kho</th>
                <th style={{ padding: '12px 16px' }}>Trạng thái</th>
                <th style={{ padding: '12px 16px' }}></th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.slug} style={{ borderBottom: '1px solid #2E282033' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <img src={`${p.image}?w=48&h=48&fit=crop`} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }} />
                  </td>
                  <td style={{ padding: '12px 16px', color: '#F5F0E8', maxWidth: 280 }}>{p.name}</td>
                  <td style={{ padding: '12px 16px', color: '#C9A84C' }}>{formatVND(p.price)}</td>
                  <td style={{ padding: '12px 16px', color: '#A89F8C' }}>{p.stock ?? 0}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: p.published !== false ? 'rgba(74,155,142,.15)' : 'rgba(192,57,43,.15)', color: p.published !== false ? '#4A9B8E' : '#C0392B' }}>
                      {p.published !== false ? 'Đang bán' : 'Ẩn'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/admin/san-pham/${p.slug}`} style={{ color: '#C9A84C' }}><Pencil size={15} /></Link>
                      <button onClick={() => handleDelete(p.slug)} style={{ background: 'none', border: 'none', color: '#6B6355', cursor: 'pointer' }}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
