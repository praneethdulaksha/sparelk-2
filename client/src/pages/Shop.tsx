/**
 * Shop Page Component
 *
 * Provides a comprehensive shopping interface with filtering, sorting, and search functionality.
 * Includes responsive design for both desktop and mobile views with different product display modes.
 *
 * @module Pages/Shop
 */
import { useLocation, useNavigate } from "react-router-dom";
import {
  SlidersHorizontal,
  Search,
  X,
  ChevronDown,
  Grid3x3,
  List,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { api } from "@/api/api";
import { ECondition } from "@/types";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { MobileFilters } from "@/components/shop/MobileFilters";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ProductGrid } from "@/components/shop/ProductGrid";

/**
 * Shop page component
 * Provides product browsing with extensive filtering options
 *
 * @returns {JSX.Element} Shop page component
 */
export default function Shop() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const keywordFromUrl = searchParams.get("keyword") || "";

  // Check if categories or brands were passed through navigation state
  const brandFromState = location.state?.brand || null;
  const catFromState = location.state?.cat || null;

  /**
   * State variables for filtering, sorting, and display options
   */
  // State for loading and product data
  const [loading, setLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  // State for filter criteria
  const [price, setPrice] = useState(300000);
  const [categories, setCategories] = useState<string[]>(
    [catFromState].filter(Boolean)
  );
  const [brands, setBrands] = useState<string[]>(
    [brandFromState].filter(Boolean)
  );
  const [condition, setCondition] = useState<ECondition>(ECondition.ALL);
  const [keyword, setKeyword] = useState(keywordFromUrl);

  // State for UI controls
  const [sort, setSort] = useState<"new" | "low" | "high" | "popular">("new");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  // Ref for handling clicks outside dropdown
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Collects all active filters for display
   * @returns {string[]} Array of active filter strings
   */
  const getActiveFilters = () => {
    const filters: string[] = [];
    if (condition !== ECondition.ALL) filters.push(condition);
    categories.forEach((cat) => filters.push(cat));
    brands.forEach((brand) => filters.push(brand));
    if (price < 300000) filters.push(`Under Rs.${price.toLocaleString()}`);
    return filters;
  };

  const activeFilters = getActiveFilters();

  /**
   * Toggles a filter on/off when user clicks filter tag
   * @param {string} filter - Filter to toggle
   */
  const toggleFilter = (filter: string) => {
    if (filter === condition) {
      setCondition(ECondition.ALL);
    } else if (categories.includes(filter)) {
      setCategories(categories.filter((c) => c !== filter));
    } else if (brands.includes(filter)) {
      setBrands(brands.filter((b) => b !== filter));
    } else if (filter.startsWith("Under Rs.")) {
      setPrice(300000);
    }
  };

  /**
   * Helper function to complete loading with small delay for UI smoothness
   */
  const loadingDone = () => setTimeout(() => setLoading(false), 500);

  /**
   * Resets all filter criteria to default values
   */
  const clearFilters = () => {
    setCategories([]);
    setBrands([]);
    setCondition(ECondition.ALL);
    setPrice(300000);
    setKeyword("");
  };

  /**
   * Fetches items from API based on current filter criteria
   */
  const getFilteredItems = async () => {
    setLoading(true);
    try {
      const resp = await api.put("item/filter", {
        price,
        condition,
        categories: categories.join(","),
        brands: brands.join(","),
        keyword,
        sort,
        count: { limit: 999, page: 1 }, // Set a high limit to get all items
      });
      setFilteredItems(resp.data.items);
      setTotalItems(resp.data.count.tot);
    } catch (err) {
      console.error(err);
    } finally {
      loadingDone();
    }
  };

  /**
   * Applies current filters and fetches updated results
   */
  const applyFilters = () => {
    getFilteredItems();
  };

  /**
   * Updates price filter and triggers re-filtering
   * @param {number} value - New price value
   */
  const handlePriceChange = (value: number) => {
    setPrice(value);
  };

  /**
   * Handles search form submission
   * @param {React.FormEvent} e - Form event
   */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getFilteredItems();
  };

  /**
   * Updates category filters when checkboxes change
   * @param {boolean} checked - Whether checkbox is checked
   * @param {string} cat - Category name
   */
  const handleCategoryChange = (checked: boolean, cat: string) => {
    const newCategories = [...categories];
    if (checked) {
      newCategories.push(cat);
    } else {
      newCategories.splice(newCategories.indexOf(cat), 1);
    }
    setCategories(newCategories);
  };

  /**
   * Updates brand filters when checkboxes change
   * @param {boolean} checked - Whether checkbox is checked
   * @param {string} brand - Brand name
   */
  const handleBrandChange = (checked: boolean, brand: string) => {
    const newBrands = [...brands];
    if (checked) {
      newBrands.push(brand);
    } else {
      newBrands.splice(newBrands.indexOf(brand), 1);
    }
    setBrands(newBrands);
  };

  /**
   * Updates sort order and re-filters products
   * @param {"new" | "low" | "high" | "popular"} value - Sort option
   */
  const handleSortChange = (value: "new" | "low" | "high" | "popular") => {
    setSort(value);
    getFilteredItems();
  };

  /**
   * Rerun search when filter criteria changes
   * Excludes keyword changes which are handled separately
   */
  useEffect(() => {
    if (!location.search.includes("keyword=")) {
      getFilteredItems();
    }
  }, [condition, sort, categories, brands]);

  /**
   * Initial data load on component mount
   */
  useEffect(() => {
    window.scrollTo({ top: 0 });
    getFilteredItems();
  }, []);

  /**
   * Respond to URL search parameter changes
   * Updates keyword and re-filters products
   */
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newKeyword = searchParams.get("keyword") || "";
    setKeyword(newKeyword);

    // Execute search with updated parameters
    const fetchItems = async () => {
      setLoading(true);
      try {
        const resp = await api.put("item/filter", {
          price,
          condition,
          categories: categories.join(","),
          brands: brands.join(","),
          keyword: newKeyword,
          sort,
          count: { limit: 999, page: 1 }, // Set a high limit to get all items
        });
        setFilteredItems(resp.data.items);
        setTotalItems(resp.data.count.tot);
      } catch (err) {
        console.error(err);
      } finally {
        loadingDone();
      }
    };

    fetchItems();
  }, [location.search]);

  /**
   * Handle click outside for sort dropdown closure
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setSortMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Shop Auto Parts
          </h1>
          <p className="text-slate-300 max-w-2xl">
            Browse our extensive collection of genuine and aftermarket parts for
            all major vehicle brands. Quality guaranteed with fast shipping.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-4 py-3 h-fit flex items-center">
          <Breadcrumb />
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-4 py-6 bg-gray-50">
        <div className="flex flex-col lg:flex-row gap-6 bg-gray-50">
          {/* Sidebar - desktop only */}
          <div className="hidden lg:block w-64 flex-shrink-0 bg-gray-50">
            <FilterSidebar
              price={price}
              onPriceChange={handlePriceChange}
              condition={condition}
              onConditionChange={setCondition}
              categories={categories}
              onCategoryChange={handleCategoryChange}
              brands={brands}
              onBrandChange={handleBrandChange}
              activeFilters={activeFilters}
              toggleFilter={toggleFilter}
              clearFilters={clearFilters}
            />
          </div>

          {/* Main content */}
          <div className="flex-1 bg-gray-50">
            {/* Mobile filters button */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilters.length > 0 && (
                  <span className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </Button>
            </div>

            {/* Active filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 items-center">
                <span className="text-sm text-muted-foreground">
                  Active filters:
                </span>
                {activeFilters.map((filter) => (
                  <span
                    key={filter}
                    className="bg-slate-100 text-sm rounded-full px-3 py-1 flex items-center gap-1"
                  >
                    {filter}
                    <button
                      onClick={() => toggleFilter(filter)}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearFilters}
                  className="text-sm text-orange-500 hover:text-orange-700 ml-2"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Search and sorting controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="search"
                    placeholder="Search parts by name, brand, or part number..."
                    className="w-full rounded-md border bg-white pl-10 pr-4 py-2 text-sm focus:bg-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </form>
              </div>

              <div className="flex gap-2">
                <div className="relative" ref={sortDropdownRef}>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-white"
                    onClick={() => setSortMenuOpen(!sortMenuOpen)}
                  >
                    <span className="hidden sm:inline">Sort by</span>
                    <span className="inline sm:hidden">Sort</span>
                    <ChevronDown
                      className={`h-4 w-4 transform transition-transform duration-300 ease-in-out ${
                        sortMenuOpen ? "rotate-0" : "-rotate-90"
                      }`}
                    />
                  </Button>
                  {sortMenuOpen && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10 transition-opacity duration-200 opacity-100">
                      <button
                        className={`w-full text-left px-4 py-2 bg-white hover:bg-gray-100 text-sm ${
                          sort === "new" ? "text-orange-500 font-medium" : ""
                        }`}
                        onClick={() => {
                          handleSortChange("new");
                          setSortMenuOpen(false);
                        }}
                      >
                        Newest first
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 bg-white hover:bg-gray-100 text-sm ${
                          sort === "low" ? "text-orange-500 font-medium" : ""
                        }`}
                        onClick={() => {
                          handleSortChange("low");
                          setSortMenuOpen(false);
                        }}
                      >
                        Price: Low to high
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 bg-white hover:bg-gray-100 text-sm ${
                          sort === "high" ? "text-orange-500 font-medium" : ""
                        }`}
                        onClick={() => {
                          handleSortChange("high");
                          setSortMenuOpen(false);
                        }}
                      >
                        Price: High to low
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 bg-white hover:bg-gray-100 text-sm ${
                          sort === "popular"
                            ? "text-orange-500 font-medium"
                            : ""
                        }`}
                        onClick={() => {
                          handleSortChange("popular");
                          setSortMenuOpen(false);
                        }}
                      >
                        Most popular
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex border rounded-md">
                  <button
                    className={`p-2 ${
                      viewMode === "grid" ? "bg-white" : "bg-slate-100"
                    }`}
                    onClick={() => setViewMode("grid")}
                    title="Grid view"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </button>
                  <button
                    className={`p-2 ${
                      viewMode === "list" ? "bg-white" : "bg-slate-100"
                    }`}
                    onClick={() => setViewMode("list")}
                    title="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results summary */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {filteredItems.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {totalItems}
                </span>{" "}
                results
              </p>
            </div>

            {/* Loading state or product grid */}
            {loading ? (
              <div className="w-full py-12 flex justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <ProductGrid items={filteredItems} viewMode={viewMode} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters */}
      <MobileFilters
        isOpen={isMobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        price={price}
        onPriceChange={handlePriceChange}
        condition={condition}
        onConditionChange={setCondition}
        categories={categories}
        onCategoryChange={handleCategoryChange}
        brands={brands}
        onBrandChange={handleBrandChange}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        clearFilters={clearFilters}
        applyFilters={applyFilters}
      />
    </div>
  );
}
