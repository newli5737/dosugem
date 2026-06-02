import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAdminAuth } from './AdminAuthContext';
import { api } from '../api/client';

const inputStyle: React.CSSProperties = { width: '100%', background: '#211D18', border: '1px solid #2E2820', borderRadius: 4, color: '#F5F0E8', padding: '10px 12px', fontSize: 14, boxSizing: 'border-box', fontFamily: 'DM Sans,sans-serif' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, color: '#6B6355', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' };

export function AdminProductForm() {
  const { slug } = useParams();
  const isEdit = !!slug && slug !== 'them';
  const { token } = useAdminAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    slug: '', name: '', spec: '', price: 0, originalPrice: '', salePercent: '',
    image: '', images: '', menh: '', categorySlug: 'qua-cau',
    description: '', fengShuiMeaning: '', sku: '', stock: 0,
    isNew: false, isHot: false, published: true,
  });

  useEffect(() => {
    if (!token) return;
    api.admin.get<{ slug: string; name: string }[]>('/categories', token).then(setCategories);
    if (isEdit) {
      api.admin.get<Record<string, unknown>>(`/products`, token).then(products => {
        const p = (products as unknown as Array<Record<string, unknown>>).find(x => x.slug === slug);
        if (p) setForm({
          slug: p.slug as string, name: p.name as string, spec: p.spec as string,
          price: p.price as number, originalPrice: String(p.originalPrice ?? ''), salePercent: String(p.salePercent ?? ''),
          image: p.image as string, images: (p.images as string[])?.join('\n') ?? '',
          menh: (p.menh as string[])?.join(', ') ?? '', categorySlug: p.categorySlug as string,
          description: (p.description as string) ?? '', fengShuiMeaning: (p.fengShuiMeaning as string) ?? '',
          sku: (p.sku as string) ?? '', stock: (p.stock as number) ?? 0,
          isNew: p.isNew as boolean, isHot: p.isHot as boolean, published: p.published !== false,
        });
      });
    }
  }, [token, slug, isEdit]);

  const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    const body = {
      slug: form.slug,
      name: form.name,
      spec: form.spec,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      salePercent: form.salePercent ? Number(form.salePercent) : null,
      image: form.image,
      images: form.images.split('\n').filter(Boolean),
      menh: form.menh.split(',').map(s => s.trim()).filter(Boolean),
      categorySlug: form.categorySlug,
      description: form.description || null,
      fengShuiMeaning: form.fengShuiMeaning || null,
      sku: form.sku || null,
      stock: Number(form.stock),
      isNew: form.isNew,
      isHot: form.isHot,
      published: form.published,
    };
    try {
      if (isEdit) await api.admin.put(`/products/${slug}`, token, body);
      else await api.admin.post('/products', token, body);
      navigate('/admin/san-pham');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi lưu sản phẩm');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, color: '#F5F0E8', marginBottom: 32 }}>
        {isEdit ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}
      </h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div><label style={labelStyle}>Slug (URL)</label><input required value={form.slug} onChange={e => set('slug', e.target.value)} style={inputStyle} disabled={isEdit} /></div>
          <div><label style={labelStyle}>SKU</label><input value={form.sku} onChange={e => set('sku', e.target.value)} style={inputStyle} /></div>
        </div>
        <div><label style={labelStyle}>Tên sản phẩm</label><input required value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle} /></div>
        <div><label style={labelStyle}>Thông số ngắn</label><input required value={form.spec} onChange={e => set('spec', e.target.value)} style={inputStyle} placeholder="1,8kg · 10,2cm" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div><label style={labelStyle}>Giá (VNĐ)</label><input required type="number" value={form.price} onChange={e => set('price', e.target.value)} style={inputStyle} /></div>
          <div><label style={labelStyle}>Giá gốc</label><input type="number" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} style={inputStyle} /></div>
          <div><label style={labelStyle}>% Giảm</label><input type="number" value={form.salePercent} onChange={e => set('salePercent', e.target.value)} style={inputStyle} /></div>
        </div>
        <div><label style={labelStyle}>Ảnh chính (URL)</label><input required value={form.image} onChange={e => set('image', e.target.value)} style={inputStyle} /></div>
        <div><label style={labelStyle}>Ảnh phụ (mỗi dòng 1 URL)</label><textarea value={form.images} onChange={e => set('images', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Danh mục</label>
            <select value={form.categorySlug} onChange={e => set('categorySlug', e.target.value)} style={inputStyle}>
              {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div><label style={labelStyle}>Mệnh (cách nhau bởi dấu phẩy)</label><input value={form.menh} onChange={e => set('menh', e.target.value)} style={inputStyle} placeholder="Kim, Thủy" /></div>
        </div>
        <div><label style={labelStyle}>Tồn kho</label><input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} style={inputStyle} /></div>
        <div><label style={labelStyle}>Mô tả</label><textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical' }} /></div>
        <div><label style={labelStyle}>Ý nghĩa phong thủy</label><textarea value={form.fengShuiMeaning} onChange={e => set('fengShuiMeaning', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} /></div>
        <div style={{ display: 'flex', gap: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#A89F8C', fontSize: 14, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.isNew} onChange={e => set('isNew', e.target.checked)} /> Mới
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#A89F8C', fontSize: 14, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.isHot} onChange={e => set('isHot', e.target.checked)} /> Hot
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#A89F8C', fontSize: 14, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} /> Đang bán
          </label>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button type="submit" disabled={saving} style={{ background: '#C9A84C', color: '#0F0D0A', border: 'none', padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer', borderRadius: 4 }}>
            {saving ? 'Đang lưu...' : 'Lưu Sản Phẩm'}
          </button>
          <button type="button" onClick={() => navigate('/admin/san-pham')} style={{ background: 'none', border: '1px solid #2E2820', color: '#A89F8C', padding: '12px 24px', fontSize: 14, cursor: 'pointer', borderRadius: 4 }}>Hủy</button>
        </div>
      </form>
    </div>
  );
}
