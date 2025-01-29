import axios from 'axios';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { api } from '../../api/api';
import { TItem } from '../../types';
import { cartActions } from '../../reducers/cartSlice';

export default function ManageItems() {
    const store = useSelector((state: RootState) => state.user.user?.store);

    const [items, setItems] = useState<TItem[]>([]);

    useEffect(() => {
        getStoreItems();
    }, []);

    function getStoreItems() {
        api.get('item/store/' + store._id)
            .then(res => {
                setItems(res.data.data);
                console.log(res.data.data);
            })
            .catch(err => console.log(err));
    }

    return (
        <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl text-center font-bold">Manage Items</h1>
            <div className='flex flex-col mt-4 justify-center'>
                <input type='text' placeholder='Search Item' className='border border-black flex-grow py-2 px-5 rounded-full mx-10' />
            </div>

            {items.length > 0 ? <div className='flex flex-col items-center p-5'>
                {
                    items.map((item, i) => {
                        return (
                            <Item key={i} itm={item} setItems={setItems} />
                        )
                    })
                }
            </div>
                : <div className='flex flex-col items-center p-5'>
                    <h1 className="text-4xl text-center font-bold text-gray-400">No Items Available</h1>
                </div>}

        </div>
    )
}

function Item({ itm, setItems }: any) {
    const [item, setItem] = useState<TItem>(itm);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleDelete = () => {
        api.delete('item/' + item._id)
            .then(res => {
                setItems((prevItems: TItem[]) => prevItems.filter(item => item._id !== itm._id));
                dispatch(cartActions.removeFromCart({ itemId: item._id }))
            })
            .catch(err => console.log(err));
    }

    const handleActive = () => {
        api.put('item/active/' + item._id)
            .then(res => {
                setItem({ ...item, isActive: !item.isActive });
            })
            .catch(err => console.log(err));
    }

    return (
        <>
            <div className='flex border-b pane-color-zinc-300 py-5 w-full'>

                <div className='flex justify-between w-full flex-col sm:flex-row'>
                    <div className='flex'>
                        <div className='h-20 aspect-square cursor-pointer hover:scale-105 mr-3 bg-cover bg-center' style={{ backgroundImage: `url(http://localhost:3000/images/${item.image})` }} onClick={() => navigate(`/item/${item._id}`)} ></div>

                        <div className='flex flex-col justify-between'>
                            <h6 className='truncate w-56 lg:w-80'>{item.name}</h6>
                            <div>
                                <h6 className='text-gray-500 mr-2'>Price :</h6>
                                <h6 className='text-orange-500'>Rs.{item.price.toFixed(2)}</h6>
                            </div>
                            <div className='flex gap-3'>
                                <div>
                                    <h6 className='text-gray-500 mr-2'>Stock :</h6>
                                    <h6>{item.stock}</h6>
                                </div>
                                <div>
                                    <h6 className='text-gray-500 mr-2'>Discount :</h6>
                                    <h6>{item.discount}%</h6>
                                </div>
                            </div>
                            <h6 className='text-green-600 underline'>{item.category}</h6>
                        </div>
                    </div>

                    <div className='flex flex-col items-end justify-between gap-5'>
                        {
                            item.isActive ?
                                <h6 className='bg-green-300 px-1 rounded-md text-sm border border-green-600'>{item.isActive ? 'Active' : 'Inactive'}</h6>
                                :
                                <h6 className='bg-red-300 px-1 rounded-md text-sm border border-red-600'>{item.isActive ? 'Active' : 'Inactive'}</h6>
                        }
                        <div className='flex gap-5'>
                            <button className='bg-green-400 px-3 rounded-md text-lg shadow-lg hover:bg-green-500 hover:scale-110 duration-75' onClick={() => navigate('/profile/add-item/' + item._id)}>Update</button>
                            <button className='bg-red-300 px-3 rounded-md text-lg shadow-lg hover:bg-red-400 hover:scale-110 duration-75' onClick={handleDelete}>Remove</button>
                            <button className='bg-blue-300 px-3 rounded-md text-lg shadow-lg hover:bg-blue-400 hover:scale-110 duration-75' onClick={handleActive}>{item.isActive ? 'Inactive' : 'Active'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
