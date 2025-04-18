import { faStar } from "@fortawesome/free-solid-svg-icons"
import { faStar as faEmptyStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { formatDistanceToNow } from "date-fns";
import { EUserRole, TReview } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { api } from "../../api/api";
import { useState } from "react";

type Props = {
    review: TReview
}

export default function Review({ review }: Props) {
    const { user } = useSelector((state: RootState) => state.user);
    const [feedback, setFeedback] = useState(review.sellerFeedback);

    const onFeedbackClick = () => {
        const payload = {
            message: 'Thank you!',
        }
        api.put('order/review/feedback/' + review._id, payload).then(_ => {
            setFeedback(payload);
        }).catch(err => console.error(err));
    }

    return (
        <div className='flex justify-between items-center border-b border-zinc-300 my-6 p-2  mx-3'>
            <div className='flex flex-col gap-3 flex-grow'>
                <span className='text-sm md:text-lg lg:text-xl'>
                    {
                        Array.from({ length: 5 }).map((_, i) => {
                            return <FontAwesomeIcon key={i} icon={(review.rate > i) ? faStar : faEmptyStar} className='mr-0 text-black' />
                        })
                    }
                    <label className='text-zinc-500 ml-4'>{review.user}</label>
                </span>
                <label className='text-lg md:text-xl lg:text-2xl'>{review.comment}</label>
                {
                    feedback && <label className='text-sm md:text-base -mt-2 text-zinc-500'>Seller Feedback: {feedback.message}</label>
                }
                {
                    !feedback &&
                    user?.role === EUserRole.SELLER &&
                    <button onClick={onFeedbackClick} className='text-sm w-fit px-5 border py-1 rounded-md bg-gray-300 -mt-2 text-black'>Give Feedback</button>
                }
            </div>
            <label className='text-sm md:text-base lg:text-lg text-zinc-500 mr-2'>{
                formatDistanceToNow(new Date(review.date), { addSuffix: true })
            }</label>
        </div>
    )
}