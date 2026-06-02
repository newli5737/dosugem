import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Minus, Plus, Trash2, Tag, ChevronRight } from 'lucide-react';
import { formatVND } from '../components/roxi-components';
import { useShop } from '../context/ShopContext';
import { api } from '../api/client';

const SHIPPING = 0;

export function CartCheckout() {
  const navigate = useNavigate();
  const { cart, updateQty, removeFromCart, clearCart } = useShop();

  const [view, setView] = useState<'cart' | 'checkout'>('cart');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [payMethod, setPayMethod] = useState<'cod' | 'bank'>('cod');
  const [ordered, setOrdered] = useState(false);

  const [orderNumber, setOrderNumber] = useState('');
  const [form, setForm] = useState({ customerName: '', phone: '', email: '', address: '', city: '', note: '' });
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal - discount + SHIPPING;

  const applyCoupon = async () => {
    try {
      await api.validateCoupon(coupon);
      setCouponApplied(true);
    } catch {
      alert('Mã giảm giá không hợp lệ');
    }
  };

  const placeOrder = async () => {
    if (!form.customerName || !form.phone || !form.address) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.createOrder({
        ...form,
        payMethod,
        couponCode: couponApplied ? coupon : undefined,
        items: cart.map(i => ({
          productId: i.product.slug,
          productName: i.product.name,
          productImage: i.product.image,
          price: i.product.price,
          qty: i.qty,
        })),
      });
      setOrderNumber(res.orderNumber);
      setOrdered(true);
      clearCart();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Đặt hàng thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  if (ordered) return (
    <div style={{ background: '#0F0D0A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans,sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: 480, padding: 32 }}>
        <div style={{ fontSize: 60, marginBottom: 20 }}>✨</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 36, color: '#F5F0E8', marginBottom: 12 }}>Đặt Hàng Thành Công!</h2>
        <p style={{ color: '#A89F8C', fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>Cảm ơn bạn đã tin tưởng DOSU Gem.</p>
        {orderNumber && <p style={{ color: '#C9A84C', fontSize: 16, fontWeight: 600, marginBottom: 32 }}>Mã đơn hàng: {orderNumber}</p>}
        <button onClick={() => navigate('/')}
          style={{ background: '#C9A84C', color: '#0F0D0A', border: 'none', padding: '14px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer', borderRadius: 2 }}>
          Tiếp Tục Mua Sắm
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#0F0D0A', minHeight: '100vh', fontFamily: 'DM Sans,sans-serif' }}>
      <div className="page-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 32px 96px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Giỏ Hàng', 'Thông Tin', 'Xác Nhận'].map((s, i) => {
            const active = (view === 'cart' && i === 0) || (view === 'checkout' && i === 1);
            const done = view === 'checkout' && i === 0;
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: active ? '#C9A84C' : done ? 'rgba(201,168,76,.3)' : '#2E2820', color: active ? '#0F0D0A' : done ? '#C9A84C' : '#6B6355', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, border: done ? '1px solid #C9A84C' : 'none', flexShrink: 0 }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? '#C9A84C' : done ? '#A89F8C' : '#6B6355' }}>{s}</span>
                </div>
                {i < 2 && <ChevronRight size={14} style={{ color: '#3A3028', margin: '0 12px' }} />}
              </div>
            );
          })}
        </div>

        {view === 'cart' ? (
          <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
            <div>
              <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, color: '#F5F0E8', marginBottom: 24 }}>Giỏ Hàng ({cart.length} sản phẩm)</h2>
              {cart.length === 0 ? (
                <div style={{ color: '#6B6355', padding: '60px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🛍️</div>
                  <div style={{ fontSize: 16, marginBottom: 8 }}>Giỏ hàng trống</div>
                  <button onClick={() => navigate('/danh-muc')} style={{ marginTop: 16, background: 'none', border: '1px solid #C9A84C', color: '#C9A84C', padding: '10px 24px', fontSize: 13, cursor: 'pointer', borderRadius: 2 }}>Tiếp Tục Mua Sắm</button>
                </div>
              ) : cart.map((item, idx) => (
                <div key={item.product.id}>
                  <div className="cart-item" style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto auto', gap: 16, alignItems: 'center', padding: '20px 0' }}>
                    <img src={`${item.product.image}?w=80&h=80&fit=crop&auto=format`} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 2, border: '1px solid #2E2820', cursor: 'pointer' }}
                      onClick={() => navigate(`/san-pham/${item.product.id}`)} />
                    <div>
                      <div onClick={() => navigate(`/san-pham/${item.product.id}`)} style={{ fontSize: 14, color: '#F5F0E8', fontWeight: 500, marginBottom: 4, lineHeight: 1.4, cursor: 'pointer' }}>{item.product.name}</div>
                      <div style={{ fontSize: 12, color: '#6B6355', marginBottom: 8 }}>{item.product.spec}</div>
                      <div style={{ color: '#C9A84C', fontSize: 14, fontWeight: 600 }}>{formatVND(item.product.price)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #2E2820', borderRadius: 2 }}>
                      <button onClick={() => updateQty(item.product.id, item.qty - 1)} style={{ background: 'none', border: 'none', color: '#A89F8C', width: 32, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={12} /></button>
                      <span style={{ width: 28, textAlign: 'center', fontSize: 13, color: '#F5F0E8', fontWeight: 600 }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.product.id, item.qty + 1)} style={{ background: 'none', border: 'none', color: '#A89F8C', width: 32, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={12} /></button>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#C9A84C', fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{formatVND(item.product.price * item.qty)}</div>
                      <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'none', border: 'none', color: '#6B6355', cursor: 'pointer', transition: 'color .15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#C0392B')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#6B6355')}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  {idx < cart.length - 1 && <div style={{ height: 1, background: '#2E2820' }} />}
                </div>
              ))}
            </div>

            <div style={{ background: '#1A1612', border: '1px solid #2E2820', borderRadius: 4, padding: 24, position: 'sticky', top: 80 }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, color: '#F5F0E8', marginBottom: 20 }}>Tóm Tắt Đơn Hàng</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#A89F8C' }}>
                  <span>Tạm tính</span><span style={{ color: '#F5F0E8' }}>{formatVND(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#A89F8C' }}>
                  <span>Phí vận chuyển</span><span style={{ color: '#4A9B8E' }}>Miễn phí</span>
                </div>
                {couponApplied && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#A89F8C' }}>
                    <span>Giảm giá (5%)</span><span style={{ color: '#C0392B' }}>−{formatVND(discount)}</span>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Mã giảm giá (DOSU5)"
                  style={{ flex: 1, background: '#211D18', border: '1px solid #2E2820', borderRadius: 2, color: '#F5F0E8', padding: '9px 12px', fontSize: 13, outline: 'none', fontFamily: 'DM Sans,sans-serif' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#C9A84C')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#2E2820')} />
                <button onClick={applyCoupon} style={{ background: '#211D18', border: '1px solid #2E2820', color: '#C9A84C', padding: '9px 12px', fontSize: 13, cursor: 'pointer', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
                  <Tag size={13} /> Áp dụng
                </button>
              </div>
              {couponApplied && <div style={{ fontSize: 12, color: '#4A9B8E', marginBottom: 16 }}>✓ Mã DOSU5 đã được áp dụng!</div>}
              <div style={{ borderTop: '1px solid #2E2820', paddingTop: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 700 }}>
                  <span style={{ color: '#F5F0E8' }}>Tổng cộng</span>
                  <span style={{ color: '#C9A84C' }}>{formatVND(total)}</span>
                </div>
              </div>
              <button onClick={() => { if (cart.length > 0) { setView('checkout'); } }} disabled={cart.length === 0}
                style={{ width: '100%', height: 48, background: cart.length === 0 ? '#3A3028' : '#C9A84C', color: cart.length === 0 ? '#6B6355' : '#0F0D0A', border: 'none', fontSize: 15, fontWeight: 700, cursor: cart.length === 0 ? 'default' : 'pointer', borderRadius: 2, transition: 'background .2s' }}>
                Tiến Hành Thanh Toán →
              </button>
            </div>
          </div>
        ) : (
          <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>
            <div>
              <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, color: '#F5F0E8', marginBottom: 28 }}>Thông Tin Giao Hàng</h2>
              <div className="checkout-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#6B6355', marginBottom: 6, textTransform: 'uppercase' }}>Họ và Tên</div>
                  <input required value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} placeholder="Nguyễn Văn A" style={{ width: '100%', background: '#211D18', border: '1px solid #2E2820', borderRadius: 2, color: '#F5F0E8', padding: '12px 14px', fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#6B6355', marginBottom: 6, textTransform: 'uppercase' }}>Số Điện Thoại</div>
                  <input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="0346 xxx xxx" style={{ width: '100%', background: '#211D18', border: '1px solid #2E2820', borderRadius: 2, color: '#F5F0E8', padding: '12px 14px', fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: '#6B6355', marginBottom: 6, textTransform: 'uppercase' }}>Email</div>
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" style={{ width: '100%', background: '#211D18', border: '1px solid #2E2820', borderRadius: 2, color: '#F5F0E8', padding: '12px 14px', fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: '#6B6355', marginBottom: 6, textTransform: 'uppercase' }}>Địa Chỉ</div>
                <input required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Số nhà, tên đường, phường/xã" style={{ width: '100%', background: '#211D18', border: '1px solid #2E2820', borderRadius: 2, color: '#F5F0E8', padding: '12px 14px', fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: '#6B6355', marginBottom: 6, textTransform: 'uppercase' }}>Tỉnh / Thành Phố</div>
                <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Hà Nội" style={{ width: '100%', background: '#211D18', border: '1px solid #2E2820', borderRadius: 2, color: '#F5F0E8', padding: '12px 14px', fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: '#6B6355', marginBottom: 6, textTransform: 'uppercase' }}>Ghi Chú</div>
                <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Ghi chú thêm (nếu có)" rows={3} style={{ width: '100%', background: '#211D18', border: '1px solid #2E2820', borderRadius: 2, color: '#F5F0E8', padding: '12px 14px', fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif', resize: 'none', boxSizing: 'border-box' }} />
              </div>

              <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, color: '#F5F0E8', margin: '24px 0 16px' }}>Phương Thức Thanh Toán</h3>
              <div className="payment-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {([['cod', '💵', 'COD — Tiền Mặt', 'Thanh toán khi nhận hàng'], ['bank', '🏦', 'Chuyển Khoản', 'Quét QR để thanh toán']] as const).map(([id, icon, label, sub]) => (
                  <div key={id} onClick={() => setPayMethod(id)}
                    style={{ border: `2px solid ${payMethod === id ? '#C9A84C' : '#2E2820'}`, borderRadius: 4, padding: '16px 18px', cursor: 'pointer', background: payMethod === id ? 'rgba(201,168,76,.06)' : '#1A1612', transition: 'all .2s' }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
                    <div style={{ fontSize: 14, color: '#F5F0E8', fontWeight: 600, marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 12, color: '#6B6355' }}>{sub}</div>
                    {id === 'bank' && payMethod === 'bank' && (
                      <div style={{ marginTop: 12, background: '#211D18', borderRadius: 4, padding: 10, textAlign: 'center' }}>
                        <div style={{ width: 80, height: 80, background: '#2E2820', borderRadius: 4, margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#6B6355' }}>QR Code</div>
                        <div style={{ fontSize: 11, color: '#6B6355' }}>MB Bank · 0346437915 · DOSU Gem</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#1A1612', border: '1px solid #2E2820', borderRadius: 4, padding: 24, position: 'sticky', top: 80 }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, color: '#F5F0E8', marginBottom: 18 }}>Đơn Hàng Của Bạn</h3>
              {cart.map(item => (
                <div key={item.product.id} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'center' }}>
                  <img src={`${item.product.image}?w=48&h=48&fit=crop&auto=format`} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 2, border: '1px solid #2E2820', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: '#A89F8C', lineHeight: 1.35, marginBottom: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.product.name}</div>
                    <div style={{ fontSize: 11, color: '#6B6355' }}>×{item.qty}</div>
                  </div>
                  <span style={{ fontSize: 13, color: '#C9A84C', fontWeight: 600, whiteSpace: 'nowrap' }}>{formatVND(item.product.price * item.qty)}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #2E2820', paddingTop: 14, marginTop: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
                  <span style={{ color: '#F5F0E8' }}>Tổng</span>
                  <span style={{ color: '#C9A84C' }}>{formatVND(total)}</span>
                </div>
                <button onClick={placeOrder} disabled={submitting}
                  style={{ width: '100%', height: 50, background: submitting ? '#3A3028' : '#C9A84C', color: submitting ? '#6B6355' : '#0F0D0A', border: 'none', fontSize: 15, fontWeight: 700, cursor: submitting ? 'wait' : 'pointer', borderRadius: 2 }}>
                  {submitting ? 'Đang xử lý...' : 'Đặt Hàng'}
                </button>
                <button onClick={() => setView('cart')} style={{ width: '100%', marginTop: 10, background: 'none', border: 'none', color: '#6B6355', fontSize: 13, cursor: 'pointer' }}>← Quay lại giỏ hàng</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
