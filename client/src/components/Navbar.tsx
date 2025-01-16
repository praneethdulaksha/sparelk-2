import React from 'react';
import { FiUser, FiShoppingCart } from 'react-icons/fi';

const Navbar = () => {
  return (
    <nav className="bg-main flex items-center justify-between px-40 py-3 w-screen z-30">
      {/* Left section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1 text-black font-bold text-xl">
          <span className="font-semibold">Spare.LK</span>
        </div>
      </div>

      {/* Center section */}
      <div className="flex items-center space-x-6 text-black">
        <a href="#" className="hover:text-white">Home</a>
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
        <a href="#" className="hover:text-white">Blog</a>
        <a href="#" className="hover:text-white">About Us</a>
        <a href="#" className="hover:text-white">Gallery</a>
        <a href="#" className="hover:text-white">Contacts</a>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        <FiUser className="text-black h-6 w-6 hover:text-gray-800 cursor-pointer" />
        <FiShoppingCart className="text-black h-6 w-6 hover:text-gray-800 cursor-pointer" />
      </div>
    </nav>
  );
};

export default Navbar;
