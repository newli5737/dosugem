import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, RefreshCw, Shield, Truck, Percent } from 'lucide-react';
import { CategoryCard, ProductCard, MenhPill, type MenhType } from '../components/roxi-components';
import { useProducts, useCategories } from '../hooks/useProducts';
import { useShop } from '../context/ShopContext';

const U = 'https://images.unsplash.com/';

function Countdown() {
  const [t, setT] = useState({ h: 11, m: 47, s: 33 });
  useEffect(() => {
    const id = setInterval(() => setT(p => {
      let { h, m, s } = p; s--;
      if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 23; m = 59; s = 59; }
      return { h, m, s };
    }), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {[pad(t.h), pad(t.m), pad(t.s)].map((v, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ background: '#C0392B', color: '#fff', fontFamily: 'DM Sans,sans-serif', fontSize: 18, fontWeight: 700, padding: '4px 10px', borderRadius: 2, minWidth: 38, textAlign: 'center' }}>{v}</span>
          {i < 2 && <span style={{ color: '#C0392B', fontWeight: 700, fontSize: 18 }}>:</span>}
        </span>
      ))}
    </div>
  );
}

export function Homepage() {
  const [activeMenh, setActiveMenh] = useState<MenhType | null>(null);
  const [year, setYear] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const menhs: MenhType[] = ['Thổ', 'Kim', 'Mộc', 'Hỏa', 'Thủy'];
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const { categories } = useCategories();
  const { products: allProducts } = useProducts({ limit: '20' });

  const lookup = () => {
    const y = parseInt(year);
    if (!y || y < 1900 || y > 2010) return;
    const map: Record<number, MenhType> = { 0: 'Kim', 1: 'Thủy', 2: 'Thủy', 3: 'Mộc', 4: 'Mộc', 5: 'Hỏa', 6: 'Hỏa', 7: 'Thổ', 8: 'Thổ', 9: 'Kim' };
    const m = map[y % 10]; setResult(m); setActiveMenh(m);
  };

  const filtered = activeMenh ? allProducts.filter(p => p.menh?.includes(activeMenh)) : allProducts;
  const saleProducts = allProducts.filter(p => p.salePercent);

  return (
    <div style={{ background: '#0F0D0A', fontFamily: 'DM Sans,sans-serif' }}>
      <section className="hero-section" style={{ position: 'relative', height: '90vh', minHeight: 580, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={`${U}photo-1676721681490-9690e275a62e?w=1440&h=900&fit=crop&auto=format`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .42 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(108deg,rgba(15,13,10,.96) 0%,rgba(15,13,10,.6) 55%,rgba(15,13,10,.18) 100%)' }} />
        </div>
        <div className="page-container hero-content" style={{ position: 'relative', maxWidth: 1440, margin: '0 auto', padding: '0 32px', height: '100%', display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: 580 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.3em', color: '#C9A84C', textTransform: 'uppercase', fontWeight: 600, marginBottom: 20, opacity: 0, animation: 'fadeUp .6s .1s forwards' }}>DOSU GEM · BỘ SƯU TẬP 2026</div>
            <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(42px,5vw,70px)', fontWeight: 400, color: '#F5F0E8', lineHeight: 1.1, marginBottom: 22, opacity: 0, animation: 'fadeUp .6s .2s forwards' }}>
              Đá Quý Tự Nhiên<br />Chuẩn Phong Thủy
            </h1>
            <p style={{ fontSize: 16, color: '#A89F8C', lineHeight: 1.72, marginBottom: 36, maxWidth: 470, opacity: 0, animation: 'fadeUp .6s .3s forwards' }}>
              Từng viên đá được tuyển chọn kỹ càng từ các mỏ đá thiên nhiên trên khắp thế giới — chứng nhận chính hãng, bảo hành trọn đời.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', opacity: 0, animation: 'fadeUp .6s .4s forwards' }}>
              <button onClick={() => navigate('/danh-muc')}
                style={{ background: '#C9A84C', color: '#0F0D0A', border: 'none', padding: '14px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', borderRadius: 2, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 8 }}>
                Khám Phá Ngay <ArrowRight size={14} />
              </button>
              <a href="tel:0346437915" style={{ background: 'none', color: '#C9A84C', border: '1px solid #C9A84C', padding: '14px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', borderRadius: 2, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                Tư Vấn Miễn Phí
              </a>
            </div>
          </div>
        </div>
      </section>
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <section className="trust-bar" style={{ background: '#1A1612', borderTop: '1px solid rgba(201,168,76,.22)', borderBottom: '1px solid rgba(201,168,76,.22)' }}>
        <div className="page-container trust-grid" style={{ maxWidth: 1440, margin: '0 auto', padding: '20px 32px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {[[RefreshCw, 'Miễn Phí Đổi Trả 3 Ngày'], [Shield, 'Bảo Hành Trọn Đời'], [Truck, 'Giao Hàng Toàn Quốc'], [Percent, 'Giảm 5% Khách Cũ']].map(([Icon, label]) => (
            <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 11, justifyContent: 'center' }}>
              {/* @ts-expect-error lucide */}
              <Icon size={17} style={{ color: '#C9A84C', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#A89F8C', fontWeight: 500 }}>{label as string}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="page-container" style={{ padding: '80px 32px', textAlign: 'center', background: 'radial-gradient(ellipse at 50% 0%,rgba(201,168,76,.06) 0%,transparent 70%)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(26px,3vw,40px)', color: '#F5F0E8', marginBottom: 10 }}>Tìm Đá Hợp Mệnh</h2>
          <p style={{ fontSize: 15, color: '#A89F8C', marginBottom: 30 }}>Nhập năm sinh để tìm đá phong thủy phù hợp với bạn</p>
          <div style={{ display: 'flex', gap: 11, justifyContent: 'center', marginBottom: 22, flexWrap: 'wrap' }}>
            <input value={year} onChange={e => setYear(e.target.value)} onKeyDown={e => e.key === 'Enter' && lookup()} placeholder="Năm sinh (vd: 1990)" maxLength={4}
              style={{ background: '#211D18', border: '1px solid #2E2820', borderRadius: 2, color: '#F5F0E8', padding: '12px 20px', fontSize: 16, outline: 'none', width: 220, textAlign: 'center', fontFamily: 'DM Sans,sans-serif' }} />
            <button onClick={lookup} style={{ background: '#C9A84C', color: '#0F0D0A', border: 'none', padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', borderRadius: 2 }}>Tra Cứu</button>
          </div>
          {result && <div style={{ background: 'rgba(201,168,76,.08)', border: '1px solid rgba(201,168,76,.3)', borderRadius: 4, padding: '14px 20px', marginBottom: 22, fontSize: 14, color: '#E8C97A' }}>✨ Năm {year} thuộc <strong>Mệnh {result}</strong></div>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {menhs.map(m => <MenhPill key={m} menh={m} active={activeMenh === m} onClick={() => setActiveMenh(activeMenh === m ? null : m)} />)}
          </div>
        </div>
      </section>

      <section className="page-container" style={{ padding: '0 32px 80px', maxWidth: 1440, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(22px,2.5vw,32px)', color: '#F5F0E8', marginBottom: 28 }}>Danh Mục Nổi Bật</h2>
        <div className="category-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 14 }}>
          {categories.map(c => <CategoryCard key={c.slug} name={c.name} count={c.count} image={c.image} onClick={() => navigate(`/danh-muc/${c.slug}`)} />)}
        </div>
      </section>

      <section className="page-container" style={{ padding: '0 32px 80px', maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(22px,2.5vw,32px)', color: '#F5F0E8' }}>Mới Về</h2>
          <button onClick={() => navigate('/danh-muc')} style={{ background: 'none', border: 'none', color: '#C9A84C', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>Xem Tất Cả <ArrowRight size={13} /></button>
        </div>
        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 14 }}>
          {filtered.slice(0, 8).map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={addToCart} onClick={() => navigate(`/san-pham/${p.slug}`)} wished={isWishlisted(p.id)} onToggleWish={() => toggleWishlist(p)} />
          ))}
        </div>
      </section>

      {saleProducts.length > 0 && (
        <section className="page-container" style={{ padding: '0 32px 80px', maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
            <div>
              <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(22px,2.5vw,32px)', color: '#F5F0E8', marginBottom: 3 }}>Đang Giảm Giá</h2>
              <div style={{ fontSize: 11, color: '#6B6355', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Ưu đãi kết thúc trong</div>
            </div>
            <Countdown />
          </div>
          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 14 }}>
            {saleProducts.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} onClick={() => navigate(`/san-pham/${p.slug}`)} wished={isWishlisted(p.id)} onToggleWish={() => toggleWishlist(p)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
