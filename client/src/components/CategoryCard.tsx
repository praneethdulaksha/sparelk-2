import { useNavigate } from "react-router-dom";

export default function CategoryCard({ category, index }: any) {
    const navigate = useNavigate();

    return (
        <div className="inline-block">
            <div className="flex flex-col justify-center items-center w-44 h-fit hover:scale-105 duration-75" onClick={() => navigate('/items/category/' + category)} >
                <div className='bg-white shadow-lg aspect-square w-32 rounded-full overflow-hidden mt-5 text-center flex items-center justify-center bg-cover bg-center'
                    style={{ backgroundImage: `url(https://placehold.co/100x100)` }}>
                    {/* <img src={fashionImg} className="w-full h-full" alt="" /> */}
                    {/* {category} */}
                </div>
                <label className='mt-5 text-md md:text-lg text-center w-40 truncate'>{category}</label>
            </div>
        </div>
    )
}