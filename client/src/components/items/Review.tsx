import { faStar } from "@fortawesome/free-solid-svg-icons"
import { faStar as faEmptyStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { formatDistanceToNow } from "date-fns";

type Props = {
    review: any
}

export default function Review({ review }: Props) {
    return (
        <div className='flex justify-between items-center border-b border-zinc-300 py-8'>
            <div className='flex flex-col gap-3'>
                <span className='text-sm md:text-lg lg:text-xl'>
                    {
                        Array.from({ length: 5 }).map((_, i) => {
                            return <FontAwesomeIcon key={i} icon={(review.rate > i) ? faStar : faEmptyStar} className='mr-0 text-black' />
                        })
                    }
                    <label className='text-zinc-500 ml-4'>{review.user}</label>
                </span>
                <label className='text-lg md:text-xl lg:text-2xl'>{review.comment}</label>
            </div>
            <label className='text-sm md:text-base lg:text-lg text-zinc-500 mr-2'>{
                formatDistanceToNow(new Date(review.date), { addSuffix: true })
            }</label>
        </div>
    )
}