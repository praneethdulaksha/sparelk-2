import { Button } from "@/components/ui/button";
import { X, ChevronDown, ChevronUp, Search } from "lucide-react";
import { useState } from "react";
import { allCategories } from "@/data/categories";
import { brands as allBrands } from "@/data/brands";
import { ECondition } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface MobileFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  price: number;
  onPriceChange: (value: number) => void;
  condition: ECondition;
  onConditionChange: (condition: ECondition) => void;
  categories: string[];
  onCategoryChange: (checked: boolean, category: string) => void;
  brands: string[];
  onBrandChange: (checked: boolean, brand: string) => void;
  activeFilters: string[];
  toggleFilter: (filter: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
}

interface FilterCardProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterCard({ title, children, defaultOpen = true }: FilterCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="mb-4 shadow-none border-0">
      <div
        className="flex justify-between items-center px-4 py-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium">{title}</h3>
        <button className="text-gray-500">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      {isOpen && (
        <>
          <Separator />
          <CardContent className="pt-4">{children}</CardContent>
        </>
      )}
    </Card>
  );
}

export function MobileFilters({
  isOpen,
  onClose,
  price,
  onPriceChange,
  condition,
  onConditionChange,
  categories,
  onCategoryChange,
  brands,
  onBrandChange,
  activeFilters,
  toggleFilter,
  clearFilters,
  applyFilters,
}: MobileFiltersProps) {
  const conditions = [
    { value: ECondition.ALL, label: "All" },
    { value: ECondition.NEW, label: "New" },
    { value: ECondition.USED, label: "Used" },
    // Adding Refurbished as a custom option with string value
    { value: "Refurbished" as ECondition, label: "Refurbished" },
  ];

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(price);
  const [brandSearchQuery, setBrandSearchQuery] = useState("");

  // Filter brands based on search query
  const filteredBrands = allBrands.filter(({ brand }) =>
    brand.toLowerCase().includes(brandSearchQuery.toLowerCase())
  );

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseInt(e.target.value);
    setMaxPrice(newPrice);
    onPriceChange(newPrice);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end md:items-center">
      <div className="bg-white w-full max-h-[85vh] md:max-h-[90vh] overflow-auto rounded-t-xl md:rounded-lg md:max-w-md md:mx-4">
        <div className="sticky top-0 bg-white z-10 p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-medium">Filters</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {activeFilters.length > 0 && (
          <div className="px-4 py-2 flex flex-wrap gap-1 border-b">
            {activeFilters.map((filter) => (
              <span
                key={filter}
                className="bg-slate-100 text-xs rounded-full px-2 py-1 flex items-center gap-1"
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
              className="text-xs text-orange-500 hover:text-orange-600 ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="p-4 space-y-4">
          {/* Price Range */}
          <FilterCard title="Price Range">
            <div className="space-y-4">
              {/* Min/Max inputs */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    Rs.
                  </div>
                </div>
                <span className="text-gray-500">-</span>
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      setMaxPrice(val);
                      onPriceChange(val);
                    }}
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    Rs.
                  </div>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={0}
                max={300000}
                value={maxPrice}
                onChange={handleRangeChange}
                className="w-full accent-orange-500 focus:outline-none focus:ring-0"
                style={{
                  background: `linear-gradient(to right, #f97316 0%, #f97316 ${
                    (maxPrice / 300000) * 100
                  }%, #e5e7eb ${(maxPrice / 300000) * 100}%, #e5e7eb 100%)`,
                  height: "6px",
                  borderRadius: "4px",
                  outline: "none",
                  WebkitAppearance: "none",
                  border: "none",
                }}
              />

              {/* Price range text */}
              <div className="flex justify-between text-sm text-gray-500">
                <span>Rs. 0</span>
                <span>Rs. 300,000</span>
              </div>
            </div>
          </FilterCard>

          {/* Condition */}
          <FilterCard title="Condition">
            <RadioGroup
              value={condition}
              onValueChange={(value) => onConditionChange(value as ECondition)}
              className="space-y-2"
            >
              {conditions.map((cond) => (
                <div key={cond.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={cond.value}
                    id={`mobile-condition-${cond.value}`}
                  />
                  <Label
                    htmlFor={`mobile-condition-${cond.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {cond.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FilterCard>

          {/* Categories */}
          <FilterCard title="Categories">
            <ScrollArea className="h-48">
              <div className="space-y-2 pr-4">
                {allCategories.map((cat) => (
                  <div key={cat} className="flex items-center space-x-2">
                    <Checkbox
                      id={`mobile-cat-${cat}`}
                      checked={categories.includes(cat)}
                      onCheckedChange={(checked) =>
                        onCategoryChange(!!checked, cat)
                      }
                    />
                    <Label
                      htmlFor={`mobile-cat-${cat}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {cat}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </FilterCard>

          {/* Brands */}
          <FilterCard title="Brands">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search brands..."
                  value={brandSearchQuery}
                  onChange={(e) => setBrandSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <ScrollArea className="h-48">
                <div className="space-y-2 pr-4">
                  {filteredBrands.map(({ brand }) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mobile-brand-${brand}`}
                        checked={brands.includes(brand)}
                        onCheckedChange={(checked) =>
                          onBrandChange(!!checked, brand)
                        }
                      />
                      <Label
                        htmlFor={`mobile-brand-${brand}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </FilterCard>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              clearFilters();
              onClose();
            }}
          >
            Reset
          </Button>

          <Button
            className="flex-1 bg-orange-500 hover:bg-orange-600"
            onClick={() => {
              applyFilters();
              onClose();
            }}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
