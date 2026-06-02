import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart, ShoppingBag } from 'lucide-react';
import type { Product, MenhType } from '../api/client';

export type { Product, MenhType } from '../api/client';

export function formatVND(n: number) {
  return n.toLocaleString('vi-VN') + ' đ';
}

const menhCfg: Record<MenhType, { color: string; bg: string; border: string; emoji: string }> = {
  Kim:  { color: '#D0D0D0', bg: 'rgba(208,208,208,0.12)', border: '#A0A0A0', emoji: '⬜' },
  Mộc:  { color: '#4CAF50', bg: 'rgba(76,175,80,0.12)',   border: '#4CAF50', emoji: '🟢' },
  Thủy: { color: '#64B5F6', bg: 'rgba(100,181,246,0.12)', border: '#64B5F6', emoji: '🔵' },
  Hỏa:  { color: '#EF5350', bg: 'rgba(239,83,80,0.12)',   border: '#EF5350', emoji: '🔴' },
  Thổ:  { color: '#A1887F', bg: 'rgba(161,136,127,0.12)', border: '#A1887F', emoji: '🟤' },
};

export function MenhBadge({ menh, size = 'sm' }: { menh: MenhType; size?: 'sm' | 'md' }) {
  const c = menhCfg[menh];
  return (
    <span style={{ color: c.color, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 999, padding: size === 'sm' ? '1px 7px' : '3px 11px', fontSize: size === 'sm' ? 10 : 12, fontFamily: 'DM Sans,sans-serif', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 3, whiteSpace: 'nowrap' }}>
      {c.emoji} Mệnh {menh}
    </span>
  );
}

export function MenhPill({ menh, active, onClick }: { menh: MenhType; active: boolean; onClick: () => void }) {
  const c = menhCfg[menh];
  return (
    <button onClick={onClick} style={{ color: active ? '#C9A84C' : c.color, background: active ? 'rgba(201,168,76,0.1)' : c.bg, border: `1px solid ${active ? '#C9A84C' : c.border}`, borderRadius: 999, padding: '8px 20px', fontSize: 14, fontFamily: 'DM Sans,sans-serif', fontWeight: 500, cursor: 'pointer', transition: 'all .2s', transform: active ? 'scale(1.05)' : 'scale(1)', boxShadow: active ? '0 0 12px rgba(201,168,76,.28)' : 'none' }}>
      {c.emoji} Mệnh {menh}
    </button>
  );
}

export function PriceDisplay({ price, originalPrice, size = 'md' }: { price: number; originalPrice?: number; size?: 'sm' | 'md' | 'lg' }) {
  const fs = { sm: 14, md: 16, lg: 24 }[size];
  const fo = { sm: 11, md: 13, lg: 16 }[size];
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, flexWrap: 'wrap' }}>
      <span style={{ color: '#C9A84C', fontWeight: 600, fontSize: fs, fontFamily: 'DM Sans,sans-serif' }}>{formatVND(price)}</span>
      {originalPrice && <span style={{ color: '#6B6355', textDecoration: 'line-through', fontSize: fo, fontFamily: 'DM Sans,sans-serif' }}>{formatVND(originalPrice)}</span>}
    </div>
  );
}

export function RatingStars({ rating, count }: { rating: number; count?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(i => <span key={i} style={{ color: i <= Math.round(rating) ? '#C9A84C' : '#3A3028', fontSize: 14 }}>★</span>)}
      <span style={{ color: '#C9A84C', fontSize: 13, fontWeight: 600 }}>{rating}</span>
      {count !== undefined && <span style={{ color: '#6B6355', fontSize: 12 }}>({count} đánh giá)</span>}
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (p: Product) => void;
  onClick?: () => void;
  wished?: boolean;
  onToggleWish?: () => void;
}

