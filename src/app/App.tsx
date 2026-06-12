import { createBrowserRouter, RouterProvider, Outlet } from 'react-router';
import { CartProvider } from './components/CartContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { MenuPage } from './components/MenuPage';
import { DishPage } from './components/DishPage';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { OrderStatus } from './components/OrderStatus';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Outlet />
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/menu/:category', element: <MenuPage /> },
      { path: '/prato/:id', element: <DishPage /> },
      { path: '/carrinho', element: <Cart /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/pedido/:id', element: <OrderStatus /> },
    ],
  },
  { path: '/admin', element: <AdminLogin /> },
  { path: '/admin/*', element: <AdminDashboard /> },
]);

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}
