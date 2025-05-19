import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { RootState } from "../../store/store";
import { api } from "../../api/api";
import { TItem } from "../../types";
import {
  Package,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Calendar,
  Truck,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ExternalLink,
  ShoppingBag,
  ArrowDownUp,
  CreditCard,
  XCircle,
  AlertTriangle,
  Check,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { OrdersSkeleton } from "@/components/skeletons";
import { ErrorMessage } from "@/components/ui/error-message";

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    Pending: {
      color: "bg-blue-100 text-blue-800",
      icon: <Clock className="h-3 w-3 mr-1" />,
    },
    Processing: {
      color: "bg-blue-100 text-blue-800",
      icon: <Clock className="h-3 w-3 mr-1" />,
    },
    Shipped: {
      color: "bg-purple-100 text-purple-800",
      icon: <Truck className="h-3 w-3 mr-1" />,
    },
    Received: {
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
    },
    Delivered: {
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
    },
    Canceled: {
      color: "bg-red-100 text-red-800",
      icon: <AlertCircle className="h-3 w-3 mr-1" />,
    },
    Cancelled: {
      color: "bg-red-100 text-red-800",
      icon: <AlertCircle className="h-3 w-3 mr-1" />,
    },
  };
  const config = statusConfig[status as keyof typeof statusConfig] || {
    color: "bg-gray-100 text-gray-800",
    icon: <Clock className="h-3 w-3 mr-1" />,
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}
    >
      {config.icon}
      {status}
    </span>
  );
};

