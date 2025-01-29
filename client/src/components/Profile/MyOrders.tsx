import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faEmptyStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { RootState } from '../../store/store';
import { api } from '../../api/api';
import { TItem } from '../../types';

export default function MyOrders() {

    const userId = useSelector((state: RootState) => state.user.user?._id);

    const [status, setStatus] = useState('All');
    const [orderItems, setOrderItems] = useState([]);
    const [refresh, setRefresh] = useState(false);


    useEffect(() => {
        getOrderItems();
    }, [refresh])


    function getOrderItems() {
        api.get('order/' + userId).then(response => {
            setOrderItems(response.data.data.reverse());
        }).catch(err => console.error(err));
    }

    return (
        <div>
            <nav className='flex justify-around border-b mt-4 pb-4 mx-2 w-full'>
                <button className='focus:text-orange-400 hover:text-orange-400 text-sm md:text-lg' onClick={() => setStatus('All')}>All</button>
                <button className='focus:text-orange-400 hover:text-orange-400 text-sm md:text-lg' onClick={() => setStatus('Pending')}>Pending</button>
                <button className='focus:text-orange-400 hover:text-orange-400 text-sm md:text-lg' onClick={() => setStatus('Received')}>Received</button>
                <button className='focus:text-orange-400 hover:text-orange-400 text-sm md:text-lg' onClick={() => setStatus('Canceled')}>Canceled</button>
            </nav>

            <div className='flex flex-col items-center justify-center mx-4'>
                {
                    status === 'All' ?
                        orderItems.map((order, i) => {
                            return (
                                <OrderItem key={i} oItem={order} setRefresh={setRefresh} />
                            )
                        })
                        : orderItems.map((order: any, i) => {
                            if (order.status === status) {
                                return (
                                    <OrderItem key={i} oItem={order} setRefresh={setRefresh} />
                                )
                            }
                        })
                }
            </div>
        </div>
    )
}

