import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { RootState } from '../store/store';
import { userActions } from '../reducers/userSlice';
import { api } from '../api/api';
import { cartActions } from '../reducers/cartSlice';
import OrderItem from '../components/order/OrderItem';
import CreditCardForm from '../components/order/CreditCardForm';
import AddressForm from '../components/order/AddressForm';

function PlaceOrder() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const params = useParams();

    const [orderItems, setOrderItems] = useState<any>([]);
    const [isAddressFormOpened, setAddressForm] = useState(false);
    const [isCreditCardFormOpened, setCreditCardForm] = useState(false);
    const [total, setTotal] = useState(0);

    const user = useSelector((state: RootState) => state.user.user);
    const isUserLoggedIn = useSelector((state: RootState) => state.user.isUserAuthed);
    const cartItems = useSelector((state: RootState) => state.cart.cartItems);

    if (!user) return <></>

    useEffect(() => {
        if (isUserLoggedIn) {
            getOrderItems()
        } else {
            dispatch(userActions.setPreviosPage(location.pathname))
            console.log(location.pathname);
            navigate('/login');
        }
    }, [])

    function getOrderItems() {
        if (location.pathname.split('/')[1] === 'item') {
            setOrderItems([{ itemId: params.itemId, qty: params.qty }]);
        } else if (location.pathname.split('/')[1] === 'cart') {
            setOrderItems(cartItems);
        }
    }

    function setOrderItemTotal(itemId: string, price: number) {
        setOrderItems((orderItems: any) => orderItems.map((item: any) => {
            if (item.itemId === itemId) {
                return { ...item, total: price }
            } else {
                return item
            }
        }));
    }

    function saveOrder() {
        api.post('order/' + (location.pathname.split('/')[1] === 'cart' ? 'cart' : 'item'), {
            userId: user?._id,
            orderItems: orderItems
        }).then(result => {
            console.log(result.data.data);
            orderConfirmedAlert();
            if (location.pathname.split('/')[1] === 'cart') dispatch(cartActions.clearCart());
            navigate('/');
        }).catch(err => {
            console.log(err);
        })
    }

    const orderConfirmedAlert = () => {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Order Placed Successfully",
            showConfirmButton: true,
            confirmButtonText: "Check Orders",
            timer: 3000
        }).then(result => {
            if (result.isConfirmed) {
                navigate('/profile/my-orders');
            }
        })
    }

    const placeOrderAlert = () => {
        if (!user?.address || !user.creditCard) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Please fill the address and credit card details',
            })
            return;
        }
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Place Order"
        }).then((result) => {
            if (result.isConfirmed) {
                saveOrder();
            }
        })
    }


    return (
        isUserLoggedIn &&
        <main className="container xl:max-w-7xl flex-grow py-3">
            <h2 className="my-3 text-3xl md:text-4xl">Place Order</h2>

            <div className="flex gap-3 w-full flex-col lg:flex-row">
                <div className='flex flex-grow flex-col gap-3 lg:w-2/3'>
                    <div className='bg-pane-color rounded-2xl flex flex-col p-3'>
                        <h5>Buyer Imformation</h5>
                        <div className='grid grid-cols-7 md:grid-cols-6 mt-3'>
                            <h6 className='col-span-2 md:col-span-1 text-zinc-500 row-span-2 text-sm md:text-base'>Dilver to </h6>
                            <h6 className='col-span-5 text-sm md:text-base'>: {user.firstName + " " + user.lastName}</h6>
                            <h6 className='col-span-5 text-sm md:text-base'>
                                {
                                    user.address ?
                                        <span>{` ${user.address.no}, ${user.address.street}, ${user.address.city}`}</span>
                                        : <span className='text-red-500'>Please add a address.</span>
                                }
                                <button className='ml-3 text-xl'
                                    onClick={() => {
                                        setAddressForm(!isAddressFormOpened);
                                    }}
                                ><FontAwesomeIcon icon={faPenToSquare} /></button>
                                {
                                    isAddressFormOpened && <AddressForm isAddressFormOpened={isAddressFormOpened} currentAdd={user.address} setAddressForm={setAddressForm} />
                                }
                            </h6>
                            <h6 className='col-span-2 md:col-span-1 text-zinc-500 text-sm md:text-base'>Email to </h6>
                            <h6 className='col-span-5 text-sm md:text-base'>: {user.email}</h6>
                            <h6 className='col-span-2 md:col-span-1 text-zinc-500 text-sm md:text-base'>Credit Card </h6>
                            <h6 className='col-span-5 text-sm md:text-base'>
                                {user.creditCard ?
                                    <span>: **** **** **** {user.creditCard.number.substring(12)}</span>
                                    : <span className='text-red-500'>: Doesn't have a credit card. Add one</span>
                                }
                                <button className='ml-3 text-xl'
                                    onClick={() => {
                                        setCreditCardForm(!isCreditCardFormOpened);
                                    }}
                                ><FontAwesomeIcon icon={faPenToSquare} /></button>
                                {
                                    isCreditCardFormOpened && <CreditCardForm currentCard={user.creditCard} setCreditCardForm={setCreditCardForm} />
                                }
                            </h6>
                        </div>
                    </div>

                    <div className='bg-pane-color p-3 rounded-2xl'>
                        <h5 className=' text-3xl md:text-4xl'>Order Information</h5>
                        {
                            new Array(2).fill(null).map((oItem: any, i: number) => {
                                return <OrderItem key={i} oItem={{} as any} index={i} setTotal={setTotal} setOrderItemTotal={setOrderItemTotal} />
                            })
                        }
                        <div className='flex items-center justify-end mt-8 mr-2'>
                            <h5 className='text-zinc-500 mr-3 text-lg'>{orderItems.length} item(s) Sub Total</h5>
                            <h4 className='text-price-color text-1xl md:text-2xl'> Rs. {parseFloat(total.toFixed(2))}</h4>
                        </div>
                    </div>
                </div>

                <div className='lg:w-1/3'>
                    <div className='flex flex-col bg-pane-color rounded-2xl p-3 w-full'>
                        <h3 className='text-3xl md:text-4xl'>Order Summery</h3>
                        <div className='flex justify-between items-center mt-8'>
                            <h5 className='text-zinc-500'>Items Total</h5>
                            <h5 className=''>Rs. {parseFloat(total.toFixed(2))}</h5>
                        </div>
                        <div className='flex justify-between items-center mt-3'>
                            <h5 className='text-zinc-500'>Delivery Fee</h5>
                            <h5 className=''>Rs. 100</h5>
                        </div>
                        <div className='flex justify-between items-center mt-8'>
                            <h4>Total</h4>
                            <h4 className='text-price-color'>Rs. {parseFloat(total.toFixed(2)) + 100}</h4>
                        </div>

                        <Link to='' className='bg-navbar rounded-2xl w-64 h-12 self-center mt-8'
                            onClick={() => {
                                placeOrderAlert();
                            }}
                        ><button className='text-center h-full w-full'>Place Order</button></Link>

                    </div>
                </div>

            </div>
        </main>
    )
}

export default PlaceOrder
