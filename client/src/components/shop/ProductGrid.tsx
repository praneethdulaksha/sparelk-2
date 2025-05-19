/**
 * ProductGrid Component
 *
 * Displays products in either grid or list view with responsive layout.
 * Includes image handling, discount calculations, rating display, and add-to-cart functionality.
 *
 * @module Components/Shop/ProductGrid
 */
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { cartActions } from "@/reducers/cartSlice";
import { toast } from "sonner";
import { brands } from "@/data/brands";

// Add a CSS class to override the default Link hover color
const productCardStyles = {
  link: "text-current hover:text-current no-underline",
};

/**
 * Props interface for the ProductGrid component
 * @interface ProductGridProps
 */
interface ProductGridProps {
  /** Array of product items to display */
  items: any[];
  /** Display mode - grid for card layout, list for horizontal layout */
  viewMode: "grid" | "list";
}

/**
 * ProductGrid component
 * Displays products in either grid or list view with responsive layout
 *
 * @param {ProductGridProps} props - Component props
 * @returns {JSX.Element} ProductGrid component
 */
export function ProductGrid({
  items = [],
  viewMode = "grid",
}: ProductGridProps) {
  const dispatch = useDispatch();
  // Track loading state for each item when adding to cart
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  // Cache for item images to prevent unnecessary API calls
  const [imageCache, setImageCache] = useState<{
    [key: string]: string;
  }>({});

  /**
   * Load and cache images when items change
   * Handles various image formats and provides fallbacks
   */
  useEffect(() => {
    const fetchItemDetails = async () => {
      const newCache: { [key: string]: string } = { ...imageCache };

      for (const item of items) {
        if (!imageCache[item._id] && item._id) {
          try {
            // Try to get a proper image URL for this item
            let imageUrl = null;

            // Direct access to image property (from Item page)
            if (item.image) {
              imageUrl = `http://localhost:3000/images/${item.image}`;
            }
            // Check if images array exists and has items
            else if (item.images && item.images.length > 0) {
              const img = item.images[0];
              // If the image is a string URL
              if (typeof img === "string" && img) {
                if (img.startsWith("http")) {
                  imageUrl = img;
                } else {
                  // Assume it's a relative path
                  imageUrl = `http://localhost:3000/images/${img}`;
                }
              }
              // If it's an object with url property
              else if (typeof img === "object" && img && img.url) {
                imageUrl = img.url.startsWith("http")
                  ? img.url
                  : `http://localhost:3000/images/${img.url}`;
              }
            }

            // If still no image, try to load the full item data
            if (!imageUrl && item._id) {
              try {
                // Fetch complete item details
                const response = await fetch(
                  `http://localhost:3000/sparelk/api/v1/item/${item._id}`
                );
                if (response.ok) {
                  const fullItem = await response.json();
                  if (
                    fullItem.data &&
                    fullItem.data.data &&
                    fullItem.data.data.image
                  ) {
                    imageUrl = `http://localhost:3000/images/${fullItem.data.data.image}`;
                  }
                }
              } catch (error) {
                console.error("Error fetching full item data:", error);
              }
            }

            // Set a category-based placeholder if no image is found
            if (!imageUrl) {
              // Set category-specific placeholder based on item.category
              if (item.category) {
                const category = item.category.toLowerCase();
                if (category.includes("engine")) {
                  imageUrl =
                    "https://placehold.co/400x400/f5f5f5/a0aec0?text=Engine+Part";
                } else if (category.includes("brake")) {
                  imageUrl =
                    "https://placehold.co/400x400/f5f5f5/a0aec0?text=Brake+Part";
                } else if (
                  category.includes("tire") ||
                  category.includes("wheel")
                ) {
                  imageUrl =
                    "https://placehold.co/400x400/f5f5f5/a0aec0?text=Wheel";
                } else if (category.includes("light")) {
                  imageUrl =
                    "https://placehold.co/400x400/f5f5f5/a0aec0?text=Light";
                } else {
                  imageUrl =
                    "https://placehold.co/400x400/f5f5f5/a0aec0?text=Auto+Part";
                }
              } else {
                imageUrl =
                  "https://placehold.co/400x400/f5f5f5/a0aec0?text=Auto+Part";
              }
            }

            // Add to cache
            newCache[item._id] = imageUrl;
          } catch (error) {
            console.error("Error processing image for item:", item.name, error);
            newCache[item._id] =
              "https://placehold.co/400x400/f8fafc/94a3b8?text=Image+Error";
          }
        }
      }

      // Update cache if we have new entries
      if (Object.keys(newCache).length > Object.keys(imageCache).length) {
        setImageCache(newCache);
      }
    };

    fetchItemDetails();
  }, [items]);

  /**
   * Adds an item to the cart
   * Shows a loading indicator and displays toast notification
   *
   * @param {any} item - The product to add to the cart
   */
  const addToCart = (item: any) => {
    // Set loading state for this specific item
    setLoadingStates((prev) => ({ ...prev, [item._id]: true }));

    // Simulate a short delay (replace with actual API call if needed)
    setTimeout(() => {
      dispatch(cartActions.addItemToCart({ itemId: item._id, qty: 1 }));
      toast.success(`${item.name} added to cart`);
      setLoadingStates((prev) => ({ ...prev, [item._id]: false }));
    }, 300);
  };

  /**
   * Helper function to get image URL
   * Returns cached image or placeholder while loading
   *
   * @param {any} item - The product item
   * @returns {string} Image URL
   */
  const getImageUrl = (item: any) => {
    // If we have a cached image for this item, use it
    if (imageCache[item._id]) {
      return imageCache[item._id];
    }

    // Default placeholder while loading
    return "https://placehold.co/400x400/f8fafc/94a3b8?text=Loading...";
  };

  /**
   * Helper function to handle click on card elements that shouldn't navigate
   * Prevents event propagation for actions like add-to-cart
   *
   * @param {React.MouseEvent} e - Mouse event
   */
  const handleStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  /**
   * Check if product is new - either by condition or by creation date
   *
   * @param {any} item - The product item
   * @returns {boolean} True if product is new
   */
  const isNewProduct = (item: any) => {
    // Check if condition is explicitly "New"
    if (item.condition === "New") return true;

    // Alternatively, check if it was added recently (within last 7 days)
    if (item.createdAt) {
      const createdDate = new Date(item.createdAt);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return createdDate > sevenDaysAgo;
    }

    return false;
  };

  /**
   * Calculate discount percentage for an item
   *
   * @param {any} item - The product item
   * @returns {number} Discount percentage
   */
  const getDiscountPercentage = (item: any) => {
    // Check if item has a discountPercentage property
    if (item.discountPercentage > 0) {
      return item.discountPercentage;
    }

    // Check if item has both price and discount properties (from the Item page)
    if (item.price && (item.discount || item.discount === 0)) {
      return item.discount;
    }

    return 0;
  };

  /**
   * Get the brand logo URL if available
   *
   * @param {any} item - The product item
   * @returns {string} Brand logo URL or empty string
   */
  const getBrandLogo = (item: any): string => {
    if (item.brand) {
      const brandInfo = brands.find((b) => b.brand === item.brand);
      if (brandInfo?.url) {
        return brandInfo.url;
      }
    }
    return ""; // Return empty string instead of null
  };

  /**
   * Check if a brand has a logo
   *
   * @param {any} item - The product item
   * @returns {boolean} True if brand has logo
   */
  const hasBrandLogo = (item: any): boolean => {
    if (item.brand) {
      const brandInfo = brands.find((b) => b.brand === item.brand);
      return !!brandInfo?.url;
    }
    return false;
  };

  /**
   * Get the number of reviews for an item
   *
   * @param {any} item - The product item
   * @returns {number} Number of reviews
   */
  const getReviewCount = (item: any) => {
    if (item.reviewCount) {
      return item.reviewCount;
    }
    if (item.sold) {
      return item.sold;
    }
    return 0;
  };

  // Display empty state when no items are available
  if (items.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-center">
        <div className="mb-4 text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <h3 className="font-semibold text-xl mb-1">No products found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          We couldn't find any products matching your search. Try adjusting your
          filters or search for something else.
        </p>
      </div>
    );
  }

  // Render the grid view
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-5 pb-16">
        {items.map((item) => (
          <Link
            to={`/item/${item._id}`}
            key={item._id}
            className={`group bg-white border rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md flex flex-col relative ${productCardStyles.link}`}
          >
            {/* Product image */}
            <div className="aspect-square overflow-hidden relative">
              <img
                src={getImageUrl(item)}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/400x400/f8fafc/94a3b8?text=No+Image";
                }}
              />

              {/* NEW badge */}
              {isNewProduct(item) && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md font-medium text-xs">
                  NEW
                </div>
              )}

              {/* DISCOUNT badge */}
              {getDiscountPercentage(item) > 0 && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-md font-semibold text-xs">
                  -{getDiscountPercentage(item)}% OFF
                </div>
              )}
            </div>

            {/* Product details */}
            <div className="px-4 pt-5 pb-6 flex flex-col flex-grow">
              {/* Category */}
              {item.category && (
                <div className="text-xs text-slate-600 mb-2">
                  {item.category}
                </div>
              )}

              {/* Product name */}
              <h3 className="font-semibold text-base mb-2 text-slate-800 line-clamp-2">
                {item.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      (item.rating && star <= Math.floor(item.rating)) ||
                      star <= 5
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
                <span className="text-sm text-slate-600 ml-2">
                  ({getReviewCount(item)})
                </span>
              </div>

              {/* Price */}
              <div className="mt-auto">
                {getDiscountPercentage(item) > 0 && (
                  <div className="text-xs text-slate-500 line-through">
                    Rs.{" "}
                    {Math.round(
                      item.price / (1 - getDiscountPercentage(item) / 100)
                    ).toLocaleString()}
                  </div>
                )}
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-bold">
                    Rs. {item.price.toLocaleString()}
                  </div>
                  {/* Brand logo */}
                  {hasBrandLogo(item) ? (
                    <img
                      src={getBrandLogo(item)}
                      alt={item.brand}
                      className="h-4 max-w-14 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-xs text-slate-500">No Brand</span>
                  )}
                </div>

                {/* Add to cart button */}
                {item.isActive !== false ? (
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md transition-colors font-medium mt-2"
                    disabled={loadingStates[item._id]}
                    onClick={(e) => {
                      handleStopPropagation(e);
                      addToCart(item);
                    }}
                  >
                    {loadingStates[item._id] ? (
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    ) : (
                      <span className="flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </span>
                    )}
                  </Button>
                ) : (
                  <div className="w-full text-center py-2 text-sm text-red-500 bg-red-50 rounded-md">
                    Out of stock
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  // Render the list view - longer horizontal cards
  return (
    <div className="space-y-5 pb-16">
      {items.map((item) => (
        <Link
          to={`/item/${item._id}`}
          key={item._id}
          className={`flex flex-col sm:flex-row border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-all relative ${productCardStyles.link}`}
        >
          {/* Product image */}
          <div className="sm:w-56 md:w-64 lg:w-72 shrink-0">
            <div className="aspect-square sm:h-full relative">
              <img
                src={getImageUrl(item)}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/400x400/f8fafc/94a3b8?text=No+Image";
                }}
              />

              {/* NEW badge */}
              {isNewProduct(item) && (
                <div className="absolute top-3 left-3 bg-blue-600 text-white px-4 py-1 rounded-md font-medium text-sm">
                  NEW
                </div>
              )}

              {/* DISCOUNT badge */}
              {getDiscountPercentage(item) > 0 && (
                <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-md font-medium text-sm">
                  -{getDiscountPercentage(item)}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Product details */}
          <div className="flex-1 p-4 flex flex-col">
            {/* Category */}
            {item.category && (
              <div className="text-sm text-slate-600 mb-1">{item.category}</div>
            )}

            {/* Product name */}
            <h3 className="font-medium text-xl mb-2 text-slate-800">
              {item.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    (item.rating && star <= Math.floor(item.rating)) ||
                    star <= 5
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
              <span className="text-sm text-slate-600 ml-2">
                ({getReviewCount(item)})
              </span>
            </div>

            {/* Product description */}
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
              {item.description || "No description available for this product."}
            </p>

            {/* Item details */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              {item.partNumber && (
                <div>
                  <span className="text-slate-500">Part Number:</span>{" "}
                  <span className="font-medium">{item.partNumber}</span>
                </div>
              )}
              {item.compatibleWith && (
                <div className="col-span-2">
                  <span className="text-slate-500">Compatible with:</span>{" "}
                  <span className="font-medium">{item.compatibleWith}</span>
                </div>
              )}
            </div>

            {/* Price and Add to Cart */}
            <div className="mt-auto">
              <div className="flex justify-between items-center mb-4">
                <div>
                  {getDiscountPercentage(item) > 0 && (
                    <div className="text-sm text-slate-500 line-through">
                      Rs.{" "}
                      {Math.round(
                        item.price / (1 - getDiscountPercentage(item) / 100)
                      ).toLocaleString()}
                    </div>
                  )}
                  <div className="text-xl font-bold">
                    Rs. {item.price.toLocaleString()}
                  </div>
                </div>

                {/* Brand logo */}
                {hasBrandLogo(item) ? (
                  <img
                    src={getBrandLogo(item)}
                    alt={item.brand}
                    className="h-5 max-w-16 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-xs text-slate-500">No Brand</span>
                )}
              </div>

              {/* Add to cart button */}
              <div className="flex gap-2 mt-2">
                {item.isActive !== false ? (
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md transition-colors font-medium"
                    disabled={loadingStates[item._id]}
                    onClick={(e) => {
                      handleStopPropagation(e);
                      addToCart(item);
                    }}
                  >
                    {loadingStates[item._id] ? (
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    ) : (
                      <span className="flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </span>
                    )}
                  </Button>
                ) : (
                  <div className="w-full text-center py-2 text-sm text-red-500 bg-red-50 rounded-md">
                    Out of stock
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
