import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { api } from '../api/api';
import { userActions } from '../reducers/userSlice';
import { cartActions } from '../reducers/cartSlice';
import CartItem from '../components/cart/CartItem';
import { FiInfo } from 'react-icons/fi';

function Cart() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const user = useSelector((state: RootState) => state.user);
    const items = useSelector((state: RootState) => state.cart.cartItems);
    const cart = useSelector((state: RootState) => state.cart);

    return (
        <div className="container xl:max-w-7xl flex-grow py-3 mt-12 min-h-svh">
      <h2 className="text-gray-800 mt-10 mb-3">Shopping Cart (5)</h2>

      <div className="grid grid-cols-3 gap-28">
        <div className="col-span-2 space-y-5">
          {new Array(5).fill(null).map((i) => (
            <CartItem />
          ))}
        </div>

        <div className="relative">
          <div className="sticky top-16">
            <h6 className="font-bold text-lg text-gray-700">Order Summary</h6>
            <div className="flex justify-between items-center border-b py-4 border-gray-500">
              <p className="text-gray-600">Subtotoal</p>
              <p className="text-gray-800 font-semibold">$249.00</p>
            </div>
            <div className="flex justify-between items-center border-b py-4 border-gray-500">
              <p className="text-gray-600">Shipping estimate</p>
              <p className="text-gray-800 font-semibold">$5.00</p>
            </div>
            <div className="flex justify-between items-center border-b py-4 border-gray-500">
              <p className="text-gray-600">Tax estimate</p>
              <p className="text-gray-800 font-semibold">$24.00</p>
            </div>
            <div className="flex justify-between items-center py-4">
              <p className="text-gray-600 font-semibold">Order Total</p>
              <p className="text-gray-800 font-semibold">$276.00</p>
            </div>
            <button
              type="button"
              className="w-full h-12 text-xl bg-gray-800 text-gray-200 rounded-3xl mt-3 hover:bg-gray-950 duration-300 ease-in-out"
            >
              Checkout
            </button>
            <p className="flex items-center text-sm text-gray-500 justify-center mt-4 gap-1">
              <FiInfo className="mr-2" />
              Learn more{" "}
              <b>
                <u>Taxes</u>
              </b>{" "}
              and{" "}
              <b>
                <u>Shipping</u>
              </b>{" "}
              infomation
            </p>
          </div>
        </div>
      </div>
    </div>
    )
}

export default Cart
