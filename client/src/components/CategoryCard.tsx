/**
 * CategoryCard Component
 *
 * Displays a category as a clickable circular card with the category name.
 * Used for category navigation in product browsing.
 *
 * @module Components/CategoryCard
 */
import { useNavigate } from "react-router-dom";

/**
 * Props interface for the CategoryCard component
 *
 * @interface CategoryCardProps
 */
interface CategoryCardProps {
  /** The category name to display */
  category: string;
  /** Optional index for array rendering */
  index?: number;
}

/**
 * CategoryCard component
 * Renders a circular category card with navigation functionality
 *
 * @param {CategoryCardProps} props - Component props
 * @returns {JSX.Element} CategoryCard component
 */
export default function CategoryCard({ category, index }: CategoryCardProps) {
  const navigate = useNavigate();

  /**
   * Navigate to the category page when clicked
   */
  const handleCategoryClick = () => {
    navigate("/items/category/" + category);
  };

  return (
    <div className="inline-block">
      <div
        className="flex flex-col justify-center items-center w-44 h-fit hover:scale-105 duration-75 cursor-pointer"
        onClick={handleCategoryClick}
      >
        {/* Category image container */}
        <div
          className="bg-white shadow-lg aspect-square w-32 rounded-full overflow-hidden mt-5 text-center flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(https://placehold.co/100x100)` }}
        >
          {/* Placeholder for category image */}
          {/* <img src={fashionImg} className="w-full h-full" alt="" /> */}
        </div>

        {/* Category name label */}
        <label className="mt-5 text-md md:text-lg text-center w-40 truncate">
          {category}
        </label>
      </div>
    </div>
  );
}
