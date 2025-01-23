import { CookiesProvider } from 'react-cookie'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import AuthProvider from './components/auth/AuthProvider'
import Item from './pages/Item'

function App() {

  return (
    <div className='flex flex-col min-h-screen items-center'>
      <CookiesProvider>
        <AuthProvider>
          <Navbar />
          {/* routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/item/:itemId" element={<Item />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </CookiesProvider>
    </div>

  )
}

export default App
