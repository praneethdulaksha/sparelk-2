import { faBoxOpen, faClipboardList, faLeftLong, faPlus, faStore, faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { FiUser, FiShoppingCart, FiChevronDown } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store/store';
import { userActions } from '../reducers/userSlice';
import Li from './Li';
import { EUserRole } from '../types';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.user)

  const dispatch = useDispatch();

  const logoutAlert = () => {
    dispatch(userActions.logout());
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
        <Link to="/" className="font-semibold text-gray-800 hover:text-black">Home</Link>
        <Link to="/shop" className="font-semibold text-gray-800 hover:text-black">Shop</Link>
        <a href="#footer" className="font-semibold text-gray-800 hover:text-black">Contacts</a>
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
                {user.role === EUserRole.SELLER && <>
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
