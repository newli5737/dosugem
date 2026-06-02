import { useNavigate } from 'react-router';
import { Heart } from 'lucide-react';
import { ProductCard } from '../components/roxi-components';
import { useShop } from '../context/ShopContext';

export function WishlistPage() {
  const { wishlist, addToCart, toggleWishlist } = useShop();
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '32px 32px 48px' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(24px,3vw,36px)', color: '#F5F0E8', marginBottom: 8 }}>
        Danh Sách Yêu Thích
      </h1>
      <p style={{ fontSize: 14, color: '#6B6355', marginBottom: 32 }}>{wishlist.length} sản phẩm</p>

      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#6B6355' }}>
          <Heart size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <p style={{ fontSize: 16, marginBottom: 8 }}>Chưa có sản phẩm yêu thích</p>
          <p style={{ fontSize: 14, marginBottom: 24 }}>Nhấn biểu tượng trái tim trên sản phẩm để lưu lại</p>
          <button onClick={() => navigate('/danh-muc')}
            style={{ background: '#C9A84C', color: '#0F0D0A', border: 'none', padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', borderRadius: 2 }}>
            Khám Phá Sản Phẩm
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 14 }}>
          {wishlist.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={addToCart} onClick={() => navigate(`/san-pham/${p.slug}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
