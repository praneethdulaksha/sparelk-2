import { faBoxOpen, faClipboardList, faLeftLong, faPlus, faStore, faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { FiUser, FiShoppingCart, FiChevronDown } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store/store';
import { userActions } from '../reducers/userSlice';
import Li from './Li';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.user)

  const dispatch = useDispatch();

  const logoutAlert = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('user');
      dispatch(userActions.logout());
    }
  }

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
          <a href="/shop" className="hover:text-white flex items-center">
            Shop
          </a>
          {/* Dropdown menu */}
          {/* <div className="absolute hidden group-hover:block bg-white text-black shadow-md mt-1 py-2 rounded">
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">Category 1</a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">Category 2</a>
          </div> */}
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
          className="flex items-center gap-2 cursor-pointer relative border-l-2 border-gray-700 pl-2"
        >
          <FiUser className="text-black h-6 w-6 hover:text-gray-800 cursor-pointer" />
          <span className="text-base text-gray-800">Welcome, <b>{user?.firstName}</b></span>
          <FiChevronDown className='' />

          {
            isMenuOpen && user && (
              <div className="absolute bg-yellow-300 shadow-md w-64 p-2 rounded-md top-[100%] right-0 left-0 m-auto">
                <Li to="/profile/my-profile" icon={faUser}>My Profile</Li>
                <Li to="/profile/my-orders" icon={faBoxOpen}>Orders</Li>
                <Li to="/profile/seller-form" icon={faStore}>{user.store ? 'Store Profile' : 'Be a Seller'}</Li>
                {user.store && <>
                  <Li to="/profile/manage-items" icon={faClipboardList}>Manage Items</Li>
                  <Li to="/profile/add-item/new" icon={faPlus}>Add a Item</Li>
                </>}
                <Li
                  to='/'
                  icon={faLeftLong}
                  onClick={() => {
                    logoutAlert();
                  }}
                >Log Out</Li>
              </div>
            )
          }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
