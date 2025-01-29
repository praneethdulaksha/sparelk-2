import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { faStar as faEmptyStar } from '@fortawesome/free-regular-svg-icons';
import { TItem } from '../../types';
import { api } from '../../api/api';
import RatingBar from './RatingBar';
import Review from './Review';

type Props = {
    item: TItem
}

export default function RatingsReviews({ item }: Props) {
    const [reviews, setReviews] = useState([]);
    const [ratings, setRatings] = useState([0, 0, 0, 0, 0]);

    useEffect(() => {
        getAllReviews();
    }, [item])

    function getAllReviews() {
        api.get('order/reviews/' + item._id).then(result => {
            let revs = result.data.data;
            let tempRatings = [0, 0, 0, 0, 0];

            revs.map((review: any) => {
                tempRatings[review.rate - 1]++;
            })
            setRatings(tempRatings);
            setReviews(revs)
        }).catch(err => console.error(err));
    }

    return reviews && (
        <>
            <h2 className="px-5 mt-3 text-2xl md:text-4xl">Ratings & Reviews({reviews.length})</h2>
            <div className='flex flex-col px-5 pb-5 bg-pane-color rounded-2xl'>
                <div className='flex flex-col-reverse md:flex-row justify-between md:items-center w-full border-b pb-5 border-gray-300' >
                    <div className='flex justify-evenly flex-col md:1/2 lg:w-2/5 mt-3'>
                        {
                            ratings.map((_, i) => {
                                return <RatingBar key={i} stars={5 - i} count={ratings[4 - i]} totReviewsCount={reviews.length} />
                            })
                        }
                    </div>
                    <div className='flex flex-col items-end md:1/2 lg:w-3/5'>
                        <label className='text-5xl md:text-7xl lg:text-8xl'>{item.rating}</label>
                        <span className='text-2xl md:text-3xl lg:text-4xl'>
                            {
                                Array(1, 2, 3, 4, 5).map((n, i) => {
                                    return (
                                        <FontAwesomeIcon key={i} icon={(item.rating > i && item.rating < n) ? faStarHalfStroke : (item.rating >= n) ? faStar : faEmptyStar} className='mr-0 text-black' />
                                    )
                                })
                            }
                        </span>
                        <label className='text-zinc-500 text-base md:text-lg lg:text-xl'>All reviews come from verified purchasers</label>
                    </div>
                </div>

                {reviews && <div className='max-h-screen  overflow-scroll overflow-x-hidden'>
                    {
                        reviews.map((review, i) => {
                            return <Review key={i} review={review} />;
                        })
                    }
                </div>
                }
            </div>
        </>

    )
}
