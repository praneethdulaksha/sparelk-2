import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { api } from "../api/api";
import { cartActions } from "../reducers/cartSlice";
import OrderItem from "../components/order/OrderItem";
import CreditCardForm from "../components/order/CreditCardForm";
import AddressForm from "../components/order/AddressForm";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  CircleCheckBig,
  CheckCircle,
  AlertTriangle,
  ShoppingBag,
  RefreshCcw,
} from "lucide-react";
import { userActions } from "../reducers/userSlice";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/error-message";
import { OrderSkeleton } from "@/components/skeletons";

function PlaceOrder() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams();

  const [orderItems, setOrderItems] = useState<any>([]);
  const [isAddressFormOpened, setAddressForm] = useState(false);
  const [isCreditCardFormOpened, setCreditCardForm] = useState(false);
  const [total, setTotal] = useState(0);
  const [activeStep, setActiveStep] = useState("shipping");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] = useState<{
    type: "standard" | "express";
    fee: number;
    label: string;
  }>({
    type: "standard",
    fee: 100,
    label: "Standard Delivery",
  });

  // Form control states
  const [addressInput, setAddressInput] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [shippingErrors, setShippingErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    address: false,
  });
  const [paymentErrors, setPaymentErrors] = useState({
    cardNumber: false,
    expiryDate: false,
    cvv: false,
    nameOnCard: false,
  });
  const [nameOnCard, setNameOnCard] = useState("");

  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const user = useSelector((state: RootState) => state.user.user);
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");

      if (user.address) {
        setAddressInput(
          `${user.address.no}, ${user.address.street}, ${user.address.city}`
        );
      }

      if (user.creditCard) {
        setCardDetails({
          number: user.creditCard.number || "",
          expiryMonth: user.creditCard.expiryMonth || "",
          expiryYear: user.creditCard.expiryYear || "",
          cvv: user.creditCard.cvv || "",
        });
        setNameOnCard(`${user.firstName} ${user.lastName}`);
      }
    }
  }, [user]);

  useEffect(() => {
    getOrderItems();
  }, []);

  function getOrderItems() {
    setLoading(true);
    setError(null);

    try {
      if (location.pathname.split("/")[1] === "item") {
        setOrderItems([{ itemId: params.itemId, qty: params.qty }]);
        // Fetch and calculate total immediately
        if (params.itemId) {
          fetchItemDetails(params.itemId, parseInt(params.qty || "1"));
        }
      } else if (location.pathname.split("/")[1] === "cart") {
        setOrderItems(cartItems);
        // Calculate total from cart items immediately
        if (cartItems && cartItems.length > 0) {
          let initialTotal = 0;
          Promise.all(
            cartItems.map((item) =>
              fetchItemDetails(item.itemId, item.qty, initialTotal)
            )
          )
            .then(() => {
              setLoading(false);
            })
            .catch((err) => {
              console.error("Error fetching item details:", err);
              setError("Failed to load order items");
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Error setting up order:", err);
      setError("Failed to setup order");
      setLoading(false);
    }
  }

  function fetchItemDetails(
    itemId: string,
    quantity: number,
    runningTotal = 0
  ) {
    return api
      .get("item/" + itemId)
      .then((result) => {
        const item = result.data.data;
        const price = item.price * ((100 - item.discount) / 100) * quantity;
        setOrderItemTotal(itemId, price);
        setTotal((prevTotal) => prevTotal + price);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to load item details");
        setLoading(false);
      });
  }

  function setOrderItemTotal(itemId: string, price: number) {
    setOrderItems((orderItems: any) =>
      orderItems.map((item: any) => {
        if (item.itemId === itemId) {
          return { ...item, total: price };
        } else {
          return item;
        }
      })
    );
  }

  function validateShippingForm() {
    const errors = {
      firstName: firstName.trim() === "",
      lastName: lastName.trim() === "",
      email: email.trim() === "" || !email.includes("@"),
      address: addressInput.trim() === "",
    };

    setShippingErrors(errors);
    return !Object.values(errors).some((error) => error);
  }

  function validatePaymentForm() {
    const errors = {
      cardNumber: cardDetails.number.length < 15,
      expiryDate:
        cardDetails.expiryMonth.length < 1 || cardDetails.expiryYear.length < 2,
      cvv: cardDetails.cvv.length < 3,
      nameOnCard: nameOnCard.trim() === "",
    };

    setPaymentErrors(errors);
    return !Object.values(errors).some((error) => error);
  }

  function handleContinueToPayment() {
    if (validateShippingForm()) {
      // Save address to user object
      if (user) {
        const addressParts = addressInput.split(",").map((part) => part.trim());
        const newAddress = {
          no: addressParts[0] || "",
          street: addressParts[1] || "",
          city: addressParts[2] || "",
        };

        const updatedUser = {
          ...user,
          firstName,
          lastName,
          email,
          address: newAddress,
        };

        dispatch(userActions.setUser(updatedUser));

        // Optionally save to backend
        api
          .put("user/" + user._id, { ...updatedUser, cart: null, store: null })
          .catch((err) => console.log(err));
      }

      setActiveStep("payment");
    }
  }

  function handleContinueToReview() {
    if (validatePaymentForm()) {
      // Save card details to user object
      if (user) {
        const updatedUser = {
          ...user,
          creditCard: cardDetails,
        };

        dispatch(userActions.setUser(updatedUser));

        // Optionally save to backend
        api
          .put("user/" + user._id, { ...updatedUser, cart: null, store: null })
          .catch((err) => console.log(err));
      }

      setActiveStep("review");
    }
  }

  function canNavigateToStep(step: "shipping" | "payment" | "review") {
    // If we're already in review step, allow free navigation
    if (activeStep === "review") {
      return true;
    }

    // Normal flow (before completing all steps)
    if (step === "shipping") {
      // Can always go back to shipping
      return true;
    } else if (step === "payment") {
      // Can go to payment if shipping is completed
      return true;
    } else if (step === "review") {
      // Can go to review if payment is completed
      return true;
    }
    return false;
  }

  function handleStepChange(step: "shipping" | "payment" | "review") {
    if (canNavigateToStep(step)) {
      setActiveStep(step);
    }
  }

  function initiateOrderPlacement() {
    if (!addressInput.trim() || !cardDetails.number) {
      toast.error("Please fill the address and credit card details", {
        position: "bottom-right",
      });
      return;
    }

    setConfirmDialogOpen(true);
  }

  function saveOrder() {
    // Close the dialog
    setConfirmDialogOpen(false);

    // Update user's credit card details if changed
    if (
      user &&
      (cardDetails.number !== user.creditCard?.number ||
        cardDetails.expiryMonth !== user.creditCard?.expiryMonth ||
        cardDetails.expiryYear !== user.creditCard?.expiryYear ||
        cardDetails.cvv !== user.creditCard?.cvv)
    ) {
      const updatedUser = { ...user, creditCard: cardDetails };
      dispatch(userActions.setUser(updatedUser));
      // Save to backend
      api
        .put("user/" + user._id, { ...updatedUser, cart: null, store: null })
        .catch((err) => console.log(err));
    }

    api
      .post(
        "order/" +
          (location.pathname.split("/")[1] === "cart" ? "cart" : "item"),
        {
          userId: user?._id,
          orderItems: orderItems,
        }
      )
      .then((result) => {
        console.log(result.data.data);

        // Show success toast
        toast.success("Your order has been placed successfully", {
          position: "bottom-right",
          duration: 3000,
          action: {
            label: "View Orders",
            onClick: () => navigate("/profile/my-orders"),
          },
        });

        if (location.pathname.split("/")[1] === "cart")
          dispatch(cartActions.clearCart());

        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to place your order. Please try again.", {
          position: "bottom-right",
        });
      });
  }

  const handleShippingMethodChange = (method: "standard" | "express") => {
    if (method === "standard") {
      setShippingMethod({
        type: "standard",
        fee: 100,
        label: "Standard Delivery",
      });
    } else {
      setShippingMethod({
        type: "express",
        fee: 350,
        label: "Express Delivery",
      });
    }
  };

  const subtotal = total;
  const orderTotal = subtotal + shippingMethod.fee;

  // If loading
  if (loading) {
    return <OrderSkeleton />;
  }

  // If error
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container py-12 mx-auto">
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
      </div>
    );
  }

  if (!user) return <></>;

  return (
    <div className="bg-gray-50 min-h-svh w-full pb-10">
      <div className="container py-12 mx-auto">
        <h1 className="text-2xl font-bold mb-7 flex items-center">
          <CircleCheckBig className="mr-2 h-8 w-8 text-orange-500" />
          <span>Checkout</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Steps */}
          <div className="lg:col-span-2">
            {/* Tabs navigation */}
            <div className="mb-8 p-1 bg-gray-100 rounded-md">
              <div className="grid grid-cols-3 rounded-md overflow-hidden">
                <button
                  onClick={() => setActiveStep("shipping")}
                  className={`py-2 text-base text-center font-semibold ${
                    activeStep === "shipping"
                      ? "bg-orange-500 text-white rounded"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  1. Shipping
                </button>
                <button
                  onClick={() => setActiveStep("payment")}
                  className={`py-2 text-base text-center font-semibold ${
                    activeStep === "payment"
                      ? "bg-orange-500 text-white rounded"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  2. Payment
                </button>
                <button
                  onClick={() => setActiveStep("review")}
                  className={`py-2 text-base text-center font-semibold ${
                    activeStep === "review"
                      ? "bg-orange-500 text-white rounded"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  3. Review
                </button>
              </div>
            </div>

            {/* Shipping Step Content */}
            {activeStep === "shipping" && (
              <div className="space-y-6">
                <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                  <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                    <h2 className="text-lg font-semibold">
                      Shipping Information
                    </h2>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-semibold text-gray-800"
                        >
                          First Name
                        </label>
                        <input
                          id="firstName"
                          className={`w-full rounded-md border ${
                            shippingErrors.firstName
                              ? "border-red-500"
                              : "border-gray-300"
                          } px-3 py-2 focus:outline-none focus:border-none focus:ring-2 focus:ring-orange-500`}
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                        {shippingErrors.firstName && (
                          <p className="text-red-500 text-xs mt-1">
                            First name is required
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-semibold text-gray-800"
                        >
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          className={`w-full rounded-md border ${
                            shippingErrors.lastName
                              ? "border-red-500"
                              : "border-gray-300"
                          } px-3 py-2 focus:outline-none focus:border-none focus:ring-2 focus:ring-orange-500`}
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                        {shippingErrors.lastName && (
                          <p className="text-red-500 text-xs mt-1">
                            Last name is required
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-800"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className={`w-full rounded-md border ${
                          shippingErrors.email
                            ? "border-red-500"
                            : "border-gray-300"
                        } px-3 py-2 focus:outline-none focus:border-none focus:ring-2 focus:ring-orange-500`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {shippingErrors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          Valid email is required
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="address"
                        className="block text-sm font-semibold text-gray-800"
                      >
                        Complete Address
                      </label>
                      <input
                        id="address"
                        className={`w-full rounded-md border ${
                          shippingErrors.address
                            ? "border-red-500"
                            : "border-gray-300"
                        } px-3 py-2 focus:outline-none focus:border-none focus:ring-2 focus:ring-orange-500`}
                        placeholder="Enter your full address including city & postal code"
                        value={addressInput}
                        onChange={(e) => setAddressInput(e.target.value)}
                      />
                      {shippingErrors.address && (
                        <p className="text-red-500 text-xs mt-1">
                          Address is required
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                  <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                    <h2 className="text-lg font-semibold">Shipping Method</h2>
                  </div>
                  <div className="p-6 space-y-3">
                    <RadioGroup
                      defaultValue="standard"
                      value={shippingMethod.type}
                      onValueChange={(value) =>
                        handleShippingMethodChange(
                          value as "standard" | "express"
                        )
                      }
                      className="space-y-3"
                    >
                      <div
                        className="flex items-center justify-between space-x-2 border p-4 rounded-md cursor-pointer"
                        onClick={() => handleShippingMethodChange("standard")}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="standard"
                            id="standard"
                            className="border-gray-300 data-[state=checked]:text-orange-500 data-[state=checked]:border-orange-500"
                          />
                          <span className="font-medium">Standard Delivery</span>
                        </div>
                        <div className="flex items-center">
                          <p className="text-sm text-gray-500 mr-4">
                            3-5 business days
                          </p>
                          <p className="font-medium">Rs. 100</p>
                        </div>
                      </div>
                      <div
                        className="flex items-center justify-between space-x-2 border p-4 rounded-md cursor-pointer"
                        onClick={() => handleShippingMethodChange("express")}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="express"
                            id="express"
                            className="border-gray-300 data-[state=checked]:text-orange-500 data-[state=checked]:border-orange-500"
                          />
                          <span className="font-medium">Express Delivery</span>
                        </div>
                        <div className="flex items-center">
                          <p className="text-sm text-gray-500 mr-4">
                            1-2 business days
                          </p>
                          <p className="font-medium">Rs. 350</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-semibold"
                    onClick={handleContinueToPayment}
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Payment Step Content */}
            {activeStep === "payment" && (
              <div className="space-y-6">
                <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                  <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                    <h2 className="text-lg font-semibold">Payment Method</h2>
                  </div>
                  <div className="p-6 space-y-3 mb-5">
                    <RadioGroup defaultValue="card" className="space-y-3 mb-6">
                      <div className="flex items-center space-x-2 border p-4 rounded-md">
                        <RadioGroupItem
                          value="card"
                          id="card"
                          className="border-gray-300 data-[state=checked]:text-orange-500 data-[state=checked]:border-orange-500"
                        />
                        <label
                          htmlFor="card"
                          className="font-medium flex items-center gap-2"
                        >
                          <CreditCard className="ml-2 w-4 h-4" />
                          <span>Credit/Debit Card</span>
                        </label>
                      </div>
                    </RadioGroup>

                    <div className="ml-6 space-y-6 p-4 border rounded-md">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          Card Number
                        </label>
                        <input
                          className={`w-full rounded-md border ${
                            paymentErrors.cardNumber
                              ? "border-red-500"
                              : "border-gray-300"
                          } px-3 py-2 focus:outline-none focus:border-none focus:ring-2 focus:ring-orange-500`}
                          placeholder="1234 5678 9012 3456"
                          maxLength={16}
                          value={cardDetails.number}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || /^\d+$/.test(value)) {
                              setCardDetails({
                                ...cardDetails,
                                number: value,
                              });
                            }
                          }}
                        />
                        {paymentErrors.cardNumber && (
                          <p className="text-red-500 text-xs mt-1">
                            Valid card number is required (at least 15 digits)
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-800">
                            Expiry Date
                          </label>
                          <input
                            className={`w-full rounded-md border ${
                              paymentErrors.expiryDate
                                ? "border-red-500"
                                : "border-gray-300"
                            } px-3 py-2 focus:outline-none focus:border-none focus:ring-2 focus:ring-orange-500`}
                            placeholder="MM/YY"
                            maxLength={5}
                            value={
                              cardDetails.expiryMonth || cardDetails.expiryYear
                                ? `${
                                    cardDetails.expiryMonth
                                  }/${cardDetails.expiryYear.slice(-2)}`
                                : ""
                            }
                            onChange={(e) => {
                              let input = e.target.value;

                              // Remove non-digits
                              let digitsOnly = input.replace(/[^\d]/g, "");

                              // Format display with slash
                              let formattedValue = "";

                              if (digitsOnly.length > 0) {
                                // Get month part (first 1-2 digits)
                                let month = digitsOnly.substring(
                                  0,
                                  Math.min(2, digitsOnly.length)
                                );
                                formattedValue = month;

                                // Add slash and year if we have more than 2 digits
                                if (digitsOnly.length > 2) {
                                  let year = digitsOnly.substring(
                                    2,
                                    Math.min(4, digitsOnly.length)
                                  );
                                  formattedValue = `${month}/${year}`;
                                }
                              }

                              // Update the input's display value
                              e.target.value = formattedValue;

                              // Update our state with the parsed values
                              setCardDetails({
                                ...cardDetails,
                                expiryMonth: digitsOnly.substring(
                                  0,
                                  Math.min(2, digitsOnly.length)
                                ),
                                expiryYear:
                                  digitsOnly.length > 2
                                    ? `20${digitsOnly.substring(2, 4)}`
                                    : "",
                              });
                            }}
                            onKeyDown={(e) => {
                              // Special handling for backspace to make the UX better
                              if (e.key === "Backspace") {
                                const input = e.currentTarget;
                                const value = input.value;

                                // If cursor is right after the slash, move cursor before the slash
                                if (
                                  input.selectionStart === 3 &&
                                  input.selectionEnd === 3
                                ) {
                                  e.preventDefault();
                                  input.setSelectionRange(2, 2);
                                }

                                // If we're clearing the last digit of the month
                                if (value.length === 1) {
                                  setCardDetails({
                                    ...cardDetails,
                                    expiryMonth: "",
                                    expiryYear: "",
                                  });
                                }

                                // If we're clearing the first digit of the year
                                if (
                                  value.length === 4 &&
                                  input.selectionStart === 4
                                ) {
                                  setCardDetails({
                                    ...cardDetails,
                                    expiryYear: "",
                                  });
                                }
                              }
                            }}
                          />
                          {paymentErrors.expiryDate && (
                            <p className="text-red-500 text-xs mt-1">
                              Valid expiry date is required
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-800">
                            CVV
                          </label>
                          <input
                            className={`w-full rounded-md border ${
                              paymentErrors.cvv
                                ? "border-red-500"
                                : "border-gray-300"
                            } px-3 py-2 focus:outline-none focus:border-none focus:ring-2 focus:ring-orange-500`}
                            placeholder="123"
                            maxLength={4}
                            value={cardDetails.cvv}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || /^\d+$/.test(value)) {
                                setCardDetails({
                                  ...cardDetails,
                                  cvv: value,
                                });
                              }
                            }}
                          />
                          {paymentErrors.cvv && (
                            <p className="text-red-500 text-xs mt-1">
                              CVV is required (3-4 digits)
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          Name on Card
                        </label>
                        <input
                          className={`w-full rounded-md border ${
                            paymentErrors.nameOnCard
                              ? "border-red-500"
                              : "border-gray-300"
                          } px-3 py-2 focus:outline-none focus:border-none focus:ring-2 focus:ring-orange-500`}
                          placeholder="John Doe"
                          value={nameOnCard}
                          onChange={(e) => {
                            // Only allow letters and spaces
                            const value = e.target.value;
                            if (value === "" || /^[A-Za-z\s]+$/.test(value)) {
                              setNameOnCard(value);
                            }
                          }}
                        />
                        {paymentErrors.nameOnCard && (
                          <p className="text-red-500 text-xs mt-1">
                            Name on card is required
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    className="hover:bg-slate-100 px-5 py-2.5 rounded-lg font-medium"
                    onClick={() => setActiveStep("shipping")}
                  >
                    Back to Shipping
                  </Button>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-semibold"
                    onClick={handleContinueToReview}
                  >
                    Continue to Review
                  </Button>
                </div>
              </div>
            )}

            {/* Review Step Content */}
            {activeStep === "review" && (
              <div className="space-y-6">
                <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                  <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                    <h2 className="text-lg font-semibold">Review Your Order</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Shipping Information
                        </h3>
                        <address className="not-italic text-sm text-gray-500 mt-1">
                          {firstName} {lastName}
                          <br />
                          {addressInput || "No address provided"}
                          <br />
                          {email}
                        </address>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border border-slate-300 text-sm px-3 rounded-md"
                        onClick={() => setActiveStep("shipping")}
                      >
                        Edit
                      </Button>
                    </div>

                    <hr className="border-gray-200" />

                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Payment Method
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {cardDetails.number
                            ? `Credit Card ending in ${cardDetails.number.substring(
                                cardDetails.number.length - 4
                              )}`
                            : "No payment method provided"}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border border-slate-300 text-sm px-3 rounded-md"
                        onClick={() => setActiveStep("payment")}
                      >
                        Edit
                      </Button>
                    </div>

                    <hr className="border-gray-200" />

                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Shipping Method
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {shippingMethod.label} (Rs. {shippingMethod.fee})
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border border-slate-300 text-sm px-3 rounded-md"
                        onClick={() => setActiveStep("shipping")}
                      >
                        Edit
                      </Button>
                    </div>

                    <hr className="border-gray-200" />

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Order Items
                      </h3>
                      <div className="space-y-1 max-h-100 overflow-y-auto pr-2">
                        {orderItems.map((oItem: any, i: number) => (
                          <OrderItem
                            key={i}
                            oItem={oItem}
                            index={i}
                            setTotal={setTotal}
                            setOrderItemTotal={setOrderItemTotal}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    className="border border-slate-300 hover:bg-slate-100 px-5 py-2.5 rounded-lg"
                    onClick={() => setActiveStep("payment")}
                  >
                    Back to Payment
                  </Button>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-semibold"
                    onClick={initiateOrderPlacement}
                  >
                    Place Order
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border bg-white shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order Total</span>
                  <span>
                    Rs. {parseFloat(total.toFixed(2)).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span>Rs. {shippingMethod.fee.toLocaleString()}</span>
                </div>

                <hr className="border-gray-200" />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-orange-500">
                    Rs. {orderTotal.toLocaleString()}
                  </span>
                </div>

                <div className="pt-4">
                  <div className="bg-gray-50 p-3 rounded-md text-sm flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-0.5 text-gray-500"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <p className="text-gray-500">
                      By placing your order, you agree to our{" "}
                      <Link to="#" className="text-orange-500 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="#" className="text-orange-500 hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                    <span>Free shipping on orders over Rs. 30,000</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>Delivery available to all major cities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 mb-2">
              <ShoppingBag className="h-6 w-6 text-orange-600" />
            </div>
            <DialogTitle className="text-center text-xl">
              Confirm Order
            </DialogTitle>
            <DialogDescription className="text-center">
              You're about to place an order for {orderItems.length} item
              {orderItems.length > 1 ? "s" : ""}.
              <p className="mt-1 text-sm">
                Please review your order details before confirming.
              </p>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Subtotal:</span>
                <span>Rs. {parseFloat(total.toFixed(2)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Shipping:</span>
                <span>Rs. {shippingMethod.fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium border-t border-gray-200 pt-2 mt-2">
                <span>Total:</span>
                <span className="text-orange-600">
                  Rs. {orderTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              By confirming, you agree to pay the total amount of Rs.{" "}
              {orderTotal.toLocaleString()}
            </div>
          </div>

          <DialogFooter className="sm:justify-center gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={saveOrder}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Confirm Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PlaceOrder;
