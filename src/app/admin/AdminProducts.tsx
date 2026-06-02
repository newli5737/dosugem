import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { api } from '../api/client';
import { formatVND } from '../components/roxi-components';
import type { Product } from '../api/client';

type AdminProduct = Product & { published?: boolean; dbId?: string };

export function AdminProducts() {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError('');
    api.admin.get<AdminProduct[]>('/products', token)
      .then(data => {
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        if (!cancelled) {
          setProducts([]);
          setError(err instanceof Error ? err.message : 'Không tải được sản phẩm');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Xóa sản phẩm này?')) return;
    try {
      await api.admin.delete(`/products/${id}`, token);
      setProducts(prev => prev.filter(p => p.slug !== id && p.dbId !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Xóa thất bại');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, color: '#F5F0E8', margin: 0 }}>Sản Phẩm</h1>
        <Link to="/admin/san-pham/them" style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#C9A84C', color: '#0F0D0A', padding: '10px 20px', borderRadius: 4, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
          <Plus size={16} /> Thêm mới
        </Link>
      </div>
      {loading && <p style={{ color: '#6B6355' }}>Đang tải...</p>}
      {error && <p style={{ color: '#C0392B', marginBottom: 16 }}>{error}</p>}
      {!loading && (
        <>
          <div className="admin-table-wrap" style={{ background: '#1A1612', border: '1px solid #2E2820', borderRadius: 8, overflow: 'hidden' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 640 }}>
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
                        <button type="button" onClick={() => handleDelete(p.slug)} style={{ background: 'none', border: 'none', color: '#6B6355', cursor: 'pointer' }}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-product-cards">
            {products.map(p => (
              <div key={p.slug} style={{ background: '#1A1612', border: '1px solid #2E2820', borderRadius: 8, padding: 14, display: 'flex', gap: 12 }}>
                <img src={`${p.image}?w=72&h=72&fit=crop`} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#F5F0E8', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ color: '#C9A84C', fontSize: 13, marginBottom: 4 }}>{formatVND(p.price)}</div>
                  <div style={{ fontSize: 12, color: '#6B6355' }}>Tồn: {p.stock ?? 0}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link to={`/admin/san-pham/${p.slug}`} style={{ color: '#C9A84C' }}><Pencil size={15} /></Link>
                  <button type="button" onClick={() => handleDelete(p.slug)} style={{ background: 'none', border: 'none', color: '#6B6355', cursor: 'pointer' }}><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
          {products.length === 0 && !error && <p style={{ color: '#6B6355', textAlign: 'center', padding: 40 }}>Chưa có sản phẩm</p>}
        </>
      )}
    </div>
  );
}
