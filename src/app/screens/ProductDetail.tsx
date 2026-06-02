import { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router';
import { Minus, Plus, Heart, ShieldCheck, RefreshCw, Truck, Award, ChevronDown } from 'lucide-react';
import { PriceDisplay, RatingStars, MenhBadge, ProductCard, Breadcrumb } from '../components/roxi-components';
import { useProduct, useProducts } from '../hooks/useProducts';
import { useShop } from '../context/ShopContext';

const REVIEWS = [
  { name: 'Nguyễn Thị Hoa', rating: 5, date: '15/05/2026', text: 'Đá đẹp xuất sắc, ảnh thực tế 100%. Giao hàng nhanh, đóng gói cẩn thận!' },
  { name: 'Trần Văn Minh', rating: 5, date: '02/05/2026', text: 'Mua lần thứ 3 rồi, chất lượng không bao giờ thất vọng.' },
];

export function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(slug);
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const { products: relatedAll } = useProducts(product ? { category: product.categorySlug, limit: '5' } : undefined);

  const [mainImg, setMainImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');
  const [faqOpen, setFaqOpen] = useState(false);
  const [added, setAdded] = useState(false);

  if (loading) return <div style={{ padding: 80, textAlign: 'center', color: '#6B6355' }}>Đang tải...</div>;
  if (error || !product) return <Navigate to="/danh-muc" replace />;

  const images = product.images ?? [product.image];
  const specs = product.specs ? Object.entries(product.specs) : [];
  const wished = isWishlisted(product.id);
  const savings = product.originalPrice ? product.originalPrice - product.price : 0;
  const related = relatedAll.filter(p => p.slug !== product.slug).slice(0, 4);

  const handleAdd = () => { addToCart(product, qty); setAdded(true); setTimeout(() => setAdded(false), 1400); };
  const handleBuyNow = () => { addToCart(product, qty); navigate('/gio-hang'); };

  return (
    <div style={{ background: '#0F0D0A', minHeight: '100vh', fontFamily: 'DM Sans,sans-serif' }}>
      <div className="page-container" style={{ maxWidth: 1440, margin: '0 auto', padding: '32px 32px 96px' }}>
        <Breadcrumb items={[{ label: 'Trang Chủ', path: '/' }, { label: product.category, path: `/danh-muc/${product.categorySlug}` }, { label: product.name.slice(0, 40) }]} />
        <div className="product-detail-grid" style={{ display: 'grid', gridTemplateColumns: '55% 1fr', gap: 64, marginBottom: 64, alignItems: 'start' }}>
          <div>
            <div style={{ position: 'relative', aspectRatio: '1/1', background: '#1A1612', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
              <img src={`${images[mainImg]}?w=800&h=800&fit=crop&auto=format`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: 12, left: 12, background: '#4A9B8E', color: '#fff', borderRadius: 2, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>✓ Ảnh thực tế 100%</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {images.map((img, i) => (
                <div key={i} onClick={() => setMainImg(i)} style={{ width: 80, height: 80, borderRadius: 2, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${mainImg === i ? '#C9A84C' : '#2E2820'}` }}>
                  <img src={`${img}?w=80&h=80&fit=crop&auto=format`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(22px,2.2vw,32px)', color: '#F5F0E8', marginBottom: 8, lineHeight: 1.2 }}>{product.name}</h1>
            {product.sku && <div style={{ fontSize: 12, color: '#6B6355', marginBottom: 14 }}>Mã: {product.sku}</div>}
            <div style={{ marginBottom: 16 }}><RatingStars rating={product.rating ?? 4.8} count={product.reviewCount} /></div>
            <div style={{ background: 'rgba(201,168,76,.06)', border: '1px solid rgba(201,168,76,.2)', borderRadius: 4, padding: '16px 18px', marginBottom: 24 }}>
              <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="lg" />
              {savings > 0 && <div style={{ fontSize: 13, color: '#4A9B8E', marginTop: 6 }}>✓ Tiết kiệm {savings.toLocaleString('vi-VN')} đ</div>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13, color: product.stock && product.stock <= 5 ? '#E8A000' : '#4A9B8E' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
              {product.stock && product.stock <= 5 ? `Còn hàng — ${product.stock} sản phẩm cuối` : 'Còn hàng'}
            </div>
            {specs.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, border: '1px solid #2E2820', borderRadius: 4, overflow: 'hidden', marginBottom: 24 }}>
                {specs.slice(0, 6).map(([k, v]) => (
                  <div key={k} style={{ padding: '10px 14px', background: '#211D18' }}>
                    <div style={{ fontSize: 11, color: '#6B6355', marginBottom: 2, textTransform: 'uppercase' }}>{k}</div>
                    <div style={{ fontSize: 13, color: '#F5F0E8', fontWeight: 500 }}>{v}</div>
                  </div>
                ))}
              </div>
            )}
            {product.menh && product.menh.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
                {product.menh.map(m => <MenhBadge key={m} menh={m as import('../api/client').MenhType} size="md" />)}
              </div>
            )}
            {product.fengShuiMeaning && (
              <div style={{ border: '1px solid #2E2820', borderRadius: 4, marginBottom: 24, overflow: 'hidden' }}>
                <button onClick={() => setFaqOpen(!faqOpen)} style={{ width: '100%', background: '#211D18', border: 'none', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: '#F5F0E8', fontFamily: 'Cormorant Garamond,serif', fontSize: 16 }}>
                  Ý Nghĩa Phong Thủy <ChevronDown size={16} style={{ color: '#C9A84C', transform: faqOpen ? 'rotate(180deg)' : 'none' }} />
                </button>
                {faqOpen && <div style={{ padding: '16px 18px', background: '#1A1612', fontSize: 13, color: '#A89F8C', lineHeight: 1.75 }}>{product.fengShuiMeaning}</div>}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #2E2820', borderRadius: 2 }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: 'none', border: 'none', color: '#A89F8C', width: 40, height: 48, cursor: 'pointer' }}><Minus size={14} /></button>
                <span style={{ width: 40, textAlign: 'center', fontSize: 15, color: '#F5F0E8', fontWeight: 600 }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ background: 'none', border: 'none', color: '#A89F8C', width: 40, height: 48, cursor: 'pointer' }}><Plus size={14} /></button>
              </div>
              <button onClick={() => toggleWishlist(product)} style={{ width: 48, height: 48, background: '#211D18', border: '1px solid #2E2820', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Heart size={18} style={{ color: wished ? '#C9A84C' : '#6B6355', fill: wished ? '#C9A84C' : 'none' }} />
              </button>
            </div>
            <button onClick={handleAdd} style={{ width: '100%', height: 52, background: added ? '#4A9B8E' : '#C9A84C', color: added ? '#fff' : '#0F0D0A', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', borderRadius: 2, marginBottom: 10 }}>
              {added ? '✓ Đã Thêm Vào Giỏ' : 'Thêm Vào Giỏ'}
            </button>
            <button onClick={handleBuyNow} style={{ width: '100%', height: 52, background: 'none', color: '#C9A84C', border: '1px solid #C9A84C', fontSize: 15, fontWeight: 600, cursor: 'pointer', borderRadius: 2, marginBottom: 24 }}>Mua Ngay</button>
            <div className="guarantee-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {[[Award, 'Chính hãng'], [RefreshCw, 'Đổi trả 3 ngày'], [ShieldCheck, 'Bảo hành'], [Truck, 'Giao nhanh']].map(([Icon, label]) => (
                <div key={label as string} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 6px', background: '#1A1612', border: '1px solid #2E2820', borderRadius: 4, textAlign: 'center' }}>
                  {/* @ts-expect-error */}
                  <Icon size={16} style={{ color: '#C9A84C' }} />
                  <span style={{ fontSize: 11, color: '#A89F8C' }}>{label as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #2E2820', marginBottom: 28 }}>
            {[['desc', 'Mô Tả'], ['specs', 'Thông Số'], ['reviews', 'Đánh Giá']].map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id)} style={{ background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === id ? '#C9A84C' : 'transparent'}`, color: activeTab === id ? '#C9A84C' : '#6B6355', padding: '12px 24px', fontSize: 14, cursor: 'pointer', marginBottom: -1 }}>{label}</button>
            ))}
          </div>
          {activeTab === 'desc' && <div style={{ color: '#A89F8C', lineHeight: 1.85, fontSize: 14, maxWidth: 800 }}><p>{product.description ?? 'Sản phẩm đá phong thủy tự nhiên chính hãng.'}</p></div>}
          {activeTab === 'specs' && specs.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 1, border: '1px solid #2E2820', borderRadius: 4, overflow: 'hidden', maxWidth: 640 }}>
              {specs.map(([k, v]) => (<div key={k} style={{ padding: '12px 16px', background: '#211D18' }}><span style={{ fontSize: 12, color: '#6B6355', display: 'block' }}>{k}</span><span style={{ fontSize: 14, color: '#F5F0E8' }}>{v}</span></div>))}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 700 }}>
              {REVIEWS.map((r, i) => (
                <div key={i} style={{ background: '#211D18', border: '1px solid #2E2820', borderRadius: 4, padding: '20px 22px' }}>
                  <div style={{ fontSize: 14, color: '#F5F0E8', fontWeight: 600, marginBottom: 8 }}>{r.name}</div>
                  <RatingStars rating={r.rating} />
                  <p style={{ fontSize: 13, color: '#A89F8C', marginTop: 10 }}>{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {related.length > 0 && (
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, color: '#F5F0E8', marginBottom: 24 }}>Sản Phẩm Liên Quan</h2>
            <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }}>
              {related.map(p => <ProductCard key={p.id} product={p} onAddToCart={addToCart} onClick={() => navigate(`/san-pham/${p.slug}`)} wished={isWishlisted(p.id)} onToggleWish={() => toggleWishlist(p)} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
