import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import App from "../App";
import RegisterBuyerPage from "../features/auth/pages/RegisterBuyerPage";
import RegisterSellerPage from "../features/auth/pages/RegisterSellerPage";
import CartPage from "../features/cart/pages/CartPage";
import ProfilePage from "../features/profile/page/ProfilePage";
import CatalogPage from "../features/products/pages/CatalogPage";
import PaymentPage from "@/features/orders/pages/PaymentPage";
import RequireAuth from "@/shared/ui/RequireAuth";
import CheckoutPage from "@/features/orders/pages/CheckoutPage";
import OrdersPage from "@/features/orders/pages/OrdersPage";
import ProductPage from "@/features/products/pages/ProductPage";
import RequireRole from "@/shared/ui/RequireRole";
import SellerProductsPage from "@/features/seller/pages/SellerProductsPage";
import NewProductPage from "@/features/seller/pages/NewProductPage";
import EditProductPage from "@/features/seller/pages/EditProductPage";
import SellerOrdersPage from "@/features/seller/pages/SellerOrdersPage";
import SellerStatisticsPage from "@/features/seller/pages/SellerStatisticsPage";
import ModerationPage from "@/features/admin/pages/ModerationPage";
import UsersPage from "@/features/admin/pages/UsersPage";
import AllOrdersPage from '@/features/admin/pages/AllOrdersPage'

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register/buyer",
        element: <RegisterBuyerPage />,
      },
      {
        path: "register/seller",
        element: <RegisterSellerPage />,
      },
      {
        path: "register",
        element: <Navigate to="/register/buyer" replace />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "catalog",
        element: <CatalogPage />,
      },
      {
        index: true,
        element: <Navigate to="/catalog" replace />,
      },
      {
        path: "payment/:orderId",
        element: (
          <RequireAuth>
            <PaymentPage />
          </RequireAuth>
        ),
      },
      {
        path: "checkout",
        element: (
          <RequireAuth>
            <CheckoutPage />
          </RequireAuth>
        ),
      },
      {
        path: "profile/orders",
        element: (
          <RequireAuth>
            <OrdersPage />
          </RequireAuth>
        ),
      },
      {
        path: "product/:productId",
        element: <ProductPage />,
      },
      {
        path: "seller/products",
        element: (
          <RequireAuth>
            <RequireRole role="seller" redirectTo="/catalog">
              <SellerProductsPage />
            </RequireRole>
          </RequireAuth>
        ),
      },
      {
        path: "seller/products/new",
        element: (
          <RequireAuth>
            <RequireRole role="seller" redirectTo="/catalog">
              <NewProductPage />
            </RequireRole>
          </RequireAuth>
        ),
      },
      {
        path: "seller/products/edit/:productId",
        element: (
          <RequireAuth>
            <RequireRole role="seller" redirectTo="/catalog">
              <EditProductPage />
            </RequireRole>
          </RequireAuth>
        ),
      },
      {
        path: "seller/orders",
        element: (
          <RequireAuth>
            <RequireRole role="seller" redirectTo="/catalog">
              <SellerOrdersPage />
            </RequireRole>
          </RequireAuth>
        ),
      },
      {
        path: "seller/statistics",
        element: (
          <RequireAuth>
            <RequireRole role="seller" redirectTo="/catalog">
              <SellerStatisticsPage />
            </RequireRole>
          </RequireAuth>
        ),
      },
      {
        path: "admin/moderation",
        element: (
          <RequireAuth>
            <RequireRole role="admin" redirectTo="/catalog">
              <ModerationPage />
            </RequireRole>
          </RequireAuth>
        ),
      },
      {
        path: "admin/users",
        element: (
          <RequireAuth>
            <RequireRole role="admin" redirectTo="/catalog">
              <UsersPage />
            </RequireRole>
          </RequireAuth>
        ),
      },
      {
        path: "admin/orders",
        element: (
          <RequireAuth>
            <RequireRole role="admin" redirectTo="/catalog">
              <AllOrdersPage />
            </RequireRole>
          </RequireAuth>
        ),
      },
    ],
  },
]);
