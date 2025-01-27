import { CookiesProvider } from 'react-cookie'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import AuthProvider from './components/auth/AuthProvider'
import Item from './pages/Item'
import Cart from './pages/Cart'
import PlaceOrder from './pages/Order'

function App() {

  return (
    <div className='flex flex-col min-h-screen items-center'>
      <CookiesProvider>
        <AuthProvider>
          <Navbar />
          {/* routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/item/:itemId" element={<Item />} />
            <Route path='/cart/place-order/:cartId' element={<PlaceOrder />} />
            <Route path='/item/place-order/:itemId/:qty' element={<PlaceOrder />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </CookiesProvider>
    </div>

  )
}

export default App
