import { Link } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import { items } from "../data/items";
import { FiChevronRight, FiSearch } from "react-icons/fi";
import { useState } from "react";

// vehicle spare parts
const fillters = [
    {
        label: 'Categories',
        options: ['All', 'Wheels and tires', 'Variables', 'Repair Parts', 'Performance Parts', 'Lighting', 'Electronics', 'Body Parts']
    },
    {
        label: 'Brand',
        options: ['All', 'Toyota', 'Honda', 'Ford', 'Mercedes-Benz', 'Audi', 'BMW', 'Nissan', 'Chevrolet', 'Hyundai', 'Volkswagen', 'Mazda', 'Jeep', 'Dodge', 'GMC', 'Chrysler', 'Lincoln', 'Pontiac', 'Suzuki', 'Subaru']
    }
]

export default function Shop() {
    const [price, setPrice] = useState(10000); // Default value

    return (
        <div className="container xl:max-w-7xl flex-grow py-5 px-2 md:px-0 min-h-screen flex">
            <div className="w-[600px] mr-3">
                <span className="flex items-center">
                    <Link to='/' className="font-semibold text-gray-700">Home</Link>
                    <span className="mx-2"><FiChevronRight /></span>
                    <Link to='/shop' className="font-semibold text-gray-500">Shop</Link>
                </span>

                <div className="mt-5 mb-3 relative flex items-center">
                    <input
                        type="text"
                        name="search"
                        id="search"
                        className="w-full border-2 border-gray-400 rounded-md py-2 px-3"
                        placeholder="Search..."
                    />
                    <button type="button" className="absolute right-2 text-gray-500"><FiSearch /></button>
                </div>

                {
                    fillters.map(({ label, options }, i) => (
                        <div className="py-3 mb-3 border-b border-main" key={i}>
                            <h5 className="text-gray-600 font-semibold mb-2 uppercase">{label}</h5>
                            {
                                options.map((option, i) => (
                                    <div key={i} className="ml-3">
                                        <input type="checkbox" name={`cb-${label}-${option}`} id={`cb-${label}-${option}`} className="mr-2" />
                                        <label htmlFor={`cb-${label}-${option}`} className="text-gray-700">{option}</label>
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }

                <div className="py-3 mb-3 border-b border-main">
                    <h5 className="text-gray-600 font-semibold mb-2 uppercase">Price</h5>
                    <input
                        type="range"
                        min="0"
                        max="20000"
                        value={price}
                        onChange={(e) => setPrice(parseInt(e.target.value))}
                        className="w-full cursor-pointer accent-main"
                    />
                    <div className="flex justify-between text-gray-500 text-sm mt-1">
                        <span>Rs.0</span>
                        <span>Rs.{price}</span>
                        <span>Rs.20,000</span>
                    </div>
                </div>

            </div>
            <div className="border-l border-main pl-3 flex-grow">
                <h3>Shop</h3>

                <div className="flex items-end justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-500">Showing 1-9 of 35 results</span>

                    <div className="w-[200px]">
                        <select id="countries" className="bg-gray-300 border border-gray-500 text-gray-800 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            <option value='' selected>Sort By Latest</option>
                            <option value=''>Sort By Price (Low to High)</option>
                            <option value=''>Sort By Price (High to Low)</option>
                            <option value=''>Sort By Popularity</option>
                        </select>
                    </div>
                    {/* sort */}

                </div>

                <div className="flex flex-wrap gap-4">
                    {Array(10).fill(null).map((_, i) => (
                        <ItemCard key={i} itm={items[1]} />
                    ))}
                </div>
            </div>
        </div>
    )
}
