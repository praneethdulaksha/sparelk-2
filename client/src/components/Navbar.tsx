import {
  faBoxOpen,
  faClipboardList,
  faLeftLong,
  faPlus,
  faStore,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import {
  FiUser,
  FiShoppingCart,
  FiChevronDown,
  FiHome,
  FiGrid,
  FiLogOut,
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { userActions } from '../reducers/userSlice';
import Li from './Li';
import { EUserRole } from '../types';
import Swal from 'sweetalert2';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const [keyword, setKeyword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutAlert = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout!',
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => {
          dispatch(userActions.logout());
          navigate('/');
        }, 300);
      }
    });
  };

  return user ? (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-main hidden md:flex items-center gap-4 lg:gap-8 px-4 md:px-16 lg:px-28 py-2 w-screen z-30">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="flex items-center space-x-1 text-light font-bold text-xl hover:scale-105 hover:text-gray-800 duration-200"
          >
            <img className="h-6 lg:h-8" src="/logo-light.png" alt="sparelk-logo" />
          </Link>
        </div>

        {/* Center links */}
        {user.role == EUserRole.BUYER && (
          <div className="flex items-center space-x-2 lg:space-x-6 text-light text-sm">
            <Link to="/" className="font-semibold text-light hover:text-black">
              Home
            </Link>
            <Link to="/shop" className="font-semibold text-light hover:text-white">
              Shop
            </Link>
            <a href="#footer" className="font-semibold text-light hover:text-white">
              Contacts
            </a>
          </div>
        )}

        {/* Search bar */}
        {user.role !== EUserRole.SELLER ? (
          <form
            className="flex items-center flex-grow mx-10"
            onSubmit={(e) => {
              e.preventDefault();
              navigate('/shop', { state: { keyword } });
              setKeyword('');
            }}
          >
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              type="text"
              placeholder="Enter Item Code or name here..."
              className="border text-sm border-gray-300 rounded-l-full py-2 px-4 flex-grow"
            />
            <button className="bg-light border text-sm border-gray-300 text-main rounded-r-full px-4 py-2 hover:bg-light">
              Search
            </button>
          </form>
        ) : (
          <div className="flex-grow" />
        )}

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {user.role == EUserRole.BUYER && (
            <Link to="cart" className="relative border-r-2 border-gray-700 pr-4">
              <FiShoppingCart className="text-light h-6 w-6 hover:text-light cursor-pointer hover:scale-105 hover:rotate-6 duration-75" />
              {cartItems.length > 0 && (
                <div className="size-5 bg-red-600 border-2 text-sm text-white flex items-center justify-center border-red-400 rounded-full absolute -top-2 right-2">
                  {cartItems.length}
                </div>
              )}
            </Link>
          )}

          <div
            onMouseOver={() => setIsMenuOpen(true)}
            onMouseOut={() => setIsMenuOpen(false)}
            className="flex items-center gap-2 cursor-pointer relative"
          >
            <FiUser className="text-light h-6 w-6 hover:text-light cursor-pointer" />
            <span className="text-light text-sm">
              Welcome, <b>{user.firstName}</b>
            </span>
            <FiChevronDown />

            {isMenuOpen && (
              <div className="absolute bg-main text-light shadow-md w-64 p-2 rounded-md top-[100%] right-0 left-0 m-auto">
                {user.role === EUserRole.SELLER ? (
                  <>
                    <Li to="/" icon={faUser}>My Profile</Li>
                    <Li to="/seller-form" icon={faStore}>My Store</Li>
                    <Li to="/manage-items" icon={faClipboardList}>Manage Items</Li>
                    <Li to="/add-item/new" icon={faPlus}>Add a Item</Li>
                  </>
                ) : user.role === EUserRole.BUYER ? (
                  <>
                    <Li to="/profile" icon={faUser}>My Profile</Li>
                    <Li to="/profile/my-orders" icon={faBoxOpen}>Orders</Li>
                    <Li to="/profile/seller-form" icon={faStore}>
                      {user.store ? 'Store Profile' : 'Be a Seller'}
                    </Li>
                  </>
                ) : null}

                <Li to="/" icon={faLeftLong} onClick={logoutAlert}>Log Out</Li>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed bottom-0 w-full bg-main border-t border-gray-300 z-50 flex justify-around items-center py-2 shadow-md">
        <Link to="/" className="flex flex-col items-center text-sm text-light">
          <FiHome className="text-xl" />
          <span>Home</span>
        </Link>
        <Link to="/shop" className="flex flex-col items-center text-sm text-light">
          <FiGrid className="text-xl" />
          <span>Shop</span>
        </Link>
        {user.role === EUserRole.BUYER && (
          <Link to="/cart" className="flex flex-col items-center text-sm text-light relative">
            <FiShoppingCart className="text-xl" />
            <span>Cart</span>
            {cartItems.length > 0 && (
              <div className="absolute top-0 right-0 translate-x-2 -translate-y-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.length}
              </div>
            )}
          </Link>
        )}
        <Link to="/profile" className="flex flex-col items-center text-sm text-light">
          <FiUser className="text-xl" />
          <span>Profile</span>
        </Link>
        <button onClick={logoutAlert} className="flex flex-col items-center text-sm text-light">
          <FiLogOut className="text-xl" />
          <span>Logout</span>
        </button>
      </nav>
    </>
  ) : null;
};

export default Navbar;
