
# FIGMA MAKE — PROMPT: WEBSITE ĐÁ PHONG THỦY CAO CẤP (roxi.vn REDESIGN)

---

## OVERVIEW

Build a **fully responsive, luxury e-commerce website prototype** for a premium Vietnamese feng shui stone & jewelry shop (reference: roxi.vn). The site sells natural crystals, feng shui ornaments, Buddha statues, gemstone jewelry, and stone spheres.

**Design direction:** Refined luxury — dark earth tones, gold accents, editorial editorial layout. Feels like a high-end jewelry boutique, NOT a generic dropship store. Think: Tiffany & Co meets Vietnamese mysticism. Calm, authoritative, trustworthy.

---

## DESIGN TOKENS

```
Font: Display = "Cormorant Garamond" (serif, luxury feel)
      Body    = "DM Sans" (clean, readable)

Colors:
  --bg-primary:    #0F0D0A   (deep dark brown-black)
  --bg-secondary:  #1A1612   (slightly lighter)
  --bg-card:       #211D18   (card surface)
  --gold-primary:  #C9A84C   (warm gold)
  --gold-light:    #E8C97A   (highlight gold)
  --gold-subtle:   #C9A84C22 (gold tint bg)
  --text-primary:  #F5F0E8   (warm white)
  --text-secondary:#A89F8C   (muted warm)
  --text-muted:    #6B6355   (very muted)
  --accent-teal:   #4A9B8E   (secondary accent)
  --border:        #2E2820   (subtle border)
  --red-badge:     #C0392B   (sale badge)

Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128px
Border radius: 2px (sharp luxury), 4px (cards), 999px (pills/badges)
```

---

## PAGES TO DESIGN (6 screens)

---

### SCREEN 1 — TRANG CHỦ (Homepage) — Desktop 1440px + Mobile 390px

**Header / Sticky Navbar:**
- Left: Logo "ROXI" in Cormorant Garamond, gold color, + tagline "Đá Quý · Phong Thủy" in tiny caps below
- Center: Navigation links — Quả Cầu | Vật Phẩm | Linh Vật | Tượng Phật | Trang Sức | Quà Tặng | Hàng VIP
- Right: Search icon, wishlist icon (heart), cart icon (bag) with badge count
- Background: bg-primary with `backdrop-blur` effect when scrolled
- Mobile: hamburger menu, logo centered

**Hero Section:**
- Full-width, height: 90vh
- Background: dark gradient overlay on a moody photo of large stone spheres on natural stone surface
- Left-aligned text block (60% width):
  - Overline: "BỘ SƯU TẬP MỚI 2026" in gold small-caps tracking-[0.3em]
  - Headline: "Đá Quý Tự Nhiên\nChuẩn Phong Thủy" in Cormorant Garamond 72px, warm white, line-height 1.1
  - Body: "Từng viên đá được tuyển chọn kỹ càng từ các mỏ đá thiên nhiên trên khắp thế giới — chứng nhận chính hãng, bảo hành trọn đời." in DM Sans 16px, text-secondary
  - CTA buttons: Primary "Khám Phá Ngay" (gold bg, dark text) + Secondary "Tư Vấn Miễn Phí" (outlined gold)
- Bottom-right: floating product card (mini) showing a featured stone sphere with price — 3D-ish depth effect

**Trust Bar (below hero):**
- 4 columns with icons: "Miễn Phí Đổi Trả 3 Ngày" | "Bảo Hành Trọn Đời" | "Giao Hàng Toàn Quốc" | "Giảm 5% Khách Cũ"
- Thin gold top/bottom border
- bg-secondary background

**Section: Tra Cứu Theo Mệnh (Ngũ Hành Filter) — UNIQUE FEATURE:**
- Section title: "Tìm Đá Hợp Mệnh" centered, Cormorant 40px
- Subtitle: "Nhập năm sinh để tìm đá phong thủy phù hợp với bạn"
- Center input: large year-of-birth input field + "Tra Cứu" button
- Below input: 5 element pills (clickable filter): 
  - 🟤 Mệnh Thổ | ⬜ Mệnh Kim | 🟢 Mệnh Mộc | 🔴 Mệnh Hỏa | 🔵 Mệnh Thủy
  - Active state: gold border + gold text + gold glow
- bg: very subtle radial gradient gold glow from center

**Section: Danh Mục Nổi Bật:**
- 2-row grid of category cards, each with:
  - Full-bleed category image (stone photography, dark and moody)
  - Category name overlay (bottom-left, white, Cormorant)
  - Product count badge (top-right, gold pill)
  - Hover: subtle scale(1.03) + gold border glow
- Categories shown: Quả Cầu Thạch Anh | Tượng Phật | Trang Sức | Vật Phẩm Phong Thủy | Linh Vật | Quà Tặng Cao Cấp

