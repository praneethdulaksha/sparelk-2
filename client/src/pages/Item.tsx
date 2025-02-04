import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faStar, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { faStar as faEmptyStar } from '@fortawesome/free-regular-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { RootState } from '../store/store';
import { api } from '../api/api';
import { cartActions } from '../reducers/cartSlice';
import { TItem } from '../types';
import { userActions } from '../reducers/userSlice';
import ItemCard from '../components/ItemCard';
import RatingsReviews from '../components/items/RatingsReviews';
import { items as testItems } from '../data/items';

function Item() {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const itemId = params.itemId;

    const isUserLoggedIn = useSelector((state: RootState) => state.user.isUserAuthed);
    const user = useSelector((state: RootState) => state.user);

    const [item, setItem] = useState<TItem>(testItems[3]);
    const [itemQty, setItemQty] = useState(1);
    const [items, setAllItems] = useState([]);

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [params.itemId])

    return item ? (
        <main className="container xl:max-w-7xl flex-grow py-5 px-2 md:px-0">

            <div className=' flex items-center gap-3'>
                <Link className="text-link-color" to={`/items/category/${item.category}`}>{item.category}</Link>
                <FontAwesomeIcon icon={faAngleRight} className='mt-1 text-xl' />
                <label className='truncated'>{item.name}</label>
            </div>

            <div className='flex flex-col md:flex-row bg-pane-color rounded-2xl overflow-hidden mt-3 pb-3'>
                <div className='flex items-center justify-center md:w-72 lg:w-96'>
                    {/* <div className='aspect-square h-72 lg:h-96 md:w-full bg-cover bg-center' style={{ backgroundImage: `url(http://localhost:3000/images/${item.image})` }}></div> */}
                    <div className='aspect-square h-72 lg:h-96 md:w-full bg-cover bg-center' style={{ backgroundImage: `url(/tires-category.png)` }}></div>
                </div>

                <div className='flex flex-grow flex-col px-5 pt-3'>
                    <label className='text-xl lg:text-2xl'>{item.name}</label>
                    <div className=' flex justify-between text-gray-700 border-zinc-300 py-5 border-b'>
                        <span className='text-sm lg:text-base'>
                            {
                                Array(1, 2, 3, 4, 5).map((n, i) => {
                                    return (
                                        <FontAwesomeIcon key={i} icon={(item.rating > i && item.rating < n) ? faStarHalfStroke : (item.rating >= n) ? faStar : faEmptyStar} className=' text-black' />
                                    )
                                })
                            }
                            <label className='ml-2'>{item.rating}  |  {item.sold} Sold</label>
                        </span>
                        <span className='text-sm lg:text-base'>Store : <Link className='text-link-color' to={`/store/${item.store?._id}`}>{item.store?.name}</Link></span>
                    </div>

                    <div className='flex flex-col text-gray-700 border-zinc-300 pt-5 pb-10 border-b'>
                        <label className="my-3 text-3xl lg:text-4xl text-price-color">Rs.{parseFloat(item.price * ((100 - item.discount) / 100) + "").toFixed(2)}</label>
                        <span className="text-lg lg:text-xl">
                            <label className="line-through">Rs.{item.price}</label>
                            <label className="ml-3">-{item.discount}%</label>
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:gap-3 sm:items-center pt-5">
                        <div className='flex'>
                            <label className='w-32 text-lg lg:text-xl mb-3 text-zinc-600'>Quantity</label>
                            <button disabled={itemQty == 1 ? true : false} className='scale-75 lg:scale-100'><FontAwesomeIcon icon={faMinus} className='border p-1 border-black rounded-full aspect-square' onClick={() => setItemQty(itemQty > 1 ? itemQty - 1 : 1)} /></button>
                            <label className='px-5 text-lg lg:text-xl mb-2'>{itemQty}</label>
                            <button disabled={itemQty == item.stock ? true : false} className='scale-75 lg:scale-100'><FontAwesomeIcon icon={faPlus} className='border p-1 border-black rounded-full aspect-square' onClick={() => setItemQty(itemQty < item.stock ? itemQty + 1 : item.stock)} /></button>
                        </div>
                        <label className='text-sm text-zinc-500 sm:ml-3 block sm:inline-block' >Only Left {item.stock} stock(s)</label>
                    </div>
                    <div className='flex mt-2 text-lg lg:text-xl'>
                        <label className='w-32 mt-1 text-zinc-600'>Delivery Fee</label>
                        <label className='px-4'>Rs.{'100.00'}</label>
                    </div>
                    <label className='text-sm text-zinc-500 -mt-1' >(Delivery By Feb 26 ~ Feb 29)</label>

                    <div className='flex flex-col sm:flex-row items-center justify-center px-5 pt-3 gap-3 sm:gap-16 sm:h-16 sm:my-5'>
                        <Link to={`/item/place-order/${item._id}/${itemQty}`} className='bg-main rounded-md py-1 px-3 shadow-lg w-full sm:w-fit'><button className='h-full w-full text-center'>
                            Buy Now
                        </button></Link>
                        <button className='bg-blue-500 rounded-md py-1 px-3 shadow-lg w-full sm:w-fit'
                            onClick={() => {
                                // Add Item to Cart
                                if (isUserLoggedIn) {
                                    // addItemCart()
                                } else {
                                    dispatch(userActions.setPreviosPage(location.pathname))
                                    navigate('/login');
                                }
                            }}
                        >Add to Cart</button>
                    </div>
                </div>
            </div>

            <div className=''>
                {item && <RatingsReviews item={item} />}

                <div>
                    <h2 className="px-5 mt-3 text-2xl md:text-3xl lg:text-4xl mb-2">Description</h2>
                    {/* <p className='bg-pane-color rounded-2xl text-lg md:text-2xl p-5'>    {item?.description}</p> */}
                    <textarea
                        className='w-full bg-pane-color rounded-2xl text-lg md:text-2xl p-5'
                        value={item?.description}
                        style={{ resize: 'none' }}
                        rows={item?.description.split('\n').length + 1}
                        readOnly
                    />
                </div>

                <div className="relative mt-5">
                    <h2 className="px-5 mt-3 text-2xl md:text-4xl">Related Items</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 place-items-center gap-3">
                        {
                            items.map((item, i) => {
                                return <ItemCard key={i} itm={item} />
                            })
                        }
                    </div>
                    <div className='flex justify-center items-center mt-5'>
                        <Link to="/items/all">
                            <button className="border border-black px-9 rounded-md bg-pane-color text-lg">Shop More</button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    ) : (
        <div className="flex items-center justify-center flex-grow min-h-screen w-screen">
            <h1 className='text-gray-400'>Item Not Found</h1>
        </div>
    )
}

export default Item
