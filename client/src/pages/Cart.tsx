import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { api } from '../api/api';
import { userActions } from '../reducers/userSlice';
import { cartActions } from '../reducers/cartSlice';
import CartItem from '../components/cart/CartItem';

function Cart() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const user = useSelector((state: RootState) => state.user);
    const items = useSelector((state: RootState) => state.cart.cartItems);
    const cart = useSelector((state: RootState) => state.cart);

    const [total, setTotal] = useState(0)

    useEffect(() => {
        if (!user.isUserAuthed) {
            dispatch(userActions.setPreviosPage(location.pathname));
            navigate('/login');
        } else {
            getCartItems();
        }
    }, [])

    async function updateCart() {
        const respond = await api.put(`cart/items/${cart.cartId}`, items);
        console.log(respond.data.data);
        return true;
    }

    async function onCheckout() {
        // navigate('/cart/place-order/' + cart.cartId)
        if (await updateCart()) {
            console.log(items);
            navigate('/cart/place-order/' + cart.cartId)
        }
    }

    const getCartItems = () => {
        api.get('cart/' + user.user?._id).then(result => {
            console.log(result.data.data);
            dispatch(cartActions.addToCart(result.data.data.items));
        }).catch(err => console.log(err));
    }

    function updateTotal(tot: number) {
        setTotal(prevTotal => prevTotal + tot);
    }

    return (
        <main className="container xl:max-w-7xl flex-grow py-3 px-2 md:px-0">
            <h2 className="my-3 text-2xl md:text-4xl">Shoping Cart({cart.itemsCount})</h2>

            <div className="flex gap-3 w-full flex-col lg:flex-row">
                <div className='flex flex-grow flex-col gap-3 lg:w-2/3'>
                    {
                        items?.map((item, i) => {
                            return <CartItem key={i} cartItem={item} setTotal={updateTotal} />
                        })
                    }
                </div>

                <div className='lg:w-1/3'>
                    <div className='flex flex-col bg-pane-color rounded-2xl p-3 w-full'>
                        <h3 className='text-2xl md:text-4xl'>Order Summery</h3>
                        <div className='flex justify-between items-center mt-8'>
                            <h5 className='text-zinc-500'>Subtotal ({cart.itemsCount} items)</h5>
                            <h5 className=''>Rs. {parseFloat(total.toFixed(2))}</h5>
                        </div>
                        <div className='flex justify-between items-center mt-3'>
                            <h5 className='text-zinc-500'>Delivery Fee</h5>
                            <h5 className=''>Rs. 100</h5>
                        </div>
                        <div className='flex justify-between items-center mt-8'>
                            <h4>Total</h4>
                            <h4 className='text-price-color'>Rs. {parseFloat(total.toFixed(2)) + 100.00}</h4>
                        </div>
                        <button className='bg-navbar rounded-2xl w-64 h-12 self-center mt-8'
                            onClick={onCheckout}
                        >Checkout</button>
                    </div>
                </div>

            </div>
        </main>
    )
}

export default Cart
