import { useEffect, useState } from 'react';
import { allCategories } from '../data/categories';
import Slider from '../components/home/Slider';
import Section from '../components/Section';
import OfferCard from '../components/home/OfferCard';
import FeaturesSection from '../components/home/FeaturesSection';
import PopularCategories from '../components/home/PopularCategories';
import Button from '../components/Button';
import { api } from '../api/api';
import ItemsList from '../components/home/ItemsList';
import { useNavigate } from 'react-router-dom';
import VehicleBrandScroller from '../components/home/VehicleBrandScroller';
import WhyBuyFromUs from '../components/home/WhyBuyFromUs';

export default function Home() {
  const [allItems, setAllItems] = useState([]);
  const [discountItems, setDiscountItems] = useState([]);
  const [categories, setCategories] = useState(allCategories);
  const [clickedTab, setClickedTab] = useState<'latest' | 'discount' | 'trending'>('latest');

  const navigate = useNavigate();

  const getAllItems = async () => {
    try {
      const response = await api.get('item/all');
      setAllItems(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  const getDiscountItems = async () => {
    try {
      const response = await api.get(`item/discounts`);
      setDiscountItems(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  const navToCategory = (cat: string) => {
    navigate('/shop', { state: { cat } });
  }


  useEffect(() => {
    getAllItems();
    getDiscountItems();
    window.scrollTo({ top: 0 });
  }, [])

  return (
    <main className="flex flex-col flex-grow w-screen items-center bg-[#fffef4]">

      <Slider />

      <Section className='gap-28 mt-10'>

        <div className='flex w-full gap-8 justify-center'>
          <OfferCard
            h1='Engine Components'
            // h2='High-quality engine parts for your vehicle'
            p='High-quality engine parts for your vehicle'
            btnText='Show Now'
            imgLink='offer1.jpg'
            onClick={() => navToCategory(categories[0])}
          />
          <OfferCard
            h1='Lighting & Indicators'
            // h2='for every vehicle'
            p='Explore headlights, fog lamps, indicators, and LED upgrades for your vehicle.'
            btnText='Show Now'
            imgLink='offer2.jpg'
            onClick={() => navToCategory(categories[5])}
          />
          <OfferCard
            h1='Brake Systems'
            // h2='for every vehicle'
            p='Browse brake pads, discs, and calipers to ensure your safety on the road.'
            btnText='Show Now'
            imgLink='offer3.jpg'
            onClick={() => navToCategory(categories[1])}
          />
        </div>

        <VehicleBrandScroller />

        <div className='flex flex-col gap-6 items-center'>
          <div className='flex justify-center gap-10'>
            <button onClick={() => setClickedTab('latest')} className={`duration-75 text-gray-400 font-semibold ${clickedTab == 'latest' && 'border-b-4 text-gray-700 border-main'}`}>Latest Products</button>
            <button onClick={() => setClickedTab('discount')} className={`duration-75 text-gray-400 font-semibold ${clickedTab == 'discount' && 'border-b-4 text-gray-700 border-main'}`}>Sale Products</button>
            <button onClick={() => setClickedTab('trending')} className={`duration-75 text-gray-400 font-semibold ${clickedTab == 'trending' && 'border-b-4 text-gray-700 border-main'}`}>Trending Products</button>
          </div>
          <hr className='' />
          {
            clickedTab === 'latest' ?
              <ItemsList items={allItems.slice(0, 4)} />
              : clickedTab === 'discount' ?
                <ItemsList items={discountItems.slice(0, 4)} />
                : clickedTab === 'trending' ?
                  <ItemsList items={[...allItems].sort(() => Math.random() - 0.5).slice(0, 4)} />
                  : null
          }

          <Button onClick={() => navigate('/shop')} className='w-fit font-semibold text-light text-lg mt-6'>Shop All</Button>
        </div>

        {/* why buy from us */}
        <WhyBuyFromUs />

        {/* <FeaturesSection /> */}

        <PopularCategories />


      </Section>



    </main>
  )
}