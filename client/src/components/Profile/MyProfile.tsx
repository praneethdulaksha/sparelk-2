import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { RootState } from "../../store/store";
import { api } from "../../api/api";
import { userActions } from "../../reducers/userSlice";
import { TAddress, TCreditCard, TUser } from "../../types";
import { toast } from "sonner";
import {
  User,
  Mail,
  MapPin,
  CreditCard,
  Edit,
  LogOut,
  Eye,
  EyeOff,
  ShoppingBag,
  Store,
  CheckCircle,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LogoutDialog from "@/components/LogoutDialog";
import { Skeleton } from "@/components/ui/skeleton";

// Profile skeleton component
function MyProfileSkeleton() {
  return (
    <div className="w-screen min-h-screen bg-gray-50 py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-28 mt-4 md:mt-0" />
          </div>

          {/* Tabs skeleton */}
          <div className="flex border-b mb-6">
            <Skeleton className="h-10 w-36 mx-2" />
            <Skeleton className="h-10 w-32 mx-2" />
            <Skeleton className="h-10 w-28 mx-2" />
          </div>
        </div>

        {/* Content skeleton - Personal Info */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="px-6">
              <div className="flex justify-between items-center p-6 border-b">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-8 w-20" />
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <div className="flex items-center mb-2">
                        <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function MyProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Add loading state back
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.user.user);

  // Move hooks to the top before any conditional returns
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Form states
  const [tempUser, setTempUser] = useState<TUser | null>(null);
  const [validations, setValidations] = useState({
    firstName: true,
    lastName: true,
    email: true,
    password: true,
  });

  // Address form states
  const [isAddressFormOpened, setAddressFormOpened] = useState(false);

  // Credit card form states
  const [isCreditCardFormOpened, setCreditCardFormOpened] = useState(false);

  // Initialize tempUser when user changes
  useEffect(() => {
    if (user) {
      setTempUser(user);
      // Simulate a slight delay for loading
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Show loading skeleton while fetching user data
  if (loading) {
    return <MyProfileSkeleton />;
  }

  // If no user available, show nothing
  if (!user || !tempUser) return <></>;

  // Begin editing user info
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Save updated user info
  const saveUser = () => {
    if (
      validations.firstName &&
      validations.lastName &&
      validations.email &&
      validations.password
    ) {
      api
        .put("user/" + user?._id, tempUser)
        .then((response) => {
          dispatch(userActions.updateUser(tempUser));
          toast.success("User Profile Updated", {
            position: "bottom-right",
            style: {
              backgroundColor: "rgb(255 247 237)", // orange-50
              border: "1px solid rgb(249 115 22)", // orange-500
              color: "rgb(194 65 12)", // orange-700 for text,
            },
            icon: <CheckCircle className="h-5 w-5 text-orange-500" />,
          });
          setIsEditing(false);
        })
        .catch((err) => console.log(err));
    } else {
      Swal.fire({
        icon: "error",
        title: "Please fill in all fields correctly",
      });
    }
  };

  // Cancel editing and reset form
  const handleCancelEdit = () => {
    setTempUser(user);
    setValidations({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
    });
    setIsEditing(false);
  };

  function removeCreditCard() {
    if (!tempUser) return;
    setTempUser({ ...tempUser, creditCard: null });
    saveUser();
  }

  function removeAddress() {
    if (!tempUser) return;
    setTempUser({ ...tempUser, address: null });
    saveUser();
  }

  function setAddress(address: TAddress | null) {
    if (!tempUser) return;
    setTempUser({ ...tempUser, address: address });
    setAddressFormOpened(false);
    saveUser();
  }

  function setCreditCard(creditCard: TCreditCard | null) {
    if (!tempUser) return;
    setTempUser({ ...tempUser, creditCard: creditCard });
    setCreditCardFormOpened(false);
    saveUser();
  }

  const checkValidations = (field: string, text: string) => {
    if (field === "firstName") {
      !/^[^0-9]*[a-zA-Z]{2,}[^0-9]*$/.test(text)
        ? setValidations({ ...validations, firstName: false })
        : setValidations({ ...validations, firstName: true });
    } else if (field === "lastName") {
      !/^[^0-9]*[a-zA-Z]{2,}[^0-9]*$/.test(text)
        ? setValidations({ ...validations, lastName: false })
        : setValidations({ ...validations, lastName: true });
    } else if (field === "email") {
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        text
      )
        ? setValidations({ ...validations, email: false })
        : setValidations({ ...validations, email: true });
    } else if (field === "password") {
      !/^.{6,}$/.test(text)
        ? setValidations({ ...validations, password: false })
        : setValidations({ ...validations, password: true });
    }
  };

  const logoutAlert = () => {
    setLogoutDialogOpen(true);
  };

  const navigateToOrders = () => {
    navigate("/profile/my-orders");
  };

  const navigateToBecomeSeller = () => {
    navigate("/profile/seller-form");
  };

  return (
    <div className="w-screen min-h-screen bg-gray-50 py-12 px-4 sm:px-6 md:px-8">
      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      />
      <div className="max-w-7xl mx-auto">
        {/* Page header with navigation options */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-gray-500 mt-1">
                Manage your personal information and preferences
              </p>
            </div>

            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Button
                variant="outline"
                className="flex items-center gap-2 text-orange-500 border-orange-400 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all ease-in-out duration-200"
                onClick={logoutAlert}
              >
                <LogOut className="h-4 w-4" /> Log Out
              </Button>
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="flex border-b">
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "personal"
                  ? "border-b-2 border-orange-500 text-orange-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("personal")}
            >
              Personal Information
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "address"
                  ? "border-b-2 border-orange-500 text-orange-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("address")}
            >
              Delivery Address
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "payment"
                  ? "border-b-2 border-orange-500 text-orange-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("payment")}
            >
              Payment Method
            </button>
          </div>
        </div>

        {/* Personal Information Tab */}
        {activeTab === "personal" && (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="px-6">
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className="text-xl font-semibold">
                    Personal Information
                  </h2>
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditClick}
                      className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                    >
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                  )}
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <User className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="text-sm font-medium text-slate-500">
                          First Name
                        </span>
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempUser.firstName}
                          onChange={(e) => {
                            setTempUser({
                              ...tempUser,
                              firstName: e.target.value,
                            });
                            checkValidations("firstName", e.target.value);
                          }}
                          className={`w-full p-2 border rounded-md ${
                            validations.firstName ? "" : "border-red-500"
                          }`}
                        />
                      ) : (
                        <p className="font-medium">{tempUser.firstName}</p>
                      )}
                      {isEditing && !validations.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                          First name must contain at least 2 letters and no
                          numbers
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        <User className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="text-sm font-medium text-slate-500">
                          Last Name
                        </span>
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempUser.lastName}
                          onChange={(e) => {
                            setTempUser({
                              ...tempUser,
                              lastName: e.target.value,
                            });
                            checkValidations("lastName", e.target.value);
                          }}
                          className={`w-full p-2 border rounded-md ${
                            validations.lastName ? "" : "border-red-500"
                          }`}
                        />
                      ) : (
                        <p className="font-medium">{tempUser.lastName}</p>
                      )}
                      {isEditing && !validations.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                          Last name must contain at least 2 letters and no
                          numbers
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        <Mail className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="text-sm font-medium text-slate-500">
                          Email
                        </span>
                      </div>
                      {isEditing ? (
                        <input
                          type="email"
                          value={tempUser.email}
                          onChange={(e) => {
                            setTempUser({ ...tempUser, email: e.target.value });
                            checkValidations("email", e.target.value);
                          }}
                          className={`w-full p-2 border rounded-md ${
                            validations.email ? "" : "border-red-500"
                          }`}
                        />
                      ) : (
                        <p className="font-medium">{tempUser.email}</p>
                      )}
                      {isEditing && !validations.email && (
                        <p className="text-red-500 text-xs mt-1">
                          Please enter a valid email address
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        <User className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="text-sm font-medium text-slate-500">
                          Password
                        </span>
                      </div>
                      {isEditing ? (
                        <div className="relative">
                          <input
                            type={isPasswordVisible ? "text" : "password"}
                            value={tempUser.password}
                            onChange={(e) => {
                              setTempUser({
                                ...tempUser,
                                password: e.target.value,
                              });
                              checkValidations("password", e.target.value);
                            }}
                            className={`w-full p-2 border rounded-md ${
                              validations.password ? "" : "border-red-500"
                            }`}
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                            onClick={() =>
                              setPasswordVisible(!isPasswordVisible)
                            }
                          >
                            {isPasswordVisible ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <p className="font-medium">••••••••</p>
                      )}
                      {isEditing && !validations.password && (
                        <p className="text-red-500 text-xs mt-1">
                          Password must be at least 6 characters
                        </p>
                      )}
                    </div>
                  </div>
                  {isEditing && (
                    <div className="mt-6 flex justify-end gap-3">
                      <Button variant="outline" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                      <Button
                        className="bg-orange-500 hover:bg-orange-600"
                        onClick={saveUser}
                      >
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Address Tab */}
        {activeTab === "address" && (
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Delivery Address</h2>
              </div>

              {isAddressFormOpened && (
                <AddressForm
                  currentAdd={
                    tempUser.address || { no: "", street: "", city: "" }
                  }
                  setAddress={setAddress}
                  setAddressForm={setAddressFormOpened}
                />
              )}

              {tempUser.address && !isAddressFormOpened ? (
                <div className="border rounded-lg p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="font-medium text-lg">{`${tempUser.firstName} ${tempUser.lastName}`}</h3>
                        <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Default
                        </span>
                      </div>
                      <p className="text-gray-600">
                        {tempUser.address.no}
                        {", "}
                        {tempUser.address.street}
                        {", "}
                        {tempUser.address.city}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAddressFormOpened(true)}
                        className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeAddress}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
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
                          className="lucide lucide-trash-2"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" x2="10" y1="11" y2="17" />
                          <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : !isAddressFormOpened ? (
                <div className="border rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No address yet</h3>
                  <p className="text-gray-500 mb-6">
                    Add a delivery address to speed up your checkout process
                  </p>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => setAddressFormOpened(true)}
                  >
                    <MapPin className="h-4 w-4" />{" "}
                    <span className="ml-2">Add Address</span>
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}

        {/* Payment Methods Tab */}
        {activeTab === "payment" && (
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>

              {isCreditCardFormOpened && (
                <CreditCardForm
                  currentCard={
                    tempUser.creditCard || {
                      number: "",
                      expiryMonth: "",
                      expiryYear: "",
                      cvv: "",
                    }
                  }
                  setCreditCard={setCreditCard}
                  setCreditCardForm={setCreditCardFormOpened}
                />
              )}

              {tempUser.creditCard && !isCreditCardFormOpened ? (
                <div className="border rounded-lg p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CardBrandIcon
                          cardNumber={tempUser.creditCard.number}
                        />
                        <h3 className="font-medium text-lg">
                          {getCardType(tempUser.creditCard.number)}
                        </h3>
                        <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Default
                        </span>
                      </div>
                      <p className="text-gray-600">
                        •••• •••• •••• {tempUser.creditCard.number.slice(-4)}
                      </p>
                      <p className="text-gray-600">
                        Expires: {tempUser.creditCard.expiryMonth}/
                        {tempUser.creditCard.expiryYear.slice(-2)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCreditCardFormOpened(true)}
                        className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeCreditCard}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
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
                          className="lucide lucide-trash-2"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" x2="10" y1="11" y2="17" />
                          <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : !isCreditCardFormOpened ? (
                <div className="border rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-6 w-6 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    No payment method
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Add a payment method for faster checkout
                  </p>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => setCreditCardFormOpened(true)}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span className="ml-2">Add Payment Method</span>
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Card brand detection utility
function getCardType(cardNumber: string): string {
  // Remove spaces and dashes
  const cleanNumber = cardNumber.replace(/[\s-]/g, "");

  // Visa
  if (/^4/.test(cleanNumber)) {
    return "Visa";
  }
  // Mastercard
  else if (/^5[1-5]/.test(cleanNumber)) {
    return "Mastercard";
  }
  // American Express
  else if (/^3[47]/.test(cleanNumber)) {
    return "American Express";
  }
  // Discover
  else if (/^6(?:011|5)/.test(cleanNumber)) {
    return "Discover";
  }
  // Default
  else {
    return "Credit Card";
  }
}

// Card brand icon component
function CardBrandIcon({ cardNumber }: { cardNumber: string }) {
  const cardType = getCardType(cardNumber);

  const iconColor =
    cardType === "Visa"
      ? "text-blue-600"
      : cardType === "Mastercard"
      ? "text-red-500"
      : cardType === "American Express"
      ? "text-blue-400"
      : "text-gray-600";

  return <CreditCard className={`h-5 w-5 ${iconColor}`} />;
}

function AddressForm({ currentAdd, setAddress, setAddressForm }: any) {
  const [address, setNewAddress] = useState(
    currentAdd || {
      no: "",
      street: "",
      city: "",
    }
  );
  const [validations, setValidations] = useState({
    no: true,
    street: true,
    city: true,
  });

  const checkValidations = (field: string, text: string) => {
    if (field === "no") {
      !text
        ? setValidations({ ...validations, no: false })
        : setValidations({ ...validations, no: true });
    } else if (field === "street") {
      !text
        ? setValidations({ ...validations, street: false })
        : setValidations({ ...validations, street: true });
    } else if (field === "city") {
      !text
        ? setValidations({ ...validations, city: false })
        : setValidations({ ...validations, city: true });
    }
  };

  return (
    <div className="mb-8 border rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">
        {currentAdd && currentAdd.no ? "Edit Address" : "Add New Address"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            House/Flat No.
          </label>
          <input
            type="text"
            value={address.no}
            onChange={(e) => {
              setNewAddress({ ...address, no: e.target.value });
              checkValidations("no", e.target.value);
            }}
            className={`w-full p-2 border rounded-md ${
              validations.no ? "" : "border-red-500"
            }`}
            required
          />
          {!validations.no && (
            <p className="text-red-500 text-xs mt-1">
              House/Flat number is required
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Street
          </label>
          <input
            type="text"
            value={address.street}
            onChange={(e) => {
              setNewAddress({ ...address, street: e.target.value });
              checkValidations("street", e.target.value);
            }}
            className={`w-full p-2 border rounded-md ${
              validations.street ? "" : "border-red-500"
            }`}
            required
          />
          {!validations.street && (
            <p className="text-red-500 text-xs mt-1">Street is required</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            City
          </label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => {
              setNewAddress({ ...address, city: e.target.value });
              checkValidations("city", e.target.value);
            }}
            className={`w-full p-2 border rounded-md ${
              validations.city ? "" : "border-red-500"
            }`}
            required
          />
          {!validations.city && (
            <p className="text-red-500 text-xs mt-1">City is required</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          type="button"
          onClick={() => setAddressForm(false)}
        >
          Cancel
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => {
            if (
              validations.no &&
              validations.street &&
              validations.city &&
              address.no &&
              address.street &&
              address.city
            ) {
              setAddress(address);
            } else {
              Swal.fire({
                icon: "error",
                title: "Please fill all the fields",
              });
            }
          }}
        >
          Save Address
        </Button>
      </div>
    </div>
  );
}

function CreditCardForm({
  currentCard,
  setCreditCard,
  setCreditCardForm,
}: any) {
  const [creditCard, setNewCreditCard] = useState(
    currentCard || {
      number: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    }
  );
  const [validations, setValidations] = useState({
    number: true,
    month: true,
    year: true,
    cvv: true,
  });
  const [formattedExpiry, setFormattedExpiry] = useState(
    currentCard && currentCard.expiryMonth
      ? `${currentCard.expiryMonth}/${currentCard.expiryYear.slice(-2)}`
      : ""
  );

  // Card brand detection
  const cardType = getCardType(creditCard.number);

  const checkValidations = (field: string, text: string) => {
    if (field === "number") {
      !/^\d{15,16}$/.test(text)
        ? setValidations({ ...validations, number: false })
        : setValidations({ ...validations, number: true });
    } else if (field === "month") {
      !/^(0[1-9]|1[0-2])$/.test(text)
        ? setValidations({ ...validations, month: false })
        : setValidations({ ...validations, month: true });
    } else if (field === "year") {
      parseInt(text) < 24
        ? setValidations({ ...validations, year: false })
        : setValidations({ ...validations, year: true });
    } else if (field === "cvv") {
      !/^\d{3,4}$/.test(text)
        ? setValidations({ ...validations, cvv: false })
        : setValidations({ ...validations, cvv: true });
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 16) {
      setNewCreditCard({ ...creditCard, number: value });
      checkValidations("number", value);
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    // Remove non-digits
    const digitsOnly = input.replace(/[^\d]/g, "");

    // Format display with slash
    let formatted = "";

    if (digitsOnly.length > 0) {
      // Get month part (first 1-2 digits)
      const month = digitsOnly.substring(0, Math.min(2, digitsOnly.length));
      formatted = month;

      // Add slash and year if we have more than 2 digits
      if (digitsOnly.length > 2) {
        const year = digitsOnly.substring(2, Math.min(4, digitsOnly.length));
        formatted = `${month}/${year}`;
      }
    }

    setFormattedExpiry(formatted);

    // Update credit card state
    if (digitsOnly.length >= 1) {
      const monthValue = digitsOnly.substring(
        0,
        Math.min(2, digitsOnly.length)
      );
      const yearValue =
        digitsOnly.length > 2 ? `20${digitsOnly.substring(2, 4)}` : "";

      setNewCreditCard({
        ...creditCard,
        expiryMonth: monthValue,
        expiryYear: yearValue,
      });

      if (monthValue) checkValidations("month", monthValue);
      if (yearValue) checkValidations("year", yearValue);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setNewCreditCard({ ...creditCard, cvv: value });
      checkValidations("cvv", value);
    }
  };

  return (
    <div className="mb-8 border rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">
        {currentCard && currentCard.number
          ? "Edit Payment Method"
          : "Add New Payment Method"}
      </h3>

      {creditCard.number && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md flex items-center gap-2">
          <CardBrandIcon cardNumber={creditCard.number} />
          <span className="font-medium">{cardType} detected</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Card Number
          </label>
          <input
            type="text"
            value={creditCard.number}
            onChange={handleCardNumberChange}
            placeholder="XXXX XXXX XXXX XXXX"
            maxLength={16}
            className={`w-full p-2 border rounded-md ${
              validations.number ? "" : "border-red-500"
            }`}
            required
          />
          {!validations.number && (
            <p className="text-red-500 text-xs mt-1">
              Valid card number is required (15-16 digits)
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Expiry Date
          </label>
          <input
            type="text"
            value={formattedExpiry}
            onChange={handleExpiryDateChange}
            placeholder="MM/YY"
            maxLength={5}
            className={`w-full p-2 border rounded-md ${
              validations.month && validations.year ? "" : "border-red-500"
            }`}
            required
          />
          {(!validations.month || !validations.year) && (
            <p className="text-red-500 text-xs mt-1">
              Valid expiry date is required (MM/YY)
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            CVV
          </label>
          <input
            type="text"
            value={creditCard.cvv}
            onChange={handleCvvChange}
            placeholder="XXX"
            maxLength={4}
            className={`w-full p-2 border rounded-md ${
              validations.cvv ? "" : "border-red-500"
            }`}
            required
          />
          {!validations.cvv && (
            <p className="text-red-500 text-xs mt-1">
              Valid CVV is required (3-4 digits)
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          type="button"
          onClick={() => setCreditCardForm(false)}
        >
          Cancel
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => {
            if (
              validations.number &&
              validations.month &&
              validations.year &&
              validations.cvv &&
              creditCard.number &&
              creditCard.expiryMonth &&
              creditCard.expiryYear &&
              creditCard.cvv
            ) {
              setCreditCard(creditCard);
            } else {
              Swal.fire({
                icon: "error",
                title: "Please fill all the fields",
              });
            }
          }}
        >
          Save Payment Method
        </Button>
      </div>
    </div>
  );
}
