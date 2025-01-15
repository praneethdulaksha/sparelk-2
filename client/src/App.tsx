import { CookiesProvider } from 'react-cookie'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'

function App() {

  return (
    <div className='w-screen flex flex-col items-center'>
      <CookiesProvider>
        <Navbar />

        {/* routes */}
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>

        <Footer />
      </CookiesProvider>
    </div>
  )
}

export default App
