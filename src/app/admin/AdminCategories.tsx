import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { api } from '../api/client';

interface Category { id: string; slug: string; name: string; image: string; sortOrder: number; _count?: { products: number } }
interface Coupon { id: string; code: string; discountPercent: number; active: boolean }

const inputStyle: React.CSSProperties = { background: '#211D18', border: '1px solid #2E2820', borderRadius: 4, color: '#F5F0E8', padding: '8px 12px', fontSize: 13, fontFamily: 'DM Sans,sans-serif' };

export function AdminCategories() {
  const { token } = useAdminAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ slug: '', name: '', image: '', sortOrder: 0 });

  const load = () => token && api.admin.get<Category[]>('/categories', token).then(setCategories);
  useEffect(load, [token]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    await api.admin.post('/categories', token, form);
    setForm({ slug: '', name: '', image: '', sortOrder: 0 });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Xóa danh mục?')) return;
    await api.admin.delete(`/categories/${id}`, token);
    load();
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, color: '#F5F0E8', marginBottom: 32 }}>Danh Mục</h1>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <input required placeholder="Slug" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} style={inputStyle} />
        <input required placeholder="Tên danh mục" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ ...inputStyle, flex: 1, minWidth: 160 }} />
        <input required placeholder="URL ảnh" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} style={{ ...inputStyle, flex: 2, minWidth: 200 }} />
        <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#C9A84C', color: '#0F0D0A', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
          <Plus size={14} /> Thêm
        </button>
      </form>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
        {categories.map(c => (
          <div key={c.id} style={{ background: '#1A1612', border: '1px solid #2E2820', borderRadius: 8, padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
            <img src={`${c.image}?w=64&h=48&fit=crop`} alt="" style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 4 }} />
            <div style={{ flex: 1 }}>
              <div style={{ color: '#F5F0E8', fontWeight: 600, fontSize: 14 }}>{c.name}</div>
              <div style={{ color: '#6B6355', fontSize: 12 }}>{c.slug} · {c._count?.products ?? 0} SP</div>
            </div>
            <button onClick={() => handleDelete(c.id)} style={{ background: 'none', border: 'none', color: '#6B6355', cursor: 'pointer' }}><Trash2 size={15} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminCoupons() {
  const { token } = useAdminAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState({ code: '', discountPercent: 5 });

  const load = () => token && api.admin.get<Coupon[]>('/coupons', token).then(setCoupons);
  useEffect(load, [token]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    await api.admin.post('/coupons', token, { ...form, active: true });
    setForm({ code: '', discountPercent: 5 });
    load();
  };

  const toggleActive = async (c: Coupon) => {
    if (!token) return;
    await api.admin.put(`/coupons/${c.id}`, token, { active: !c.active });
    load();
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, color: '#F5F0E8', marginBottom: 32 }}>Mã Giảm Giá</h1>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <input required placeholder="Mã (vd: DOSU5)" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} style={inputStyle} />
        <input required type="number" placeholder="% giảm" value={form.discountPercent} onChange={e => setForm(f => ({ ...f, discountPercent: +e.target.value }))} style={{ ...inputStyle, width: 100 }} />
        <button type="submit" style={{ background: '#C9A84C', color: '#0F0D0A', border: 'none', padding: '8px 20px', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Thêm mã</button>
      </form>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {coupons.map(c => (
          <div key={c.id} style={{ background: '#1A1612', border: '1px solid #2E2820', borderRadius: 8, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#C9A84C', fontWeight: 700, fontSize: 16, fontFamily: 'monospace' }}>{c.code}</span>
              <span style={{ color: '#A89F8C', fontSize: 13, marginLeft: 12 }}>Giảm {c.discountPercent}%</span>
            </div>
            <button onClick={() => toggleActive(c)} style={{ background: 'none', border: `1px solid ${c.active ? '#4A9B8E' : '#C0392B'}`, color: c.active ? '#4A9B8E' : '#C0392B', padding: '4px 12px', borderRadius: 999, fontSize: 12, cursor: 'pointer' }}>
              {c.active ? 'Đang hoạt động' : 'Đã tắt'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
