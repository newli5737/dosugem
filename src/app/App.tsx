import { BrowserRouter, Routes, Route } from 'react-router';
import { ShopProvider } from './context/ShopContext';
import { AdminAuthProvider } from './admin/AdminAuthContext';
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout, AdminLoginPage } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminProducts } from './admin/AdminProducts';
import { AdminProductForm } from './admin/AdminProductForm';
import { AdminOrders } from './admin/AdminOrders';
import { AdminCategories, AdminCoupons } from './admin/AdminCategories';
import { Homepage } from './screens/Homepage';
import { CategoryPage } from './screens/CategoryPage';
import { ProductDetail } from './screens/ProductDetail';
import { CartCheckout } from './screens/CartCheckout';
import { SearchPage } from './screens/SearchPage';
import { WishlistPage } from './screens/WishlistPage';

export default function App() {
  return (
    <ShopProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<Homepage />} />
              <Route path="danh-muc" element={<CategoryPage />} />
              <Route path="danh-muc/:categorySlug" element={<CategoryPage />} />
              <Route path="san-pham/:slug" element={<ProductDetail />} />
              <Route path="gio-hang" element={<CartCheckout />} />
              <Route path="tim-kiem" element={<SearchPage />} />
              <Route path="yeu-thich" element={<WishlistPage />} />
            </Route>
            <Route path="admin/dang-nhap" element={<AdminLoginPage />} />
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="san-pham" element={<AdminProducts />} />
              <Route path="san-pham/them" element={<AdminProductForm />} />
              <Route path="san-pham/:slug" element={<AdminProductForm />} />
              <Route path="danh-muc" element={<AdminCategories />} />
              <Route path="don-hang" element={<AdminOrders />} />
              <Route path="ma-giam-gia" element={<AdminCoupons />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </ShopProvider>
  );
}
