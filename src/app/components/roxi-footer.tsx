import { Phone, MapPin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{ background: '#0A0806', borderTop: '1px solid rgba(201,168,76,.25)' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '64px 32px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 48, marginBottom: 48 }}>
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, color: '#C9A84C', fontWeight: 600, marginBottom: 4 }}>DOSU Gem</div>
            <div style={{ fontSize: 10, letterSpacing: '0.22em', color: '#6B6355', textTransform: 'uppercase', marginBottom: 14, fontFamily: 'DM Sans,sans-serif' }}>Đá Quý · Phong Thủy</div>
            <div style={{ color: '#6B6355', fontSize: 13, lineHeight: 1.75, fontFamily: 'DM Sans,sans-serif', maxWidth: 320 }}>
              CÔNG TY TNHH THƯƠNG MẠI & DỊCH VỤ DOSU — Đối tác công nghệ tin cậy, xây dựng giải pháp toàn diện từ ý tưởng đến sản phẩm hoàn thiện.
            </div>
          </div>
          {[
            { title: 'Về Chúng Tôi', links: ['Giới Thiệu', 'Chứng Nhận Chính Hãng', 'Blog Phong Thủy'] },
            { title: 'Hỗ Trợ Đặt Hàng', links: ['Hướng Dẫn Mua Hàng', 'Chính Sách Đổi Trả', 'Bảo Hành Sản Phẩm', 'Câu Hỏi Thường Gặp'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 16, color: '#C9A84C', marginBottom: 18, fontWeight: 500 }}>{col.title}</div>
              {col.links.map(l => (
                <div key={l} style={{ color: '#6B6355', fontSize: 13, padding: '4px 0', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', transition: 'color .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6B6355')}>{l}</div>
              ))}
            </div>
          ))}
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 16, color: '#C9A84C', marginBottom: 18, fontWeight: 500 }}>Liên Hệ</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, color: '#6B6355', fontSize: 13, fontFamily: 'DM Sans,sans-serif', lineHeight: 1.6 }}>
                <MapPin size={13} style={{ flexShrink: 0, marginTop: 3, color: '#C9A84C55' }} />
                Số 03, Ngách 72/59 Đường Tây Mỗ, Phường Tây Mỗ, TP Hà Nội
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: '#6B6355', fontSize: 13, fontFamily: 'DM Sans,sans-serif' }}>
                <Phone size={13} style={{ color: '#C9A84C55' }} />
                <a href="tel:0346437915" style={{ color: '#A89F8C', textDecoration: 'none' }}>0346 437 915</a>
                <span style={{ color: '#6B6355' }}>(Lại Thế Ngọc)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: '#6B6355', fontSize: 13, fontFamily: 'DM Sans,sans-serif' }}>
                <Mail size={13} style={{ color: '#C9A84C55' }} />
                <a href="mailto:support@dosutech.site" style={{ color: '#C9A84C', textDecoration: 'none' }}>support@dosutech.site</a>
              </div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #2E2820', paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ color: '#3A3028', fontSize: 12, fontFamily: 'DM Sans,sans-serif' }}>© 2026 CÔNG TY TNHH THƯƠNG MẠI & DỊCH VỤ DOSU — DOSU Gem. Tất cả quyền được bảo lưu.</div>
          <a href="/admin" style={{ color: '#3A3028', fontSize: 11, fontFamily: 'DM Sans,sans-serif', textDecoration: 'none' }}>CMS Admin</a>
        </div>
      </div>
    </footer>
  );
}
