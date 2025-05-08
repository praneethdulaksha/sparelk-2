import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { faStar as faEmptyStar } from '@fortawesome/free-regular-svg-icons';
import { TItem } from '../types';
import { brands } from '../data/brands';

type Props = {
  itm: TItem
}

export default function ItemCard({ itm }: Props) {
  const navigate = useNavigate();
  const [item] = useState<TItem>(itm)

  return (
    <div
      className='relative flex flex-col justify-start md:aspect-item-card w-44 sm:w-48 md:w-52 lg:w-56 bg-pane-color rounded-md overflow-hidden cursor-pointer hover:scale-105 border border-gray-300 duration-100 pb-3 shadow-lg'
      onClick={() => navigate(`/item/${itm._id}`)}
    >
      <div
        className='aspect-square w-full bg-cover bg-center relative'
        style={{ backgroundImage: `url(http://localhost:3000/images/${item.image})` }}
      >
        {item.condition == 'New' && (
          <div className='absolute left-0 top-0 m-1 border-2 border-main bg-black text-white text-xs rounded-full p-1 aspect-square flex justify-center items-center'>
            New
          </div>
        )}
      </div>
      <h6 className='text-[10px] sm:text-xs text-gray-500 mx-3 mt-3'>{item.code}</h6>
      <h6 className='text-xs sm:text-sm text-gray-700 mx-3'>{item.category}</h6>
      <h6 className='mx-3 truncate text-base sm:text-lg'>{item.name}</h6>

      <span className='flex-grow'></span>
      <div className="px-3 text-base sm:text-lg text-main font-bold  flex justify-between items-center">
        <span>Rs.{parseFloat(item.price * ((100 - item.discount) / 100) + "").toFixed(2)}</span>
        {item.discount != 0 && <span className='font-medium text-sm sm:text-base'>-{item.discount}%</span>}
      </div>
      <span className='mx-3 mt-1 flex items-center'>
        {Array(1, 2, 3, 4, 5).map((n, i) => (
          <FontAwesomeIcon
            key={i}
            icon={(item.rating > i && item.rating < n) ? faStarHalfStroke : (item.rating >= n) ? faStar : faEmptyStar}
            className='text-xs sm:text-sm text-black'
          />
        ))}
        <h6 className='text-zinc-500 text-xs sm:text-sm ml-1'>{item.sold} Sold</h6>
        <div className='flex-grow'></div>
        {item.brand ?
          <img src={brands.find(b => b.brand == item.brand)?.url} alt="brand" className='h-3 md:h-5 max-w-12' title={item.brand} />
          : <span className='text-xs sm:text-sm text-gray-500'>No Brand</span>}
      </span>
    </div>
  )
}