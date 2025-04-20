import { Link, useLocation } from "react-router-dom";
import { FiChevronRight, FiDelete, FiLoader, FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import ItemsList from "../components/home/ItemsList";
import { ECondition } from "../types";
import { allCategories } from "../data/categories";
import Button from "../components/Button";
import { brands as allBrands } from "../data/brands";
import CollapsibleSection from "../components/CollapsibleSection";

// vehicle spare parts
const conditions = [
    { value: "All", label: "All" },
    { value: "New", label: "New" },
    { value: "Used", label: "Used" },
];

export default function Shop() {
    const location = useLocation();
    const brandFromState = location.state?.brand || null;
    const catFromState = location.state?.cat || null;
    const keywordFromState = location.state?.keyword || '';

    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState({ limit: 30, page: 1, tot: 0 })
    const [filteredItems, setFilteredItems] = useState([]);
    const [price, setPrice] = useState(300000);
    const [categories, setCategories] = useState<string[]>([catFromState]);
    const [brands, setBrands] = useState<string[]>([brandFromState]);
    const [sort, setSort] = useState<'new' | 'low' | 'high' | 'popular'>('new')
    const [condition, setCondition] = useState<ECondition>(ECondition.ALL);
    const [keyword, setKeyword] = useState(keywordFromState);
    const [isOpened, setOpened] = useState({ price: true, condition: true, categories: true, brands: true });

    const loadingDone = () => setTimeout(() => setLoading(false), 500);

    const getFilteredItems = async () => {
        setLoading(true);
        try {
            const resp = await api.put("item/filter",
                {
                    price,
                    condition,
                    categories: categories.join(','),
                    brands: brands.join(','),
                    keyword,
                    sort,
                    count
                }
            );
            setFilteredItems(resp.data.items);
            setCount({ ...count, tot: resp.data.count.tot })
        } catch (err) {
            console.error(err);
        } finally {
            loadingDone();
        }
    }

    useEffect(() => {
        getFilteredItems();
    }, [condition, sort, categories, brands])

    const priceOnChange = () => {
        getFilteredItems();
    }

    const onSearch = () => {
        getFilteredItems();
    }
    const onSubmit = (e: any) => {
        e.preventDefault();
        getFilteredItems();
    }

    const onConditionChange = (e: any) => {
        setCondition(e.target.value as ECondition);
    }

    const onSortChange = (e: any) => {
        setSort(e.target.value as 'new' | 'low' | 'high' | 'popular');
    }

    const categoryOnCheck = (val: boolean, cat: string) => {
        const newCategories = [...categories];
        if (val) {
            newCategories.push(cat);
        } else {
            newCategories.splice(newCategories.indexOf(cat), 1);
        }
        setCategories(newCategories);
    }

    const brandOnCheck = (val: boolean, brand: string) => {
        const newBrands = [...brands];
        if (val) {
            newBrands.push(brand);
        } else {
            newBrands.splice(newBrands.indexOf(brand), 1);
        }
        setBrands(newBrands);
    }

    const onClear = () => {
        setCategories([]);
        setBrands([]);
        setCondition(ECondition.ALL);
        setPrice(300000);
        setKeyword('');
        // getFilteredItems();
    }


    useEffect(() => {
        window.scrollTo({ top: 0 });
        getFilteredItems();
    }, [])

    return (
        <div className="container xl:max-w-7xl flex-grow py-5 px-2 md:px-0 min-h-screen flex">
            <form className="w-full max-w-xs sm:max-w-sm md:max-w-[300px] mr-3" onSubmit={onSubmit}>
                <span className="flex items-center text-sm sm:text-base">
                    <Link to='/' className="font-semibold text-gray-700">Home</Link>
                    <span className="mx-2"><FiChevronRight /></span>
                    <Link to='/shop' className="font-semibold text-gray-500">Shop</Link>
                </span>

                <div className="mt-5 mb-3 relative flex items-center">
                    <input
                        type="text"
                        name="search"
                        id="search"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full border-2 border-gray-400 rounded-md py-2 px-3 text-sm sm:text-base"
                        placeholder="Search..."
                    />
                    <button onClick={onSearch} type="button" className="absolute right-2 text-gray-500">
                        <FiSearch />
                    </button>
                </div>

                <CollapsibleSection
                    title="Price"
                    isOpened={isOpened.price}
                    onToggle={() => setOpened({ ...isOpened, price: !isOpened.price })}
                >
                    <input
                        type="range"
                        min="0"
                        max="300000"
                        value={price}
                        onChange={(e) => setPrice(parseInt(e.target.value))}
                        onMouseUp={priceOnChange}
                        className="w-full cursor-pointer accent-yellow-500"
                    />
                    <div className="flex justify-between text-gray-500 text-xs sm:text-sm mt-1">
                        <span>Rs.0</span>
                        <span>Rs.{price}</span>
                        <span>Rs.300,000</span>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection
                    title="Condition"
                    isOpened={isOpened.condition}
                    onToggle={() => setOpened({ ...isOpened, condition: !isOpened.condition })}
                >
                    {conditions.map((cond) => (
                        <div key={cond.value} className="ml-3 text-sm sm:text-base">
                            <input
                                type="radio"
                                id={`condition-${cond.value}`}
                                name="condition"
                                value={cond.value}
                                checked={condition === cond.value}
                                onChange={onConditionChange}
                                className="mr-2"
                            />
                            <label htmlFor={`condition-${cond.value}`} className="text-gray-700">{cond.label}</label>
                        </div>
                    ))}
                </CollapsibleSection>

                <CollapsibleSection
                    title="Categories"
                    isOpened={isOpened.categories}
                    onToggle={() => setOpened({ ...isOpened, categories: !isOpened.categories })}
                >
                    {allCategories.map((cat) => (
                        <div key={cat} className="ml-3 text-sm sm:text-base">
                            <input
                                checked={categories.includes(cat)}
                                onChange={(e) => categoryOnCheck(e.target.checked, cat)}
                                type="checkbox"
                                name={`cb-cat-${cat}`}
                                id={`cb-cat-${cat}`}
                                className="mr-2"
                            />
                            <label htmlFor={`cb-cat-${cat}`} className="text-gray-700">{cat}</label>
                        </div>
                    ))}
                </CollapsibleSection>

                <CollapsibleSection
                    title="Brands"
                    isOpened={isOpened.brands}
                    onToggle={() => setOpened({ ...isOpened, brands: !isOpened.brands })}
                >
                    {allBrands.map(({ brand }) => (
                        <div key={brand} className="ml-3 text-sm sm:text-base">
                            <input
                                checked={brands.includes(brand)}
                                onChange={(e) => brandOnCheck(e.target.checked, brand)}
                                type="checkbox"
                                name={`cb-bnd-${brand}`}
                                id={`cb-bnd-${brand}`}
                                className="mr-2"
                            />
                            <label htmlFor={`cb-bnd-${brand}`} className="text-gray-700">{brand}</label>
                        </div>
                    ))}
                </CollapsibleSection>

                <Button
                    onClick={onClear}
                    className="w-full flex items-center justify-center gap-3 bg-main/80 text-sm sm:text-base"
                >
                    Clear
                    <FiDelete className="rotate-180" />
                </Button>
            </form>

            <div className="border-l border-main pl-3 flex-grow">
                <h3>Shop</h3>

                <div className="flex items-end justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-500">Showing {filteredItems.length} of {count.tot} results</span>

                    <div className="w-[200px]">
                        <select
                            onChange={onSortChange}
                            id="countries" className="bg-gray-300 border border-gray-500 text-gray-800 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            <option value='new' selected>Sort By Latest</option>
                            <option value='low'>Sort By Price (Low to High)</option>
                            <option value='high'>Sort By Price (High to Low)</option>
                            <option value='popular'>Sort By Popularity</option>
                        </select>
                    </div>
                    {/* sort */}

                </div>

                {
                    loading
                        ? <div className="w-full h-full flex justify-center p-4 pt-40 gap-4 border-t border-gray-400">
                            <FiLoader className="text-5xl text-main animate-spin" />
                        </div>
                        : <ItemsList items={filteredItems} className="p-4 gap-4 border-t border-gray-400" />}
            </div>
        </div>
    )
}