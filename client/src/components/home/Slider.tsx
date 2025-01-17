import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Slide from './Slide';

const Slider = () => {
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
                        h1='"ELEVATE YOUR STYLE – DISCOVER TIMELESS MENS FASHION AT DREZZA"'
                        p='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                        btnText='Explore Now'
                        imgLink='/slider1.jpg'
                        handleClick={() => { }}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <Slide
                        h1="FIND YOUR PERFECT STYLE – INSPECT THE NEW ARRIVALS"
                        p='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                        btnText='View Collection'
                        imgLink='/slider1.jpg'
                        handleClick={() => { }}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <Slide
                        h1="DON'T MISS OUT ON THE NEW COLLECTIONS – HIT THE GROUND!"
                        p='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                        btnText='Shop Now'
                        imgLink='/slider1.jpg'
                        handleClick={() => { }}
                    />
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default Slider;
