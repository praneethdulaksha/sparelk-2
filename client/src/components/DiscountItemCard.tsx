import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DiscountItemCard({ item }: any) {
    const navigate = useNavigate();
    const [itemId, setItemId] = useState('');

    return (
        <div className='inline-block w-44 bg-pane-color rounded-2xl overflow-hidden cursor-pointer hover:scale-105 border-black duration-100 pb-3'
            onClick={() => navigate(`/item/${item._id}`)}
        >
            <div className="flex flex-col justify-start w-full">
                <div className='aspect-square w-full bg-cover bg-center' style={{ backgroundImage: `url(${item.image})` }}></div>
                <h6 className="truncate mx-3 mt-5">{item.name}</h6>
                <h4 className="mx-3 mt-3 text-price-color">Rs.{parseFloat(item.price * ((100 - item.discount) / 100) + "").toFixed(2)}</h4>
                <span className="mx-3">
                    <h6 className="line-through">Rs.{item.price}</h6>
                    <h6 className=" ml-3">-{item.discount}%</h6>
                </span>
            </div>

        </div>
    )
}