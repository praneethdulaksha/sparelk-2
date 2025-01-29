
type Props = {
    stars: number,
    count: number,
    totReviewsCount: number,
}

export default function RatingBar({ stars, count, totReviewsCount }: Props) {
    return (
        <div className='grid grid-cols-6 items-center my-1 text-sm lg:text-base'>
            <label className='text-right'>{stars} Stars</label>
            <div className='h-2 rounded-2xl mx-3 bg-gray-300 col-span-4 overflow-hidden'>
                {(count != 0) && <div style={{ width: `${count / totReviewsCount * 100}%` }} className='h-full bg-navbar rounded-2xl'></div>}
            </div>
            <label className=''>{count}</label>
        </div>
    )
}