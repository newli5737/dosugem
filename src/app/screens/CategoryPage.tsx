import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { SlidersHorizontal } from 'lucide-react';
import { ProductCard, MenhBadge, Breadcrumb, type MenhType } from '../components/roxi-components';
import { useProducts } from '../hooks/useProducts';
import { useShop } from '../context/ShopContext';
import { useCategories } from '../hooks/useProducts';

const COLOR_SWATCHES = [
  { label: 'Trắng', hex: '#E8E8E8' }, { label: 'Hồng', hex: '#F48FB1' }, { label: 'Tím', hex: '#CE93D8' }, { label: 'Đen', hex: '#424242' },
];
const MENHS: MenhType[] = ['Kim', 'Thổ', 'Mộc', 'Hỏa', 'Thủy'];

export function CategoryPage() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const { categories } = useCategories();
  const category = categories.find(c => c.slug === categorySlug);

  const [selectedMenh, setSelectedMenh] = useState<MenhType | null>(null);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [mobileFilter, setMobileFilter] = useState(false);

  const params: Record<string, string> = { page: String(page), limit: '8', sort };
  if (categorySlug) params.category = categorySlug;
  if (selectedMenh) params.menh = selectedMenh;

  const { products, total, totalPages, loading } = useProducts(params);

  const Sidebar = () => (
    <div style={{ width: 260, flexShrink: 0 }}>
      <div style={{ background: '#1A1612', border: '1px solid #2E2820', borderRadius: 4, padding: '24px 20px' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 15, color: '#C9A84C', marginBottom: 14, fontWeight: 500 }}>Lọc theo Mệnh</div>
          {MENHS.map(m => (
            <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }} onClick={() => { setSelectedMenh(selectedMenh === m ? null : m); setPage(1); }}>
              <div style={{ width: 16, height: 16, borderRadius: 2, border: `1px solid ${selectedMenh === m ? '#C9A84C' : '#3A3028'}`, background: selectedMenh === m ? '#C9A84C' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedMenh === m && <span style={{ color: '#0F0D0A', fontSize: 10, fontWeight: 700 }}>✓</span>}
              </div>
              <MenhBadge menh={m} />
            </label>
          ))}
        </div>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 15, color: '#C9A84C', marginBottom: 14, fontWeight: 500 }}>Màu Sắc</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
            {COLOR_SWATCHES.map(c => (
              <div key={c.label} title={c.label} style={{ width: 32, height: 32, borderRadius: '50%', background: c.hex, cursor: 'pointer' }} />
            ))}
          </div>
        </div>
        <button onClick={() => { setSelectedMenh(null); setPage(1); }} style={{ background: 'none', border: 'none', color: '#C9A84C', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0, fontFamily: 'DM Sans,sans-serif' }}>✕ Xóa bộ lọc</button>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#0F0D0A', minHeight: '100vh', fontFamily: 'DM Sans,sans-serif' }}>
      <div className="page-container" style={{ maxWidth: 1440, margin: '0 auto', padding: '32px 32px 96px' }}>
        <Breadcrumb items={[{ label: 'Trang Chủ', path: '/' }, { label: 'Danh Mục', path: '/danh-muc' }, ...(category ? [{ label: category.name }] : [])]} />
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(28px,3vw,48px)', color: '#F5F0E8', marginBottom: 4 }}>{category?.name ?? 'Tất Cả Sản Phẩm'}</h1>
          <span style={{ fontSize: 14, color: '#6B6355' }}>({total} sản phẩm)</span>
        </div>
        <div className="category-layout" style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          <div className="category-sidebar"><Sidebar /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: '#6B6355' }}>Sắp xếp:</span>
              {[['newest', 'Mới nhất'], ['price-asc', 'Giá tăng'], ['price-desc', 'Giá giảm']].map(([val, label]) => (
                <button key={val} onClick={() => { setSort(val); setPage(1); }}
                  style={{ background: sort === val ? 'rgba(201,168,76,.1)' : 'none', border: `1px solid ${sort === val ? '#C9A84C' : '#2E2820'}`, color: sort === val ? '#C9A84C' : '#6B6355', padding: '6px 14px', fontSize: 12, cursor: 'pointer', borderRadius: 2 }}>{label}</button>
              ))}
              <button onClick={() => setMobileFilter(true)} className="mobile-filter-btn" style={{ marginLeft: 'auto', display: 'none', alignItems: 'center', gap: 7, background: '#211D18', border: '1px solid #2E2820', color: '#A89F8C', padding: '7px 14px', fontSize: 12, cursor: 'pointer', borderRadius: 2 }}>
                <SlidersHorizontal size={13} /> Lọc
              </button>
            </div>
            {loading ? <p style={{ color: '#6B6355', padding: 40, textAlign: 'center' }}>Đang tải sản phẩm...</p> : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 0', color: '#6B6355' }}>Không tìm thấy sản phẩm</div>
            ) : (
              <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 14 }}>
                {products.map(p => (
                  <ProductCard key={p.id} product={p} onAddToCart={addToCart} onClick={() => navigate(`/san-pham/${p.slug}`)} wished={isWishlisted(p.id)} onToggleWish={() => toggleWishlist(p)} />
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 40 }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(v => (
                  <button key={v} onClick={() => setPage(v)} style={{ width: 36, height: 36, background: page === v ? '#C9A84C' : 'none', border: `1px solid ${page === v ? '#C9A84C' : '#2E2820'}`, color: page === v ? '#0F0D0A' : '#6B6355', fontSize: 13, fontWeight: page === v ? 700 : 400, cursor: 'pointer', borderRadius: 2 }}>{v}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {mobileFilter && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500 }}>
          <div onClick={() => setMobileFilter(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#1A1612', borderRadius: '12px 12px 0 0', padding: 24, maxHeight: '80vh', overflowY: 'auto' }}>
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}
