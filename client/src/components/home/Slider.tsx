import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Slide from './Slide';
import { useNavigate } from 'react-router-dom';

const Slider = () => {
    const navigate = useNavigate();

    return (
        <div className="w-screen h-[80vh]">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                loop={true}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                slidesPerView={1}
                className="h-full"
            >
                {/* Slide 1 */}
                <SwiperSlide>
                    <Slide
                        h1="FIND QUALITY SPARE PARTS – SHOP WITH CONFIDENCE AT SPARE.LK"
                        p="Discover a wide range of genuine and affordable spare parts for your vehicle. Buy from trusted sellers and keep your ride in top shape."
                        btnText="Browse Parts"
                        imgLink="/slider1.jpg"
                        handleClick={() => navigate('/shop')}
                    />
                </SwiperSlide>

                <SwiperSlide>
                    <Slide
                        h1="SELL YOUR SPARE PARTS – REACH THOUSANDS OF BUYERS"
                        p="Turn your unused spare parts into cash! List your items on Spare.lk and connect with buyers looking for what you have."
                        btnText="Sell Now"
                        imgLink="/slider2.jpg"
                        handleClick={() => navigate('/shop')}
                    />
                </SwiperSlide>

                <SwiperSlide>
                    <Slide
                        h1="NEED HELP FINDING THE RIGHT PART? LET SPARE.LK GUIDE YOU"
                        p="Easily search, filter, and compare spare parts to find the perfect match for your vehicle. Get expert support when needed."
                        btnText="Get Started"
                        imgLink="/slider3.jpg"
                        handleClick={() => navigate('/shop')}
                    />
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default Slider;
