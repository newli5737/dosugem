import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, X } from 'lucide-react';
import { ProductCard } from '../components/roxi-components';
import { useShop } from '../context/ShopContext';
import { useProducts } from '../hooks/useProducts';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const { products: results, loading } = useProducts(query ? { search: query, limit: '20' } : undefined);

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '32px 32px 48px' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(24px,3vw,36px)', color: '#F5F0E8', marginBottom: 24 }}>Tìm Kiếm Sản Phẩm</h1>
      <div style={{ position: 'relative', marginBottom: 32, maxWidth: 600 }}>
        <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#6B6355' }} />
        <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm theo tên, loại đá, mệnh..."
          style={{ width: '100%', background: '#211D18', border: '1px solid #2E2820', borderRadius: 4, color: '#F5F0E8', padding: '14px 44px 14px 48px', fontSize: 15, outline: 'none', fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box' }} />
        {query && <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6B6355', cursor: 'pointer' }}><X size={18} /></button>}
      </div>
      {query && <p style={{ fontSize: 14, color: '#6B6355', marginBottom: 24 }}>{loading ? 'Đang tìm...' : `${results.length} kết quả cho "${query}"`}</p>}
      {!query && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#6B6355' }}>
          <Search size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <p style={{ fontSize: 15 }}>Nhập từ khóa để tìm đá phong thủy phù hợp</p>
        </div>
      )}
      {results.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 14 }}>
          {results.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={addToCart} onClick={() => navigate(`/san-pham/${p.slug}`)} wished={isWishlisted(p.id)} onToggleWish={() => toggleWishlist(p)} />
          ))}
        </div>
      )}
    </div>
  );
}
