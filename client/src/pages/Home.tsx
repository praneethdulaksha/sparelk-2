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

export default function Home() {
  const [allItems, setAllItems] = useState([]);
  const [discountItems, setDiscountItems] = useState([]);
  const [categories, setCategories] = useState(allCategories);
  const [clickedTab, setClickedTab] = useState<'latest' | 'discount' | 'trending'>('latest');

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

  useEffect(() => {
    getAllItems();
    getDiscountItems();
  }, [])

  return (
    <main className="flex flex-col flex-grow w-screen items-center">

      <Slider />

      <Section className='gap-28 mt-10'>

        <div className='flex w-full gap-8 justify-center'>
          <OfferCard
            h1='Body Parts'
            h2='for every vehicle'
            p='Lorem ipsum dolor sit amet consectetur.'
            btnText='Show Now'
            imgLink='offer2.jpg'
            onClick={() => { }}
          />
          <OfferCard
            h1='Body Parts'
            h2='for every vehicle'
            p='Lorem ipsum dolor sit amet consectetur.'
            btnText='Show Now'
            imgLink='offer1.jpg'
            onClick={() => { }}
          />
          <OfferCard
            h1='Body Parts'
            h2='for every vehicle'
            p='Lorem ipsum dolor sit amet consectetur.'
            btnText='Show Now'
            imgLink='offer3.jpg'
            onClick={() => { }}
          />
        </div>

        <div className='flex flex-col gap-6 items-center'>
          <div className='flex justify-center gap-10'>
            <button onClick={() => setClickedTab('latest')} className={`duration-75 text-gray-400 font-semibold ${clickedTab == 'latest' && 'border-b-4 text-gray-700 border-main'}`}>Latest Products</button>
            <button onClick={() => setClickedTab('discount')} className={`duration-75 text-gray-400 font-semibold ${clickedTab == 'discount' && 'border-b-4 text-gray-700 border-main'}`}>Sale Products</button>
            <button onClick={() => setClickedTab('trending')} className={`duration-75 text-gray-400 font-semibold ${clickedTab == 'trending' && 'border-b-4 text-gray-700 border-main'}`}>Trending Products</button>
          </div>
          <hr className='' />
          {
            clickedTab === 'latest' ?
              <ItemsList items={allItems} />
              : clickedTab === 'discount' ?
                <ItemsList items={discountItems} />
                : clickedTab === 'trending' ?
                  <ItemsList items={allItems} />
                  : null
          }

          <Button className='w-fit font-semibold text-lg mt-6'>Shop All</Button>
        </div>

        <FeaturesSection />

        <PopularCategories />


      </Section>



    </main>
  )
}