import { useEffect, useState } from "react";
import { api } from "../../api/api";

export default function OrderItem({ oItem, setTotal, setOrderItemTotal }: any) {
    const [orderItem] = useState(oItem)
    const [item, setItem] = useState(oItem);
    const [reqSend, setReqSend] = useState(false);

    useEffect(() => {
        if (!reqSend) {
            console.log(oItem);
            getItem(oItem);
            setReqSend(true);
        }
    }, [])

    function getItem(cartItem: any) {
        api.get('item/' + cartItem.itemId).then(result => {
            setItem(result.data.data);
            let itm = result.data.data;
            let price = itm.price * ((100 - itm.discount) / 100) * oItem.qty;
            setOrderItemTotal(itm._id, price);
            setTotal((prevTot: any) => prevTot + price);
        }).catch(err => console.log(err));
    }

    return (
        <div className='flex border-b pane-color-zinc-300 mt-5 pb-6'>
            <div className='aspect-square h-20 bg-cover bg-center' style={{ backgroundImage: `url(http://localhost:3000/images/${item.image})` }}></div>

            <div className='flex flex-grow justify-between mx-3 h-20'>
                <div className='flex flex-col justify-between'>
                    <h6 className='truncate text-base md:text-lg w-56 lg:w-96'>{item.name}</h6>
                    <span>
                        <h6 className='text-gray-500 mr-2 text-base md:text-lg'>Qty</h6>
                        <h6>{orderItem.qty}</h6>
                    </span>
                </div>

                <div className='flex flex-col items-end h-20'>
                    <h5 className='text-price-color text-lg md:text-xl'>Rs. {parseFloat(item.price * ((100 - item.discount) / 100) + "").toFixed(2)}</h5>
                    <h6 className='text-zinc-500 line-through text-sm md:text-base'>Rs. {item.price}</h6>
                    <h6 className='text-sm md:text-base'>-{item.discount}%</h6>
                </div>
            </div>
        </div>
    )
}