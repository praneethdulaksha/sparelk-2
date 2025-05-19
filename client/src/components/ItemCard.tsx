/**
 * ItemCard Component
 *
 * Displays a product card with image, price, rating, and add-to-cart functionality.
 * Includes hover effects, loading states, and proper error handling.
 *
 * @module Components/ItemCard
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { TItem } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { api } from "@/api/api";
import { cartActions } from "@/reducers/cartSlice";
import { RootState } from "@/store/store";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import { withLoading } from "./ui/with-loading";

/**
 * Props interface for the ItemCard component
 * @interface ItemCardProps
 */
interface ItemCardProps {
  /** Item data to display in the card */
  itm: TItem;
}

/**
 * Skeleton loading state for the ItemCard
 * Displays a placeholder while the item data is being loaded
 *
 * @returns {JSX.Element} Skeleton loading component
 */
const ItemCardSkeleton = () => (
  <div className="relative bg-white rounded-lg border shadow-sm h-full flex flex-col">
    <div className="p-2 aspect-square bg-slate-50 flex items-center justify-center">
      <Skeleton className="h-4/5 w-4/5" />
    </div>
    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
      <div>
        <Skeleton className="h-5 w-3/4 mb-1" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex justify-between items-end pt-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </div>
  </div>
);

/**
 * Main ItemCard component
 * Displays product information and provides add to cart functionality
 *
 * @param {ItemCardProps} props - Component props
 * @returns {JSX.Element} ItemCard component
 */
function ItemCard({ itm }: ItemCardProps) {
  // Get user data from Redux store
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  // Track loading state when adding item to cart
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  /**
   * Handles adding an item to the cart
   * Prevents default link navigation and makes API call
   *
   * @param {React.MouseEvent} e - Click event
   */
  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Validation checks
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    if (itm.stock <= 0) {
      toast.error("Item out of stock");
      return;
    }

    setIsAddingToCart(true);

    try {
      // API call to add item to cart
      const cart = await api.post("cart/item", {
        userId: user._id,
        itemId: itm._id,
        qty: 1,
      });
      // Update Redux store with new cart data
      dispatch(cartActions.addToCart(cart.data.data.items));
      toast.success(`${itm.name} added to cart`);
    } catch (err: any) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to add item to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  /**
   * Calculates the discount percentage for display
   * @returns {number} Rounded discount percentage
   */
  const calculateDiscountPercentage = () => {
    return Math.round(itm.discount);
  };

  /**
   * Calculates the final price after applying discount
   * @returns {number} Final price after discount
   */
  const calculateFinalPrice = () => {
    return itm.price * ((100 - itm.discount) / 100);
  };

  return (
    <Link
      to={`/item/${itm._id}`}
      className="relative bg-white rounded-lg border shadow-sm h-full flex flex-col hover:shadow-md transition-shadow group"
    >
      {/* Discount badge - shown only when item has a discount */}
      {itm.discount > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white px-2 py-1 text-xs font-medium rounded">
          {calculateDiscountPercentage()}% OFF
        </div>
      )}

      {/* Product image with zoom effect on hover */}
      <div className="p-2 aspect-square bg-slate-50 flex items-center justify-center overflow-hidden">
        <img
          src={`http://localhost:3000/images/${itm.image}`}
          alt={itm.name}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Product details section */}
      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          {/* Product name with 2-line clamp for consistent height */}
          <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
            {itm.name}
          </h3>
          {/* Star rating display */}
          <div className="flex items-center mt-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(itm.rating || 0)
                      ? "fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              ({itm.rating.toFixed(1)})
            </span>
          </div>
        </div>

        {/* Price and add to cart section */}
        <div className="flex justify-between items-end pt-2">
          <div>
            {/* Show original and discounted price if discount exists */}
            {itm.discount > 0 ? (
              <div>
                <span className="text-sm font-medium text-gray-500 line-through">
                  Rs. {itm.price.toLocaleString()}
                </span>
                <p className="text-sm font-semibold text-gray-900">
                  Rs. {calculateFinalPrice().toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-sm font-semibold text-gray-900">
                Rs. {itm.price.toLocaleString()}
              </p>
            )}
          </div>

          {/* Add to cart button with loading state */}
          <button
            onClick={addToCart}
            className={`rounded-full p-2 ${
              itm.stock <= 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
            } transition-colors`}
            disabled={itm.stock <= 0 || isAddingToCart}
          >
            {isAddingToCart ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ShoppingCart className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}

// Wrap component with loading HOC to handle loading states
const ItemCardWithLoading = withLoading(ItemCard, ItemCardSkeleton);

export default ItemCardWithLoading;
