import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ProductInfoProps {
  name: string;
  brand: string;
  condition: string;
  vehicleModel: string;
  rating: number;
  reviewCount: number;
  storeId: string;
  storeName: string;
}

export function ProductInfo({
  name,
  brand,
  condition,
  vehicleModel,
  rating,
  reviewCount,
  storeId,
  storeName,
}: ProductInfoProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        {name}
      </h1>

      <div className="mt-3 flex flex-wrap gap-3">
        <div className="flex items-center">
          <span className="text-sm text-slate-600 mr-2">Condition:</span>
          <Badge
            variant={condition === "New" ? "default" : "secondary"}
            className="ml-1"
          >
            {condition}
          </Badge>
        </div>

        {brand && (
          <div className="flex items-center">
            <span className="text-sm text-slate-600 mr-2">Brand:</span>
            <span className="text-sm font-medium">{brand}</span>
          </div>
        )}

        {vehicleModel && vehicleModel !== "undefined" && (
          <div className="flex items-center">
            <span className="text-sm text-slate-600 mr-2">Vehicle Model:</span>
            <span className="text-sm font-medium">{vehicleModel}</span>
          </div>
        )}
      </div>

      {/* Rating display */}
      <div className="mt-4 flex items-center">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-slate-200"
              }`}
            />
          ))}
        </div>

        <a
          href="#reviews"
          className="ml-2 text-sm text-slate-600 hover:text-orange-500"
        >
          {rating} | {reviewCount} {reviewCount === 1 ? "Review" : "Reviews"}
        </a>

        {storeId && storeName && (
          <div className="ml-4 text-sm">
            <span>Store: </span>
            <Link
              to={`/store/${storeId}`}
              className="font-medium text-orange-500 hover:underline"
            >
              {storeName}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