function OrderItem({ oItem, setRefresh }: any) {
    const [order, setOrder] = useState(oItem)
    const [item, setItem] = useState<TItem>();
    const [isReviewFormOpened, setReviewFormOpened] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getItem();
    }, [])

    function getItem() {
        api.get('item/' + order.itemId).then(result => {
            setItem(result.data.data);
        }).catch(err => console.log(err));
    }

    function submitReview(review: any) {
        api.put('order/review', { ...order, review: review }).then(result => {
            setOrder({ ...order, review: review });
            setRefresh(true);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your review has been submitted",
                showConfirmButton: false,
                timer: 1500
            });
        }).catch(err => console.log(err));
    }

    function confirmOrder() {
        api.put('order', { ...order, status: 'Received', receivedDate: new Date().toLocaleString() }).then(result => {
            setOrder({ ...order, status: 'Received', receivedDate: new Date().toLocaleString() });
            setRefresh(true);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Order Confirmed",
                text: "Now you can review your order",
                showConfirmButton: false,
                timer: 2500
            });
        }).catch(err => console.log(err));
    }

    function cancelOrder() {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this order!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Cancel Order!"
        }).then((result) => {
            if (result.isConfirmed) {
                api.put('order', { ...order, status: 'Canceled' }).then(result => {
                    setOrder({ ...order, status: 'Canceled' });
                    setRefresh(true);
                }).catch(err => console.log(err));

                Swal.fire({
                    title: "Order Canceled!",
                    icon: "success"
                });
            }
        });
    }

    return order && item && (
        <>
            <label className='w-full mt-5 mb-1 text-gray-400 text-sm'>#{order._id}</label>
            <div className='flex border-b pane-color-zinc-300 pb-6 w-full'>
                <div className='flex flex-grow justify-between md:mr-3 flex-col md:flex-row gap-2'>
                    <div className='flex gap-3 items-center'>
                        <div className='h-20 aspect-square cursor-pointer hover:scale-105 bg-cover bg-center' style={{ backgroundImage: `url(http://localhost:3000/images/${item.image})` }} onClick={() => navigate(`/item/${oItem.itemId}`)} ></div>
                        <div className='flex flex-col justify-between'>
                            <h4 className='text-price-color text-lg md:hidden'>Rs. {order.total.toFixed(2)}</h4>
                            <h6 className='truncate w-56 lg:w-96'>{item.name}</h6>
                            <span>
                                <h6 className='text-gray-500 mr-2'>Qty</h6>
                                <h6>{order.qty}</h6>
                            </span>
                            <h6 className='text-orange-500 text-sm'>Ordered : {order.orderDate}</h6>
                            {order.status == 'Received' && <h6 className='text-green-600 text-sm'>Recivied : {order.receivedDate}</h6>}
                        </div>
                    </div>

                    <h4 className='text-price-color h-full text-base md:text-xl hidden md:block'>Rs. {order.total.toFixed(2)}</h4>

                    <div className='flex flex-col md:items-end justify-between gap-2 items-center'>
                        {/* <h6 className='bg-green-200 rounded-md px-2 text-sm'>{order.status}</h6> */}
                        {
                            order.status === 'Pending' ?
                                <h6 className='bg-orange-300 rounded-md px-2 text-sm w-fit self-end'>Pending</h6>
                                : order.status === 'Received' ?
                                    <h6 className='bg-green-200 rounded-md px-2 text-sm w-fit self-end'>Received</h6>
                                    :
                                    <h6 className='bg-red-200 rounded-md px-2 text-sm w-fit self-end'>Canceled</h6>
                        }
                        {
                            order.status === 'Received' && (!order.review ? <button className='bg-yellow-300 px-3 rounded-md text-base shadow-lg hover:bg-yellow-400 duration-75 w-full sm:w-1/3 md:w-full'
                                onClick={() => setReviewFormOpened(!isReviewFormOpened)}>Review Item</button> : <h6 className='bg-yellow-200 px-2 rounded-md border border-gray-400 w-full sm:w-1/3 md:w-full'>Reviewed</h6>)
                        }
                        {isReviewFormOpened && <ReviewForm setReviewFormOpened={setReviewFormOpened} submitReview={submitReview} />}
                        {order.status === 'Pending' && <button className='bg-green-400 px-3 rounded-md text-base shadow-lg hover:bg-green-500 duration-75 w-full sm:w-1/3 md:w-full' onClick={() => confirmOrder()}>Confirm Order</button>}
                        {order.status === 'Pending' && <button className='bg-red-400 px-3 rounded-md text-base shadow-lg hover:bg-red-500 duration-75 w-full sm:w-1/3 md:w-full' onClick={() => cancelOrder()}>Cancel Order</button>}
                    </div>
                </div>
            </div>
        </>

    )
}

function ReviewForm({ setReviewFormOpened, submitReview }: any) {
    const userName = useSelector((state: RootState) => state.user.user?.firstName);

    const [comment, setComment] = useState('');
    const [rate, setRate] = useState(5);

    const handleCancel = () => {
        setReviewFormOpened(false);
    };

    const handleReview = () => {
        submitReview({
            user: userName,
            comment: comment,
            rate: rate,
            date: new Date().toLocaleString()
        });
        setReviewFormOpened(false);
    };

    return (
        <div className='fixed top-0 left-0 w-screen h-screen backdrop-blur-md flex justify-center items-center'>
            <div className='bg-white p-8 rounded-lg shadow-md'>
                <h2 className='text-2xl font-semibold mb-2'>Select Rating</h2>
                <div className='flex text-3xl text-yellow-400 gap-3'>
                    {
                        Array(1, 2, 3, 4, 5).map((n, i) => {
                            return (<FontAwesomeIcon onClick={() => setRate(n)} icon={rate >= n ? faStar : faEmptyStar} key={i} />)
                        })
                    }
                </div>

                <h2 className='text-2xl font-semibold mt-8 mb-4'>Write a Review</h2>
                <textarea
                    className='w-full border border-gray-300 rounded-md p-2 mb-4'
                    rows={4}
                    placeholder='Write your review...'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                ></textarea>
                <div className='flex justify-end'>
                    <button
                        className='bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-4'
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'
                        onClick={handleReview}
                    >
                        Submit Review
                    </button>
                </div>
            </div>
        </div>
    );
}