export function ProductCard({ product, onAddToCart, onClick, wished, onToggleWish }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: '#211D18', border: `1px solid ${hovered ? '#C9A84C44' : '#2E2820'}`, borderRadius: 4, overflow: 'hidden', transition: 'all .2s', transform: hovered ? 'scale(1.02)' : 'scale(1)', boxShadow: hovered ? '0 0 20px rgba(201,168,76,.12)' : 'none', cursor: onClick ? 'pointer' : 'default', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', background: '#1A1612', flexShrink: 0 }}>
        <img src={`${product.image}?w=400&h=400&fit=crop&auto=format`} alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s', transform: hovered ? 'scale(1.06)' : 'scale(1)' }} />
        {product.salePercent && (
          <div style={{ position: 'absolute', top: 8, left: 8, background: '#C0392B', color: '#fff', borderRadius: 2, padding: '2px 7px', fontSize: 11, fontWeight: 700, fontFamily: 'DM Sans,sans-serif' }}>−{product.salePercent}%</div>
        )}
        {product.isNew && !product.salePercent && (
          <div style={{ position: 'absolute', top: 8, left: 8, background: '#4A9B8E', color: '#fff', borderRadius: 2, padding: '2px 7px', fontSize: 11, fontWeight: 700, fontFamily: 'DM Sans,sans-serif' }}>MỚI</div>
        )}
        {product.isHot && !product.salePercent && !product.isNew && (
          <div style={{ position: 'absolute', top: 8, left: 8, background: '#C0392B', color: '#fff', borderRadius: 2, padding: '2px 7px', fontSize: 11, fontWeight: 700, fontFamily: 'DM Sans,sans-serif' }}>HOT</div>
        )}
        <button onClick={e => { e.stopPropagation(); onToggleWish?.(); }}
          style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(15,13,10,.7)', border: 'none', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Heart size={14} style={{ color: wished ? '#C9A84C' : '#A89F8C', fill: wished ? '#C9A84C' : 'none' }} />
        </button>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, transform: hovered ? 'translateY(0)' : 'translateY(100%)', transition: 'transform .2s' }}>
          <button onClick={handleAdd}
            style={{ width: '100%', padding: '10px', background: added ? '#C9A84C' : 'rgba(15,13,10,.92)', border: '1px solid #C9A84C', color: added ? '#0F0D0A' : '#C9A84C', fontFamily: 'DM Sans,sans-serif', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all .2s' }}>
            <ShoppingBag size={13} /> {added ? 'Đã Thêm ✓' : 'Thêm vào giỏ'}
          </button>
        </div>
      </div>
      <div style={{ padding: '13px 14px', display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
        <div style={{ color: '#F5F0E8', fontFamily: 'DM Sans,sans-serif', fontSize: 13, fontWeight: 500, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</div>
        <div style={{ color: '#6B6355', fontSize: 11, fontFamily: 'DM Sans,sans-serif' }}>{product.spec}</div>
        {product.menh && product.menh.length > 0 && (
          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {product.menh.map(m => <MenhBadge key={m} menh={m} />)}
          </div>
        )}
        <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="sm" />
      </div>
    </div>
  );
}

export function CategoryCard({ name, count, image, onClick }: { name: string; count: number; image: string; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={onClick}
      style={{ position: 'relative', borderRadius: 4, overflow: 'hidden', cursor: 'pointer', aspectRatio: '3/2', background: '#1A1612', border: `1px solid ${hovered ? '#C9A84C55' : '#2E2820'}`, transition: 'all .2s', boxShadow: hovered ? '0 0 20px rgba(201,168,76,.13)' : 'none' }}>
      <img src={`${image}?w=600&h=400&fit=crop&auto=format`} alt={name}
        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s', transform: hovered ? 'scale(1.04)' : 'scale(1)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(15,13,10,.88) 0%,rgba(15,13,10,.2) 55%,transparent 100%)' }} />
      <div style={{ position: 'absolute', top: 12, right: 12, background: '#C9A84C', color: '#0F0D0A', borderRadius: 999, padding: '2px 10px', fontSize: 11, fontWeight: 700, fontFamily: 'DM Sans,sans-serif' }}>{count} sp</div>
      <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, fontWeight: 500, color: '#F5F0E8' }}>{name}</div>
      </div>
    </div>
  );
}

export function Breadcrumb({ items }: { items: { label: string; path?: string }[] }) {
  const navigate = useNavigate();
  return (
    <div style={{ fontSize: 12, color: '#6B6355', marginBottom: 24, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            onClick={() => item.path && navigate(item.path)}
            style={{ cursor: item.path ? 'pointer' : 'default', color: i === items.length - 1 ? '#A89F8C' : '#6B6355', transition: 'color .15s' }}
            onMouseEnter={e => item.path && (e.currentTarget.style.color = '#C9A84C')}
            onMouseLeave={e => item.path && (e.currentTarget.style.color = i === items.length - 1 ? '#A89F8C' : '#6B6355')}
          >{item.label}</span>
          {i < items.length - 1 && <span>›</span>}
        </span>
      ))}
    </div>
  );
}
