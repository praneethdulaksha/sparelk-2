import { faStar } from "@fortawesome/free-solid-svg-icons"
import { faStar as faEmptyStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { formatDistanceToNow } from "date-fns";
import { EUserRole, TReview } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { api } from "../../api/api";
import { useState } from "react";
import Swal from "sweetalert2";

type Props = {
    review: TReview
    // orderId: string
}

export default function Review({ review }: Props) {
    const { user } = useSelector((state: RootState) => state.user);
    const [feedback, setFeedback] = useState(review.sellerFeedback);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const onFeedbackClick = () => {
        if (!feedbackMessage) {
            Swal.fire({
                icon: 'warning',
                text: 'Please enter feedback message',
                confirmButtonText: 'OK'
            })
            return;
        };
        const payload = {
            message: feedbackMessage,
        }
        api.put('order/review/feedback/' + review._id, payload).then(_ => {
            setFeedback(payload);
        }).catch(err => console.error(err));
        setShowFeedback(false);
    }

    return (
        <>
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
                        <button onClick={() => setShowFeedback(true)} className='text-sm w-fit px-5 border py-1 rounded-md bg-gray-300 -mt-2 text-black'>Give Feedback</button>
                    }
                </div>
                <label className='text-sm md:text-base lg:text-lg text-zinc-500 mr-2'>{
                    formatDistanceToNow(new Date(review.date), { addSuffix: true })
                }</label>
            </div>

            {showFeedback && <div className="fixed left-0 top-0 w-screen h-screen z-50 flex justify-center items-center">
                <div className="bg-black/40 w-full h-full absolute " onClick={() => setShowFeedback(false)}></div>
                <div className="bg-white p-8 rounded-lg z-50 flex justify-center items-center">
                    <div className="flex flex-col gap-5 w-96">
                        <label className="text-3xl">Feedback</label>
                        <textarea value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value)} className="border border-gray-300 rounded-lg p-3" placeholder="Write your feedback here..." rows={5} required></textarea>
                        <button onClick={onFeedbackClick} className="bg-blue-500 text-white px-5 py-2 rounded-lg">Submit</button>
                    </div>
                </div>
            </div>
            }
        </>

    )
}