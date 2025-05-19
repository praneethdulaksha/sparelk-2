/**
 * DiscountItemCard Component
 *
 * Displays a product card specifically for discounted items.
 * Shows original price, discounted price, and discount percentage.
 *
 * @module Components/DiscountItemCard
 */
import { useNavigate } from "react-router-dom";

/**
 * Interface for item data displayed in the card
 *
 * @interface DiscountedItem
 */
interface DiscountedItem {
  /** Unique identifier for the item */
  _id: string;
  /** Name of the item */
  name: string;
  /** Original price before discount */
  price: number;
  /** Discount percentage applied to the item */
  discount: number;
  /** URL of the item's image */
  image: string;
}

/**
 * Props interface for the DiscountItemCard component
 *
 * @interface DiscountItemCardProps
 */
interface DiscountItemCardProps {
  /** Item data to display in the card */
  item: DiscountedItem;
}

/**
 * DiscountItemCard component
 * Displays a card for items with discount pricing
 *
 * @param {DiscountItemCardProps} props - Component props
 * @returns {JSX.Element} Discount item card component
 */
export default function DiscountItemCard({ item }: DiscountItemCardProps) {
  const navigate = useNavigate();

  /**
   * Calculates the final price after discount
   * @returns {string} Formatted price with 2 decimal places
   */
  const calculateDiscountedPrice = () => {
    return parseFloat(
      (item.price * ((100 - item.discount) / 100)).toString()
    ).toFixed(2);
  };

  return (
    <div
      className="inline-block w-44 bg-pane-color rounded-2xl overflow-hidden cursor-pointer hover:scale-105 border-black duration-100 pb-3"
      onClick={() => navigate(`/item/${item._id}`)}
    >
      <div className="flex flex-col justify-start w-full">
        {/* Product image */}
        <div
          className="aspect-square w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${item.image})` }}
        ></div>

        {/* Product name - truncated if too long */}
        <h6 className="truncate mx-3 mt-5">{item.name}</h6>

        {/* Discounted price */}
        <h4 className="mx-3 mt-3 text-price-color">
          Rs. {calculateDiscountedPrice()}
        </h4>

        {/* Original price and discount percentage */}
        <span className="mx-3 flex items-center">
          <h6 className="line-through text-gray-500">Rs.{item.price}</h6>
          <h6 className="ml-3 text-orange-500">-{item.discount}%</h6>
        </span>
      </div>
    </div>
  );
}