**Section: Sản Phẩm Mới:**
- Section header: "Mới Về" left-aligned + "Xem Tất Cả →" right-aligned (gold link)
- Horizontal scroll on mobile / 4-column grid on desktop
- Product card design:
  - Dark card bg (#211D18), sharp corners (2px radius)
  - Product image square ratio, slight zoom on hover
  - Top-right: wishlist heart icon (hollow → filled gold on hover)
  - If on sale: "−22%" badge (red, top-left)
  - Product name: DM Sans 14px, text-primary, 2-line truncate
  - Weight/size spec: text-muted 12px (e.g. "2,59kg · 12,4cm")
  - Price: gold color, DM Sans semibold 16px
  - Old price (if sale): strikethrough, text-muted smaller
  - "Thêm vào giỏ" button: appears on hover, full-width, gold outlined

**Section: Sản Phẩm Khuyến Mãi:**
- Same as above but with prominent red sale badges
- Section title: "Đang Giảm Giá" with live countdown timer (HH:MM:SS) in red

**Section: Blog Phong Thủy:**
- 3-column cards, horizontal image top
- Category tag (e.g. "PHONG THỦY"), title, excerpt, "Xem thêm →"
- Minimal editorial style

**Footer:**
- 4 columns: Logo + tagline | Về chúng tôi (links) | Hỗ trợ đặt hàng (links) | Địa chỉ + Hotline + Zalo button
- Bottom bar: copyright + Bộ Công Thương badge
- bg: #0A0806 (darkest)
- Gold divider line at top of footer

---

### SCREEN 2 — TRANG DANH MỤC (Category Page) — Desktop 1440px

URL pattern: /qua-cau-thach-anh

**Breadcrumb:** Trang Chủ > Quả Cầu > Thạch Anh

**Page Header:**
- Category name large (Cormorant 48px)
- Product count: "(124 sản phẩm)"

**Layout: 2-column (Filters sidebar left 280px + Product grid right)**

**Left Sidebar — Bộ Lọc:**
- Section "Lọc theo Mệnh":
  - 5 checkboxes with colored dots: ⬤ Mệnh Kim | ⬤ Mệnh Thổ | ⬤ Mệnh Mộc | ⬤ Mệnh Hỏa | ⬤ Mệnh Thủy
- Section "Màu Sắc":
  - Color swatches grid: white, pink, yellow, green, purple, black, blue, red
  - Selected: gold ring around swatch
- Section "Khoảng Giá":
  - Dual-handle range slider (gold colored track)
  - Input fields: "500.000 đ" — "50.000.000 đ"
- Section "Kích Thước (cm)":
  - Checkboxes: < 8cm | 8–12cm | 12–16cm | > 16cm
- Section "Cân Nặng (kg)":
  - Checkboxes: < 0,5kg | 0,5–2kg | 2–5kg | > 5kg
- "Xóa bộ lọc" link in gold at bottom

**Right — Product Grid:**
- Sort bar: "Sắp xếp: Mới nhất ▾" | "Bán chạy" | "Giá tăng" | "Giá giảm"
- 3-column grid
- Product cards (same design as homepage)
- Pagination: prev | 1 2 3 ... 12 | next (gold active state)

**Mobile:** Filters in a slide-up bottom sheet triggered by "Lọc & Sắp xếp" sticky bar

---

### SCREEN 3 — TRANG CHI TIẾT SẢN PHẨM (Product Detail Page) — Desktop 1440px

URL: /qua-cau-thach-anh-den-2-59kg

**Layout: 2-column (Images left 55% | Info right 45%)**

**Left — Image Gallery:**
- Main image large with zoom on hover (magnifier effect)
- Thumbnail strip below (5 images): click to switch main
- Image counter "1 / 5"
- Badge: "✓ Ảnh thực tế 100%"

**Right — Product Info:**
- Breadcrumb (small)
- Product name: Cormorant 32px, text-primary, "Quả Cầu Thạch Anh Đen 2,59kg - 12,4cm"
- SKU: "Mã: CTAD0672" in text-muted
- Rating row: ★★★★★ 4.9 | (127 đánh giá) | gold stars
- Price block:
  - Current price: gold, large (3.100.000 đ)
  - Old price (if applicable): strikethrough smaller
  - Savings badge: "Tiết kiệm 680.000 đ" in green
- Stock status: "✓ Còn hàng — 3 sản phẩm cuối" (amber warning)

- **Thông số kỹ thuật** (specs grid 2-col):
  - Loại đá: Thạch Anh Đen | Cân nặng: 2,59 kg
  - Đường kính: 12,4 cm | Xuất xứ: Brazil
  - Mệnh hợp: Kim, Thủy | Màu sắc: Đen nguyên khối

- **Phong Thủy** expandable accordion section (shows feng shui meaning of this stone)

- **Nút hành động:**
  - "Thêm Vào Giỏ" — full-width, gold bg, dark text, large (52px height)
  - "Mua Ngay" — full-width, outlined gold
  - Wishlist icon button beside

- **Cam kết:** 4 icon badges inline: Hàng chính hãng | Đổi trả 3 ngày | Bảo hành | Giao nhanh

**Below fold — Tabs:**
- "Mô Tả" | "Thông Số" | "Đánh Giá (127)"
- Tab content styled with dark bg

**Related Products:** 4-col grid, same card style

---

### SCREEN 4 — GIỎ HÀNG & CHECKOUT — Desktop 1440px

**Giỏ Hàng (Cart Page):**
- Left col (65%): List of cart items
  - Each row: Product image | Name + specs | Quantity stepper (−/+) | Unit price | Total | Delete
  - Horizontal gold divider between items
- Right col (35%): Order summary card (sticky)
  - Subtotal, shipping, discount code input field
  - Total (gold, large)
  - "Tiến Hành Thanh Toán" CTA (full-width gold)

**Checkout Page:**
- Single page layout, no sidebar
- Progress steps: Giỏ Hàng → Thông Tin → Xác Nhận (gold active step)
- Form fields styled with dark bg, gold focus border:
  - Họ và Tên | Số Điện Thoại | Email | Địa Chỉ | Tỉnh/Thành | Ghi Chú
- Phương thức thanh toán: 2 radio cards:
  - COD (tiền mặt khi nhận) | Chuyển Khoản (with QR preview)
- Order summary sidebar (right)
- "Đặt Hàng" CTA

---

### SCREEN 5 — MEGA MENU OPEN STATE — Desktop

Show the navigation with mega menu expanded on "Quả Cầu":
- Full-width dropdown panel below nav (bg-secondary, gold top border 2px)
- 4-column layout inside:
  - Col 1: "Thạch Anh" header + 8 sub-links
  - Col 2: "Đá Núi Lửa" header + 5 sub-links  
  - Col 3: "Theo Mệnh" header + 5 mệnh links with colored dots
  - Col 4: Featured product card (large image + name + price + "Xem ngay" gold link)
- Elegant, spacious, not cramped

---

### SCREEN 6 — MOBILE HOMEPAGE (390px width)

Responsive version of Screen 1:
- Hamburger nav, logo centered
- Hero: full-height, text centered, stacked CTAs
- Mệnh pills: horizontal scroll
- Category grid: 2×3
- Product grid: 2 columns, compact cards
- Sticky bottom bar: Home | Danh Mục | Tìm Kiếm | Giỏ Hàng | Tài Khoản

---

## INTERACTION & MOTION NOTES

- **Page load:** Staggered fade-up (opacity 0→1 + translateY 20px→0) for hero elements, 100ms delay between each
- **Product card hover:** scale(1.02) + gold box-shadow glow (0 0 20px #C9A84C33) — 200ms ease
- **Mega menu:** Fade in + translateY(-8px→0) — 150ms
- **Add to cart button:** Brief shimmer sweep animation left-to-right on success
- **Mệnh pills:** Active state has gold border + inner gold glow + slight scale(1.05)
- **Countdown timer:** Digits flip animation (CSS perspective flip)
- **Image gallery:** Crossfade 200ms between images

---

## COMPONENT LIBRARY TO INCLUDE

Build as reusable components:
1. `ProductCard` (default + compact + featured variants)
2. `CategoryCard` (with image overlay)
3. `MenhBadge` (5 color variants for Kim/Mộc/Thủy/Hỏa/Thổ)
4. `PriceDisplay` (with/without original price)
5. `QuantityStepper`
6. `RatingStars`
7. `Button` (primary gold / outlined gold / ghost)
8. `Badge` (sale % / new / hot / stock-warning)
9. `BreadCrumb`
10. `FilterCheckbox` / `FilterSwatch` / `RangeSlider`

---

## QUALITY CHECKLIST

- [ ] All text is legible on dark backgrounds (WCAG AA minimum)
- [ ] Gold accents used consistently as the single accent color  
- [ ] Cormorant Garamond for all display/heading text
- [ ] DM Sans for all body/UI text
- [ ] Every interactive element has a visible hover AND focus state
- [ ] Mobile screen (390px) is fully designed, not just scaled-down desktop
- [ ] Images use realistic placeholder ratios (1:1 for products, 16:9 for blog, 3:2 for categories)
- [ ] Price formatting Vietnamese: "3.100.000 đ" (dots as thousand separators)
- [ ] Spacing is generous — luxury brands breathe

---

## REFERENCE SITES FOR MOOD

- https://roxi.vn (current site — keep category structure, redesign everything visually)
- Tiffany & Co website (luxury dark aesthetic)
- Net-a-Porter (editorial product photography style)
- mrporter.com (clean dark luxury ecommerce)
