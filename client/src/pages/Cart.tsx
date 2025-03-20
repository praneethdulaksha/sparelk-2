import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { api } from '../api/api';
import { cartActions } from '../reducers/cartSlice';
import CartItem from '../components/cart/CartItem';
import { FiInfo } from 'react-icons/fi';

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.user);
  const items = useSelector((state: RootState) => state.cart.cartItems);
  const cart = useSelector((state: RootState) => state.cart);

  const [total, setTotal] = useState(0)

  useEffect(() => {
    getCartItems();
  }, [])

  const updateCart = async () => {
    try {
      const res = await api.put(`cart/items/${cart.cartId}`, items);
      if (res.status === 200) {
        return true;
      }
      return false;
    } catch (err) {
      console.log('Failed to update cart:', err);
      return false;
    }
  }

  const getCartItems = () => {
    api.get('cart/' + user!._id).then(result => {
      console.log(result.data.data);
      dispatch(cartActions.addToCart(result.data.data.items));
    }).catch(err => console.log(err));
  }

  function updateTotal(tot: number) {
    setTotal(prevTotal => prevTotal + tot);
  }

  const handleCheckout = () => {
    updateCart().then(res => {
      if (res) {
        navigate(`/cart/place-order/${cart.cartId}`);
      } else {
        alert('Failed to update cart. Please try again.');
      }
    });
  }

  return items.length == 0 ?
    (
      <div className="flex flex-grow items-center justify-center h-full text-gray-500">
        <FiInfo className="w-10 h-10" />
        <p className="ml-3">No items in your cart</p>
      </div>
    )
    : (
      <div className="container xl:max-w-7xl flex-grow py-3 mt-12 min-h-svh">
        <h2 className="text-gray-800 mt-10 mb-3">Shopping Cart ({items.length})</h2>

        <div className="grid grid-cols-3 gap-28">
          <div className="col-span-2 space-y-5">
            {
              items.map((item) => (
                <CartItem key={item._id} cartItem={item} setTotal={updateTotal} />
              ))
            }
          </div>

          <div className="relative">
            <div className="sticky top-16">
              <h6 className="font-bold text-lg text-gray-700">Order Summary</h6>
              <div className="flex justify-between items-center border-b py-4 border-gray-500">
                <p className="text-gray-600">Subtotoal</p>
                <p className="text-gray-800 font-semibold">Rs. {total.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center border-b py-4 border-gray-500">
                <p className="text-gray-600">Shipping estimate</p>
                <p className="text-gray-800 font-semibold">Rs. 1.00</p>
              </div>
              <div className="flex justify-between items-center border-b py-4 border-gray-500">
                <p className="text-gray-600">Tax estimate</p>
                <p className="text-gray-800 font-semibold">Rs. 1.00</p>
              </div>
              <div className="flex justify-between items-center py-4">
                <p className="text-gray-600 font-semibold">Order Total</p>
                <p className="text-gray-800 font-semibold">Rs. {(total + 2).toFixed(2)}</p>
              </div>
              <button
                type="button"
                className="w-full h-12 text-xl bg-gray-800 text-gray-200 rounded-3xl mt-3 hover:bg-gray-950 duration-300 ease-in-out"
                onClick={handleCheckout}
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
