import { CookiesProvider } from "react-cookie";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import AuthProvider from "./components/auth/AuthProvider";
import Item from "./pages/Item";
import Cart from "./pages/Cart";
import PlaceOrder from "./pages/Order";
import Profile from "./pages/Profile";
import MyProfile from "./components/Profile/MyProfile";
import MyOrders from "./components/Profile/MyOrders";
import SellerForm from "./components/Profile/SellerForm";
import ManageItems from "./components/Profile/ManageItems";
import AddItemForm from "./components/Profile/AddItemForm";
import Store from "./pages/Store";
import Shop from "./pages/Shop";
import AboutUs from "./pages/AboutUs";
import WarningSigns from "./pages/WarningSigns";
import ChatBot from "./components/ChatBot";
import { EUserRole } from "./types";
import Admin from "./pages/Admin";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";

function App() {
  const { user } = useSelector((root: RootState) => root.user);
  // const user = { role: EUserRole.SELLER }
  // TODO: Remove all unncessary imports.
  // TODO: Fix order numbers display the full ID from the database. Else the order numbers are wrong here.
  // TODO: Make sure finally the imports are also sorted in a more readable and clean way, without random imports here and there, making imports reading difficult.
  // TODO: Remove all unnecessary console.log statements in the project.

  return (
    <div className="flex flex-col min-h-screen h-screen items-center">
      <CookiesProvider>
        <AuthProvider>
          <Navbar />

          {/* routes */}
          <Routes>
            {user?.role === EUserRole.BUYER ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/warning-signs" element={<WarningSigns />} />
                <Route path="/item/:itemId" element={<Item />} />
                <Route
                  path="/cart/place-order/:cartId"
                  element={<PlaceOrder />}
                />
                <Route
                  path="/item/place-order/:itemId/:qty"
                  element={<PlaceOrder />}
                />
                <Route path="store/:storeId" element={<Store />} />
                <Route path="profile" element={<Profile />}>
                  <Route path="" element={<MyProfile />} />
                  <Route path="my-orders" element={<MyOrders />} />
                  <Route path="seller-form" element={<SellerForm />} />
                </Route>
              </>
            ) : user?.role === EUserRole.SELLER ? (
              <>
                <Route path="/" element={<Profile />}>
                  <Route path="/" element={<MyProfile />} />
                  <Route path="manage-items" element={<ManageItems />} />
                  <Route path="add-item/:itemId" element={<AddItemForm />} />
                  <Route path="seller-form" element={<SellerForm />} />
                </Route>
                <Route path="/item/:itemId" element={<Item />} />
                <Route path="store/:storeId" element={<Store />} />
              </>
            ) : user?.role === EUserRole.ADMIN ? (
              <>
                <Route path="/" element={<Admin />} />
              </>
            ) : null}
          </Routes>

          <ChatBot />
          <Footer />
        </AuthProvider>
      </CookiesProvider>
    </div>
  );
}

export default App;
