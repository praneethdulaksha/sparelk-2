import { useState } from 'react';
import { FiUser, FiShoppingCart, FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  return (
    <nav className="bg-main flex items-center justify-between px-40 py-3 w-screen z-30">
      {/* Left section */}
      <div className="flex items-center space-x-4">
        <Link to='/' className="flex items-center space-x-1 text-black font-bold text-xl hover:scale-105 hover:text-gray-800 duration-200">
          <span className="font-semibold">Spare.LK</span>
        </Link>
      </div>

      {/* Center section */}
      <div className="flex items-center space-x-6 text-black">
        <Link to="/" className="hover:text-white">Home</Link>
        <div className="relative group">
          <a href="#" className="hover:text-white flex items-center">
            Shop <span className="ml-1 text-sm">&#9660;</span>
          </a>
          {/* Dropdown menu */}
          <div className="absolute hidden group-hover:block bg-white text-black shadow-md mt-1 py-2 rounded">
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">Category 1</a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">Category 2</a>
          </div>
        </div>
        <Link to="/blog" className="hover:text-white">Blog</Link>
        <Link to="/aboutus" className="hover:text-white">About Us</Link>
        <Link to="/gallery" className="hover:text-white">Gallery</Link>
        <Link to="#footer" className="hover:text-white">Contacts</Link>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        <Link to='cart'><FiShoppingCart className="text-black h-6 w-6 hover:text-gray-800 cursor-pointer hover:scale-105 hover:rotate-6 duration-75" /></Link>
        <div
          onMouseOver={() => setIsMenuOpen(true)}
          onMouseOut={() => setIsMenuOpen(false)}
          className="flex items-center gap-2 cursor-pointer relative"
        >
          <FiUser className="text-black h-6 w-6 hover:text-gray-800 cursor-pointer" />
          <span className="text-base text-gray-800">Welcome, <b>Dilshan!</b></span>
          <FiChevronDown className='' />

          {
            isMenuOpen && (
              <div className="absolute bg-yellow-300 shadow-md w-64 p-2 rounded-md top-[100%] right-0">
                <Li to='/cart'>Cart</Li>
              </div>
            )
          }
        </div>
      </div>
    </nav>
  );
};

type LiProps = {
  to: string,
  children: React.ReactNode,
}

function Li({ children, to }: LiProps) {
  return (
    <Link
      to={to}
      className="block px-4 py-2 hover:bg-yellow-500 text-gray-700 hover:text-black rounded"
    >
      {children}
    </Link>
  )
}

export default Navbar;
