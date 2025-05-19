import { Minus, Plus, Truck, Calendar, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DeliveryDateRange {
  start: string;
  end: string;
}

interface ProductPricingProps {
  price: number;
  originalPrice: number;
  discount: number;
  quantity: number;
  stockCount: number;
  deliveryFee: number;
  deliveryDate: DeliveryDateRange;
  onQuantityChange: (quantity: number) => void;
}

export function ProductPricing({
  price,
  originalPrice,
  discount,
  quantity,
  stockCount,
  deliveryFee,
  deliveryDate,
  onQuantityChange,
}: ProductPricingProps) {
  return (
    <div className="space-y-4">
      {/* Price display */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-3xl font-bold text-slate-900">
            Rs.{price.toLocaleString()}.00
          </h2>
          {discount > 0 && (
            <Badge className="bg-orange-500 text-white border-orange-500">
              -{discount}% OFF
            </Badge>
          )}
        </div>
        {originalPrice && originalPrice > price && (
          <div className="flex items-center gap-2">
            <span className="text-slate-500 line-through">
              Rs.{originalPrice.toLocaleString()}
            </span>
            <span className="text-orange-500 text-sm font-medium">
              Save Rs.{(originalPrice - price).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Quantity selector */}
      <div className="flex flex-wrap gap-6 items-center">
        <div className="space-y-1">
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-slate-700"
          >
            Quantity
          </label>
          <div className="flex items-center">
            <button
              onClick={() => onQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center rounded-l-md border border-r-0 bg-slate-50 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              id="quantity"
              type="text"
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  onQuantityChange(value);
                }
              }}
              className="w-12 h-10 text-center border-y focus:outline-none focus:ring-2 focus:ring-orange-500"
              readOnly
              aria-label="Product quantity"
            />
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              disabled={quantity >= stockCount}
              className="w-10 h-10 flex items-center justify-center rounded-r-md border border-l-0 bg-slate-50 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div>
          <span className="text-sm text-slate-500">
            Only Left:{" "}
            <span className="font-medium text-slate-700">
              {stockCount} item(s)
            </span>
          </span>
        </div>
      </div>

      {/* Delivery information */}
      <div className="pt-4 border-t border-slate-200">
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium">Delivery Fee</span>
            </div>
            <span className="text-sm font-medium">
              Rs.{deliveryFee.toLocaleString()}.00
            </span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4 text-slate-500 mt-0.5" />
            <span>
              Delivery by {deliveryDate.start} - {deliveryDate.end}
            </span>
          </div>
        </div>
      </div>

      {/* Stock warning if low */}
      {stockCount <= 5 && (
        <div className="flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-md">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">
            Low stock! Only {stockCount} items left. Order soon to secure your
            purchase.
          </p>
        </div>
      )}
    </div>
  );
}
