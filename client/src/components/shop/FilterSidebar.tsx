import { useState } from "react";
import { allCategories } from "@/data/categories";
import { brands as allBrands } from "@/data/brands";
import { ECondition } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface FilterSidebarProps {
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
}

function CollapsibleCard({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="mb-4 shadow-none">
      <div
        className="flex justify-between items-center p-4 cursor-pointer bg-gradient-to-r from-slate-200 to-slate-100 rounded-t-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium">{title}</h3>
        <button className="text-gray-500 bg-transparent">
          <ChevronDown
            size={20}
            className={`transform transition-transform duration-300 ease-in-out ${
              isOpen ? "-rotate-180" : "rotate-0"
            }`}
          />
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

export function FilterSidebar({
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
}: FilterSidebarProps) {
  const conditions = [
    { value: ECondition.ALL, label: "All" },
    { value: ECondition.NEW, label: "New" },
    { value: ECondition.USED, label: "Used" },
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

  const handleApplyPrice = () => {
    onPriceChange(maxPrice);
  };

  return (
    <div className="space-y-4">
      {/* Price Range Section */}
      <CollapsibleCard title="Price Range">
        <div className="space-y-4">
          {/* Min/Max inputs */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Min"
                value={minPrice.toLocaleString()}
                onChange={(e) => {
                  const val = Number(e.target.value.replace(/,/g, "")) || 0;
                  setMinPrice(val);
                }}
                className="pl-8 text-sm h-fit"
              />
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                Rs.
              </div>
            </div>
            <span className="text-gray-500">-</span>
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Max"
                value={maxPrice.toLocaleString()}
                onChange={(e) => {
                  const val = Number(e.target.value.replace(/,/g, "")) || 0;
                  setMaxPrice(val);
                  onPriceChange(val);
                }}
                className="pl-8 text-sm h-fit"
              />
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
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
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Rs. 0</span>
            <span>Rs. 300,000</span>
          </div>
        </div>
      </CollapsibleCard>

      {/* Condition Section */}
      <CollapsibleCard title="Condition">
        <RadioGroup
          value={condition}
          onValueChange={(value) => onConditionChange(value as ECondition)}
          className="space-y-0.5"
        >
          {conditions.map((cond) => (
            <div key={cond.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={cond.value}
                id={`condition-${cond.value}`}
              />
              <Label
                htmlFor={`condition-${cond.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {cond.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CollapsibleCard>

      {/* Categories Section */}
      <CollapsibleCard title="Categories">
        <ScrollArea className="h-64 pr-4">
          <div className="space-y-2">
            {allCategories.map((cat) => (
              <div key={cat} className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${cat}`}
                  checked={categories.includes(cat)}
                  onCheckedChange={(checked) =>
                    onCategoryChange(!!checked, cat)
                  }
                />
                <Label
                  htmlFor={`cat-${cat}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {cat}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CollapsibleCard>

      {/* Brands Section */}
      <CollapsibleCard title="Brands">
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
          <ScrollArea className="h-64">
            <div className="space-y-2 pr-4">
              {filteredBrands.map(({ brand }) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={brands.includes(brand)}
                    onCheckedChange={(checked) =>
                      onBrandChange(!!checked, brand)
                    }
                  />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CollapsibleCard>
    </div>
  );
}
