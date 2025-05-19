/**
 * Home Page Component
 *
 * Main landing page for the SpareLK e-commerce platform.
 * Features slider, product categories, promotional cards, and various product listings.
 *
 * @module Pages/Home
 */
import { useEffect, useState } from "react";
import { allCategories } from "../data/categories";
import Slider from "../components/home/Slider";
import Section from "../components/Section";
import OfferCard from "../components/home/OfferCard";
import PopularCategories from "../components/home/PopularCategories";
import { Button } from "@/components/ui/button";
import { api } from "../api/api";
import ItemsList from "../components/home/ItemsList";
import { useNavigate } from "react-router-dom";
import VehicleBrandScroller from "../components/home/VehicleBrandScroller";
import WhyBuyFromUs from "../components/home/WhyBuyFromUs";

/**
 * Home page component
 * Serves as the main landing page for the application
 *
 * @returns {JSX.Element} Home page component
 */
export default function Home() {
  // State for different product listings
  const [allItems, setAllItems] = useState([]);
  const [discountItems, setDiscountItems] = useState([]);
  const [categories, setCategories] = useState(allCategories);

  // Tab state for switching between product views
  const [clickedTab, setClickedTab] = useState<
    "latest" | "discount" | "trending"
  >("latest");

  const navigate = useNavigate();

  /**
   * Fetches all items from the API
   * Used to populate the Latest and Trending tabs
   */
  const getAllItems = async () => {
    try {
      const response = await api.get("item/all");
      setAllItems(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Fetches items with discounts from the API
   * Used to populate the Sale Products tab
   */
  const getDiscountItems = async () => {
    try {
      const response = await api.get(`item/discounts`);
      setDiscountItems(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Navigates to shop page with selected category filter
   * @param {string} cat - Category to filter by
   */
  const navToCategory = (cat: string) => {
    navigate("/shop", { state: { cat } });
  };

  /**
   * Fetch data and scroll to top when component mounts
   */
  useEffect(() => {
    getAllItems();
    getDiscountItems();
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <main className="flex flex-col flex-grow w-screen items-center bg-gray-50">
      {/* Hero slider */}
      <Slider />

      <Section className="gap-28 mt-11">
        {/* Promotional category cards */}
        <div className="flex w-full gap-x-10 justify-center">
          <OfferCard
            h1="Engine Components"
            // h2='High-quality engine parts for your vehicle'
            p="High-quality engine parts for your vehicle"
            btnText="Show Now"
            imgLink="offer1.jpg"
            onClick={() => navToCategory(categories[0])}
          />
          <OfferCard
            h1="Lighting & Indicators"
            // h2='for every vehicle'
            p="Explore headlights, fog lamps, indicators, and LED upgrades for your vehicle."
            btnText="Show Now"
            imgLink="offer2.jpg"
            onClick={() => navToCategory(categories[5])}
          />
          <OfferCard
            h1="Brake Systems"
            // h2='for every vehicle'
            p="Browse brake pads, discs, and calipers to ensure your safety on the road."
            btnText="Show Now"
            imgLink="offer3.jpg"
            onClick={() => navToCategory(categories[1])}
          />
        </div>

        <VehicleBrandScroller />

        <div className="flex flex-col gap-6 items-center w-full">
          <div className="flex justify-center gap-10 w-full pb-2 mb-6">
            <button
              onClick={() => setClickedTab("latest")}
              className={`duration-200 text-gray-400 font-semibold px-4 py-2 relative text-2xl ${
                clickedTab === "latest" ? "text-gray-800" : ""
              }`}
            >
              Latest Products
              {clickedTab === "latest" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500"></div>
              )}
            </button>
            <button
              onClick={() => setClickedTab("discount")}
              className={`duration-200 text-gray-400 font-semibold px-4 py-2 relative text-2xl ${
                clickedTab === "discount" ? "text-gray-700" : ""
              }`}
            >
              Sale Products
              {clickedTab === "discount" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500"></div>
              )}
            </button>
            <button
              onClick={() => setClickedTab("trending")}
              className={`duration-200 text-gray-400 font-semibold px-4 py-2 relative text-2xl ${
                clickedTab === "trending" ? "text-gray-700" : ""
              }`}
            >
              Trending Products
              {clickedTab === "trending" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500"></div>
              )}
            </button>
          </div>

          {clickedTab === "latest" ? (
            <ItemsList items={allItems.slice(0, 4)} />
          ) : clickedTab === "discount" ? (
            <ItemsList items={discountItems.slice(0, 4)} />
          ) : clickedTab === "trending" ? (
            <ItemsList
              items={[...allItems].sort(() => Math.random() - 0.5).slice(0, 4)}
            />
          ) : null}

          <Button
            onClick={() => navigate("/shop")}
            className="mt-5 font-medium bg-transparent border border-orange-500 hover:bg-orange-500 w-full text-orange-500 hover:text-white transition-all duration-200 rounded-full"
          >
            Shop All Items
          </Button>
        </div>

        {/* why buy from us */}
        <WhyBuyFromUs />

        <PopularCategories />
      </Section>
    </main>
  );
}
