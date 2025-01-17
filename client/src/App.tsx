import { CookiesProvider } from 'react-cookie'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import AuthProvider from './components/auth/AuthProvider'

function App() {

  return (
    <CookiesProvider>
      <AuthProvider>
        <Navbar />
        {/* routes */}
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </CookiesProvider>
  )
}

export default App
