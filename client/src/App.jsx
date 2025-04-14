import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "./components/ui/sonner";

// Page Imports
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Success from "./pages/Success";
import Error from "./pages/Error";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/layouts/AdminLayout";
import CreateProducts from "./components/custom/CreateProducts";
import AllProducts from "./components/custom/AllProducts";
import Analytics from "./components/custom/Analytics";
import Settings from "./components/custom/Settings";
import Orders from "./components/custom/Orders";

// Layouts
import RootLayout from "./components/layouts/RootLayout";

// Custom Components
import ProtectedRoute from "./components/custom/ProtectedRoute";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <RootLayout>
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        </RootLayout>
      ),
    },
    {
      path: "/login",
      element: (
        <RootLayout>
          <Login />
        </RootLayout>
      ),
    },
    {
      path: "/signup",
      element: (
        <RootLayout>
          <Signup />
        </RootLayout>
      ),
    },
    {
      path: "/product/:productName",
      element: (
        <RootLayout>
          <Product />
        </RootLayout>
      ),
    },
    {
      path: "/checkout",
      element: (
        <ProtectedRoute>
          <RootLayout>
            <Checkout />
          </RootLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/orders",
      element: (
        <ProtectedRoute>
          <RootLayout>
            <MyOrders />
          </RootLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/success",
      element: (
        <RootLayout>
          <Success />
        </RootLayout>
      ),
    },
    {
      path: "/admin/login",
      element: (
        <RootLayout>
          <AdminLogin />
        </RootLayout>
      ),
    },
    {
      path: "/admin/dashboard",
      element: (
        <ProtectedRoute adminRequired>
          <AdminLayout>
            <CreateProducts />
          </AdminLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/dashboard/all-products",
      element: (
        <ProtectedRoute adminRequired>
          <AdminLayout>
            <AllProducts />
          </AdminLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/dashboard/analytics",
      element: (
        <ProtectedRoute adminRequired>
          <AdminLayout>
            <Analytics />
          </AdminLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/dashboard/settings",
      element: (
        <ProtectedRoute adminRequired>
          <AdminLayout>
            <Settings />
          </AdminLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/dashboard/orders",
      element: (
        <ProtectedRoute adminRequired>
          <AdminLayout>
            <Orders />
          </AdminLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "*",
      element: (
        <RootLayout>
          <Error />
        </RootLayout>
      ),
    },
  ]);

  return (
    <Provider store={store}>
      <Toaster />
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;
