import { faBoxOpen, faClipboardList, faLeftLong, faPlus, faStore, faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { FiUser, FiShoppingCart, FiChevronDown } from 'react-icons/fi';
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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutAlert = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!"
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => {
          dispatch(userActions.logout());
          navigate('/');
        }, 300);
      }
    })
  }

  return user && (
    <nav className="bg-main flex items-center justify-between px-40 py-2 w-screen z-30">
      {/* Center section */}
      {
        user.role == EUserRole.BUYER && <div className="flex items-center space-x-6 text-black">
          <Link to="/" className="font-semibold text-gray-900 hover:text-black">Home</Link>
          <Link to="/shop" className="font-semibold text-gray-900 hover:text-black">Shop</Link>
          <a href="#footer" className="font-semibold text-gray-900 hover:text-black">Contacts</a>
        </div>
      }

      {/* Left section */}
      <div className="flex items-center space-x-4">
        <Link to='/' className="flex items-center space-x-1 text-black font-bold text-xl hover:scale-105 hover:text-gray-800 duration-200">
          <img className='h-10' src="/logo.png" alt="sparelk-logo" />
        </Link>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        {
          user.role == EUserRole.BUYER && <Link to='cart' className=' border-r-2 border-gray-700 pr-4 relative'>
            <FiShoppingCart className="text-black h-6 w-6 hover:text-gray-800 cursor-pointer hover:scale-105 hover:rotate-6 duration-75" />
            {
              cartItems.length > 0 && <div className='size-5 bg-red-600 border-2 text-sm text-white flex items-center justify-center border-red-400 rounded-full absolute -top-2 right-2'>
                {cartItems.length}
              </div>
            }
          </Link>
        }

        <div
          onMouseOver={() => setIsMenuOpen(true)}
          onMouseOut={() => setIsMenuOpen(false)}
          className="flex items-center gap-2 cursor-pointer relative"
        >
          <FiUser className="text-black h-6 w-6 hover:text-gray-800 cursor-pointer" />
          <span className="text-base text-gray-800">Welcome, <b>{user.firstName}</b></span>
          <FiChevronDown className={``} />

          {
            isMenuOpen && (
              <div className="absolute bg-yellow-300 shadow-md w-64 p-2 rounded-md top-[100%] right-0 left-0 m-auto">
                {
                  user.role === EUserRole.SELLER ? <>
                    <Li to="/" icon={faUser}>My Profile</Li>
                    <Li to="/seller-form" icon={faStore}>My Store</Li>
                    <Li to="/manage-items" icon={faClipboardList}>Manage Items</Li>
                    <Li to="/add-item/new" icon={faPlus}>Add a Item</Li>
                  </>
                    : user.role === EUserRole.BUYER ? <>
                      <Li to="/profile" icon={faUser}>My Profile</Li>
                      <Li to="/profile/my-orders" icon={faBoxOpen}>Orders</Li>
                      <Li to="/profile/seller-form" icon={faStore}>{user.store ? 'Store Profile' : 'Be a Seller'}</Li>
                    </>
                      : null
                }

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