export default function MyOrders() {
  const userId = useSelector((state: RootState) => state.user.user?._id);
  const [activeStatus, setActiveStatus] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [orderDetails, setOrderDetails] = useState<Record<string, any>>({});
  const navigate = useNavigate();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<any>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [orderToConfirm, setOrderToConfirm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrderItems();
  }, []);

  function getOrderItems() {
    setLoading(true);
    setError(null);

    api
      .get("order/" + userId)
      .then((response) => {
        const items = response.data.data.reverse();
        setOrderItems(items);

        // Fetch item details for each order
        if (items.length > 0) {
          Promise.all(items.map((order: any) => fetchItemDetails(order)))
            .then(() => {
              setLoading(false);
            })
            .catch((err) => {
              console.error("Error fetching item details:", err);
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setError("Failed to load your orders. Please try again.");
        setLoading(false);
      });
  }

  function fetchItemDetails(order: any) {
    return api
      .get("item/" + order.itemId)
      .then((result) => {
        setOrderDetails((prev) => ({
          ...prev,
          [order._id]: {
            ...prev[order._id],
            item: result.data.data,
          },
        }));
      })
      .catch((err) => {
        console.log("Error fetching item details:", err);
        return null;
      });
  }

  // Filter orders based on active status
  const filteredOrders = orderItems
    .filter((order) => {
      if (activeStatus === "all") return true;
      return order.status.toLowerCase() === activeStatus.toLowerCase();
    })
    .filter((order) => {
      if (!searchQuery) return true;
      const itemDetails = orderDetails[order._id]?.item;
      return (
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (itemDetails &&
          itemDetails.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.orderDate);
    const dateB = new Date(b.orderDate);
    if (sortBy === "newest") {
      return dateB.getTime() - dateA.getTime();
    } else {
      return dateA.getTime() - dateB.getTime();
    }
  });

  const toggleOrderExpand = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  function submitReview(order: any, review: any) {
    api
      .put("order/review", { ...order, review: review })
      .then(() => {
        // Update the local state
        setOrderItems((prevItems) =>
          prevItems.map((item) =>
            item._id === order._id ? { ...item, review } : item
          )
        );

        // Show success toast
        toast.success("Your review has been submitted", {
          position: "bottom-right",
          duration: 3000,
        });
      })
      .catch((err) => console.log(err));
  }

  function initiateOrderConfirm(order: any) {
    setOrderToConfirm(order);
    setConfirmDialogOpen(true);
  }

  function confirmOrder() {
    if (!orderToConfirm) return;

    api
      .put("order", {
        ...orderToConfirm,
        status: "Received",
        receivedDate: new Date().toLocaleString(),
      })
      .then(() => {
        // Update the local state
        setOrderItems((prevItems) =>
          prevItems.map((item) =>
            item._id === orderToConfirm._id
              ? {
                  ...item,
                  status: "Received",
                  receivedDate: new Date().toLocaleString(),
                }
              : item
          )
        );

        // Close dialog
        setConfirmDialogOpen(false);

        // Show toast notification
        toast.success("Your order has been confirmed as received", {
          position: "bottom-right",
          duration: 3000,
          description: "You can now leave a review for this item.",
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to confirm order. Please try again.", {
          position: "bottom-right",
        });
      });
  }

  function initiateOrderCancel(order: any) {
    setOrderToCancel(order);
    setCancelDialogOpen(true);
  }

  function cancelOrder() {
    if (!orderToCancel) return;

    api
      .put("order", { ...orderToCancel, status: "Canceled" })
      .then(() => {
        // Update the local state
        setOrderItems((prevItems) =>
          prevItems.map((item) =>
            item._id === orderToCancel._id
              ? { ...item, status: "Canceled" }
              : item
          )
        );

        // Close dialog
        setCancelDialogOpen(false);

        // Show toast notification
        toast.success("Your order has been successfully canceled", {
          position: "bottom-right",
          duration: 3000,
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to cancel order. Please try again.", {
          position: "bottom-right",
        });
      });
  }

  function ReviewForm({ order, setReviewFormOpened }: any) {
    const userName = useSelector(
      (state: RootState) => state.user.user?.firstName
    );
    const [comment, setComment] = useState("");
    const [rate, setRate] = useState(5);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const maxChars = 500;

    const handleCancel = () => {
      setReviewFormOpened(false);
    };

    const handleReview = () => {
      if (comment.trim() === "") {
        return;
      }

      submitReview(order, {
        user: userName,
        comment: comment,
        rate: rate,
        date: new Date().toLocaleString(),
      });
      setReviewFormOpened(false);
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (value.length <= maxChars) {
        setComment(value);
        setCharCount(value.length);
      }
    };

    // Get item details for the order
    const itemDetails = orderDetails[order._id]?.item;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden animate-in fade-in duration-300">
          {/* Header */}
          <div className="bg-orange-500 py-5 px-7 text-white">
            <h2 className="text-xl font-semibold">Rate Your Purchase</h2>
            <p className="text-sm opacity-80">We value your feedback</p>
          </div>

          <div className="p-6">
            {/* Product info */}
            {itemDetails && (
              <div className="flex items-center gap-3 mb-6 p-3 bg-gray-100 rounded-lg">
                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 border">
                  <img
                    src={`http://localhost:3000/images/${itemDetails.image}`}
                    alt={itemDetails.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {itemDetails.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Order #{formatOrderId(order._id)}
                  </p>
                </div>
              </div>
            )}

            {/* Rating selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                Rate your experience
              </label>
              <div className="flex justify-center">
                <div
                  className="flex gap-1 text-4xl"
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`transition-all duration-150 transform ${
                        (hoveredRating || rate) >= star
                          ? "text-yellow-400 scale-110"
                          : "text-gray-300"
                      } hover:scale-125 focus:outline-none`}
                      onClick={() => setRate(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-10 h-10"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-center mt-2">
                <span className="text-sm font-medium">
                  {rate === 1 && "Poor"}
                  {rate === 2 && "Fair"}
                  {rate === 3 && "Good"}
                  {rate === 4 && "Very Good"}
                  {rate === 5 && "Excellent"}
                </span>
              </div>
            </div>

            {/* Comment textarea */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                Share your thoughts
              </label>
              <div className="relative">
                <textarea
                  className="w-full min-h-[120px] border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="What did you like or dislike about this product?"
                  value={comment}
                  onChange={handleCommentChange}
                ></textarea>
                <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                  {charCount}/{maxChars}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-8">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-gray-300"
              >
                Cancel
              </Button>
              <Button
                className={`bg-orange-500 hover:bg-orange-600 text-white ${
                  !comment.trim() ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleReview}
                disabled={!comment.trim()}
              >
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatOrderId = (id: string) => {
    // Get only the first part of the ID (alphanumeric)
    const shortId = id.slice(0, 4).toUpperCase();
    return `ORD-${new Date().getFullYear()}-${shortId}`;
  };

  // Show loading state
  if (loading) {
    return <OrdersSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="w-screen min-h-screen bg-gray-50 py-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-md mx-auto">
          <ErrorMessage message={error} />
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => getOrderItems()}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="px-4 md:px-6 pt-12 pb-32 max-w-7xl mx-auto">
        {/* Header section with icon */}
        <div className="flex items-center mb-4">
          <div className="mr-3 text-orange-500">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-gray-500 text-sm">
              Track and manage your order history
            </p>
          </div>
        </div>

        {/* Search and filter section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-5 mt-7 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search input */}
            <div className="flex-grow relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="search"
                placeholder="Search by order ID or product name..."
                className="border border-gray-200 rounded-md py-2 pl-10 pr-4 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sort options */}
            <div className="inline-flex items-center">
              <span className="text-sm mr-2 whitespace-nowrap font-medium">
                Sort by:
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[130px] h-9 border-gray-200 flex items-center justify-between"
                  >
                    <span>
                      {sortBy === "newest" ? "Newest First" : "Oldest First"}
                    </span>
                    <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[130px]">
                  <DropdownMenuItem
                    className={
                      sortBy === "newest" ? "text-orange-500 font-medium" : ""
                    }
                    onClick={() => setSortBy("newest")}
                  >
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={
                      sortBy === "oldest" ? "text-orange-500 font-medium" : ""
                    }
                    onClick={() => setSortBy("oldest")}
                  >
                    Oldest First
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Tabs for order status */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            <button
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeStatus === "all"
                  ? "border-b-2 border-orange-500 text-orange-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveStatus("all")}
            >
              All Orders
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeStatus === "pending"
                  ? "border-b-2 border-orange-500 text-orange-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveStatus("pending")}
            >
              Processing
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeStatus === "received"
                  ? "border-b-2 border-orange-500 text-orange-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveStatus("received")}
            >
              Delivered
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeStatus === "canceled"
                  ? "border-b-2 border-orange-500 text-orange-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveStatus("canceled")}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* Orders list */}
        {sortedOrders.length > 0 ? (
          <div className="space-y-6">
            {sortedOrders.map((order) => {
              const itemDetails = orderDetails[order._id]?.item;
              if (!itemDetails) return null;

              return (
                <div
                  key={order._id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                >
                  {/* Order header */}
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Order #:</span>{" "}
                        <span className="font-medium">
                          {formatOrderId(order._id)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(order.orderDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleOrderExpand(order._id)}
                      className="text-gray-500 text-sm"
                    >
                      View Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>

                  {/* Order content */}
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      {/* Product image */}
                      <div className="w-20 h-20 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                        <img
                          src={`http://localhost:3000/images/${itemDetails.image}`}
                          alt={itemDetails.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Order details */}
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {itemDetails.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Total:{" "}
                              <span className="font-semibold">
                                Rs.{" "}
                                {(
                                  itemDetails.price *
                                  ((100 - itemDetails.discount) / 100) *
                                  order.qty
                                ).toFixed(2)}
                              </span>
                            </p>
                          </div>

                          {/* Action buttons */}
                          <div className="flex gap-2 mt-2 sm:mt-0">
                            {order.status === "Processing" && (
                              <div className="flex items-center text-blue-700 bg-blue-50 rounded-full px-3 py-1 text-xs font-medium">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                Processing
                              </div>
                            )}
                            {order.status === "Pending" && (
                              <>
                                <div className="flex items-center text-blue-700 bg-blue-50 rounded-full px-3 py-1 text-xs font-medium">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  Processing
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 text-xs text-red-600"
                                  onClick={() => initiateOrderCancel(order)}
                                >
                                  Cancel Order
                                </Button>
                              </>
                            )}
                            <Button
                              className="bg-orange-500 hover:bg-orange-600 text-white h-8 text-xs"
                              onClick={() => navigate(`/item/${order.itemId}`)}
                            >
                              Buy Again
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded order details */}
                  {expandedOrder === order._id && (
                    <div className="bg-gray-50 border-t p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Shipping info */}
                        <div>
                          <h4 className="mb-2 flex items-center">
                            <MapPin className="h-5 w-5 text-orange-500" />
                            <span className="text-lg font-medium ml-1">
                              Shipping Information
                            </span>
                          </h4>
                          <div className="bg-white border rounded-md p-3 text-sm">
                            <p className="font-medium">
                              {order.firstName} {order.lastName || ""}
                            </p>
                            <p className="text-gray-600 mt-1">
                              {order.address}
                            </p>
                            <p className="text-gray-600 mt-1">
                              {order.phone || "No phone provided"}
                            </p>
                          </div>
                        </div>

                        {/* Payment info */}
                        <div>
                          <h4 className="mb-2 flex items-center">
                            <CreditCard className="h-5 w-5 mr-1 text-orange-500" />
                            <span className="text-lg font-medium ml-1">
                              Payment Information
                            </span>
                          </h4>
                          <div className="bg-white border rounded-md p-3 text-sm">
                            <p>
                              <span className="text-gray-600">Method:</span>{" "}
                              {order.paymentMethod || "Credit Card"}
                            </p>
                            <p className="mt-1">
                              <span className="text-gray-600">Total:</span> Rs.{" "}
                              {(
                                itemDetails.price *
                                ((100 - itemDetails.discount) / 100) *
                                order.qty
                              ).toFixed(2)}
                            </p>
                            <p className="mt-1">
                              <span className="text-gray-600">Status:</span>{" "}
                              Paid
                            </p>
                          </div>
                        </div>

                        {/* Tracking info */}
                        <div>
                          <h4 className="mb-2 flex items-center">
                            <Truck className="h-5 w-5 mr-1 text-orange-500" />
                            <span className="text-lg font-medium ml-1">
                              Delivery Information
                            </span>
                          </h4>
                          <div className="bg-white border rounded-md p-3 text-sm">
                            {order.trackingNumber ? (
                              <>
                                <p>
                                  <span className="text-gray-600">
                                    Tracking:
                                  </span>{" "}
                                  {order.trackingNumber}
                                </p>
                                <p className="mt-1">
                                  <span className="text-gray-600">
                                    Delivery Date:
                                  </span>{" "}
                                  {order.receivedDate || "Pending delivery"}
                                </p>
                              </>
                            ) : order.status === "Canceled" ? (
                              <p className="text-red-600">
                                Order was cancelled
                              </p>
                            ) : (
                              <p className="text-gray-600">
                                Tracking information will be available once your
                                order ships
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Order items */}
                      <div className="mt-6">
                        <h4 className="mb-3 flex items-center">
                          <Package className="h-5 w-5 mr-1 text-orange-500" />
                          <span className="text-lg font-medium ml-1">
                            Order Items
                          </span>
                        </h4>
                        <div className="bg-white border rounded-md overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                              <tr>
                                <th className="text-left py-2 px-4">Product</th>
                                <th className="text-center py-2 px-4">
                                  Quantity
                                </th>
                                <th className="text-right py-2 px-4">Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b last:border-b-0">
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    <div className="w-12 h-12 mr-3 flex-shrink-0">
                                      <img
                                        src={`http://localhost:3000/images/${itemDetails.image}`}
                                        alt={itemDetails.name}
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {itemDetails.name}
                                      </p>
                                      <Button
                                        variant="link"
                                        size="sm"
                                        className="h-auto p-0 text-orange-500"
                                        onClick={() =>
                                          navigate(`/item/${order.itemId}`)
                                        }
                                      >
                                        View Product
                                      </Button>
                                    </div>
                                  </div>
                                </td>
                                <td className="text-center py-3 px-4">
                                  {order.qty}
                                </td>
                                <td className="text-right py-3 px-4 font-medium">
                                  Rs.{" "}
                                  {(
                                    itemDetails.price *
                                    ((100 - itemDetails.discount) / 100)
                                  ).toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                            <tfoot className="bg-gray-50 border-t">
                              <tr>
                                <td
                                  colSpan={2}
                                  className="text-right py-3 px-4 font-medium"
                                >
                                  Total:
                                </td>
                                <td className="text-right py-3 px-4 font-semibold">
                                  Rs.{" "}
                                  {(
                                    itemDetails.price *
                                    ((100 - itemDetails.discount) / 100) *
                                    order.qty
                                  ).toFixed(2)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-6 flex justify-end gap-3">
                        <Button variant="outline" size="sm">
                          Need Help?
                        </Button>
                        {order.status !== "Canceled" && (
                          <Button
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                            size="sm"
                          >
                            Download Invoice
                          </Button>
                        )}
                        {order.status === "Pending" && (
                          <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            size="sm"
                            onClick={() => initiateOrderConfirm(order)}
                          >
                            Confirm Order
                          </Button>
                        )}
                        {order.status === "Received" && !order.review && (
                          <Button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white"
                            size="sm"
                            onClick={() => setExpandedOrder(null)}
                          >
                            Review Item
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <Package className="h-16 w-16 mx-auto text-gray-300" />
            <h3 className="mt-4 text-lg font-medium">No orders found</h3>
            <p className="mt-1 text-gray-500">
              {searchQuery
                ? "No orders match your search criteria"
                : "You haven't placed any orders yet"}
            </p>
            <Button
              className="mt-6 bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => navigate("/shop")}
            >
              Start Shopping
            </Button>
          </div>
        )}
      </div>

      {/* Order cancellation dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center text-xl">
              Cancel Order
            </DialogTitle>
            <DialogDescription className="text-center">
              {orderToCancel && (
                <>
                  Are you sure you want to cancel order{" "}
                  <span className="font-medium">
                    #{formatOrderId(orderToCancel._id)}
                  </span>
                  ?<p className="mt-1 text-sm">This action cannot be undone.</p>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              No, Keep Order
            </Button>
            <Button
              onClick={cancelOrder}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, Cancel Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Form Modal */}
      {sortedOrders.some(
        (order) =>
          order.status === "Received" &&
          !order.review &&
          expandedOrder === order._id
      ) && (
        <ReviewForm
          order={sortedOrders.find(
            (order) =>
              order.status === "Received" &&
              !order.review &&
              expandedOrder === order._id
          )}
          setReviewFormOpened={() => setExpandedOrder(null)}
        />
      )}

      {/* Confirm Order Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-2">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl">
              Confirm Order
            </DialogTitle>
            <DialogDescription className="text-center">
              {orderToConfirm && (
                <>
                  Are you sure you've received your order{" "}
                  <span className="font-medium">
                    #{formatOrderId(orderToConfirm._id)}
                  </span>
                  ?
                  <p className="mt-1 text-sm">
                    Confirming will mark this order as received and allow you to
                    leave a review.
                  </p>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {orderToConfirm && orderDetails[orderToConfirm._id]?.item && (
            <div className="p-4 bg-gray-50 rounded-md mx-4 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                  <img
                    src={`http://localhost:3000/images/${
                      orderDetails[orderToConfirm._id].item.image
                    }`}
                    alt={orderDetails[orderToConfirm._id].item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm line-clamp-1">
                    {orderDetails[orderToConfirm._id].item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Quantity: {orderToConfirm.qty}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-center gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              No, Keep Order
            </Button>
            <Button
              onClick={confirmOrder}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Yes, Confirm Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
