import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import ItemCard from '../components/ItemCard';

import { items } from '../data/items';
import CategoryCard from '../components/CategoryCard';
import DiscountItemCard from '../components/DiscountItemCard';
import { allCategories } from '../data/categories';
import Slider from '../components/home/Slider';
import Section from '../components/Section';
import OfferCard from '../components/home/OfferCard';
import FeaturesSection from '../components/home/FeaturesSection';
import PopularCategories from '../components/home/PopularCategories';
import Button from '../components/Button';

export default function Home() {
  const [allItems, setAllItems] = useState(items);
  const [discountItems, setDiscountItems] = useState(items);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [categories, setCategories] = useState(allCategories);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
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
            <span className='text-gray-400 font-semibold'>Latest Products</span>
            <span className='border-b-4 text-gray-700 font-semibold border-main'>Sale Products</span>
            <span>Featured Products</span>
          </div>
          <hr className='' />
          <div className='grid grid-cols-4 place-items-center gap-8'>
            {
              new Array(8).fill(null).map((n, i) => (
                <ItemCard
                  key={i}
                  itm={items[1]}>
                </ItemCard>
              ))
            }
          </div>

          <Button className='w-fit font-semibold text-lg mt-6'>Shop All</Button>
        </div>

        <FeaturesSection />

        <PopularCategories />


      </Section>



    </main>
  )
}



