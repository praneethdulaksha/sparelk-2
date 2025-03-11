import { useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { faStar as faEmptyStar } from '@fortawesome/free-regular-svg-icons';
import { TItem } from '../types';

type Props = {
    itm: TItem
}

export default function ItemCard({itm}: Props) {
    const navigate = useNavigate();
    const [item, setItem] = useState<TItem>(itm)

  return (
    // item &&
    <div className='relative flex flex-col justify-start aspect-item-card w-60 bg-pane-color rounded-md overflow-hidden cursor-pointer hover:scale-105 border-black duration-100 pb-3 shadow-lg'
    onClick={()=> {
      navigate(`/item/${itm._id}`)
    }}
    >
      <div className='aspect-square w-full bg-cover bg-center' style={{ backgroundImage: `url(http://localhost:3000/images/${item.image})` }}></div>
      <h6 className='text-sm text-gray-500 mx-3 mt-3'>{item.category}</h6>
      <h6 className=" mx-3 truncate text-lg">{item.name}</h6>
      {(item.discount != 0) && <span className="mx-3 mt-1 text-gray-400">
        <h6 className="line-through  text-sm">Rs.{item.price}</h6>
        <h6 className=" ml-3  text-sm">-{item.discount}%</h6>
      </span>}
      <h4 className="px-3 text-xl text-gray-900 font-bold bg-main/70">Rs.{parseFloat(item.price * ((100 - item.discount) / 100) + "").toFixed(2)}</h4>
      <span className='flex-grow'></span>
      <span className='mx-3'>
      { 
        Array(1,2,3,4,5).map((n, i) => {
          return (
            <FontAwesomeIcon key={i} icon={(item.rating>i && item.rating<n) ? faStarHalfStroke : (item.rating>=n) ? faStar : faEmptyStar} className=' text-black'/>
          )
        }) 
      }
      <h6 className='text-zinc-500 text-sm ml-1'>{item.sold} Sold</h6>
      </span>
    </div>
  )
}
