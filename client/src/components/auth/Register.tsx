import { FormEvent, useState, useRef, ChangeEvent } from "react";
import { toast } from "sonner";
import { api } from "../../api/api";
import TermsAndConditions from "../../pages/TermsAndConditions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Button from "../Button";
import Input from "./Input";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, UserPlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/error-message";

export default function Register() {
  // Shared fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Seller specific fields
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [storeImage, setStoreImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isTermsOpen, setTermsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [componentLoading, setComponentLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setStoreImage(e.target.files[0]);
    }
  };

  const handleBuyerSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("user/register", {
        firstName,
        lastName,
        email,
        password,
      });

      if (res.status === 201) {
        toast.success("Account created successfully!", {
          position: "top-center",
          description:
            "Verification link sent to your email address. Please verify your email address.",
          duration: 5000,
        });
        setTermsOpen(true);
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSellerSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !businessName ||
      !businessAddress ||
      !phoneNumber
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    if (!storeImage) {
      toast.warning("Please upload a store image");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("user/register", {
        firstName,
        lastName,
        email,
        password,
      });

      if (res.status === 201) {
        // Create store
        const fData = new FormData();
        fData.append("name", businessName);
        fData.append("address", businessAddress);
        fData.append("email", email);
        fData.append("phone", phoneNumber);
        fData.append("userId", res.data.data.user._id);
        fData.append("image", storeImage);

        await api.post("store", fData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Account created successfully!", {
          position: "top-center",
          description:
            "Verification link sent to your email address. Please verify your email address.",
          duration: 5000,
        });
        setTermsOpen(true);
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (componentLoading) {
    return (
      <div className="w-full max-w-md mx-auto my-4">
        <div className="w-full bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden flex flex-col p-6">
          <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-4 w-2/3 mx-auto mb-8" />

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return isTermsOpen ? (
    <TermsAndConditions
      setLogin={() => navigate("/login")}
      setTermOpen={setTermsOpen}
    />
  ) : (
    <div className="w-full max-w-md mx-auto my-4">
      <div className="w-full bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden flex flex-col">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Create an account
          </h2>
          <p className="text-center text-gray-600 mt-2 mb-6">
            Choose your account type to get started
          </p>

          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} />
            </div>
          )}

          <Tabs defaultValue="buyer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-0">
              <TabsTrigger value="buyer">Buyer</TabsTrigger>
              <TabsTrigger value="seller">Seller</TabsTrigger>
            </TabsList>

            <div className="overflow-y-auto max-h-[50vh] py-4">
              {/* Buyer Registration Form */}
              <TabsContent value="buyer" className="mt-0">
                <form onSubmit={handleBuyerSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        htmlFor="firstName"
                        label="First Name"
                        type="text"
                        placeholder="John"
                        value={firstName}
                        setValue={setFirstName}
                      />
                    </div>
                    <div>
                      <Input
                        htmlFor="lastName"
                        label="Last Name"
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        setValue={setLastName}
                      />
                    </div>
                  </div>

                  <Input
                    htmlFor="email"
                    label="Email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    setValue={setEmail}
                  />

                  <Input
                    htmlFor="password"
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    setValue={setPassword}
                  />

                  <Input
                    htmlFor="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    setValue={setConfirmPassword}
                  />

                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={() => setTermsAccepted(!termsAccepted)}
                      className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm leading-none text-gray-600"
                    >
                      I agree to the{" "}
                      <Link
                        to="#"
                        className="text-orange-500 hover:text-orange-700"
                      >
                        terms and conditions
                      </Link>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-md mt-4 flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Creating account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Seller Registration Form */}
              <TabsContent value="seller" className="mt-0">
                <form onSubmit={handleSellerSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        htmlFor="sellerFirstName"
                        label="First Name"
                        type="text"
                        placeholder="John"
                        value={firstName}
                        setValue={setFirstName}
                      />
                    </div>
                    <div>
                      <Input
                        htmlFor="sellerLastName"
                        label="Last Name"
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        setValue={setLastName}
                      />
                    </div>
                  </div>

                  <Input
                    htmlFor="sellerEmail"
                    label="Email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    setValue={setEmail}
                  />

                  <Input
                    htmlFor="businessName"
                    label="Business Name"
                    type="text"
                    placeholder="Your business name"
                    value={businessName}
                    setValue={setBusinessName}
                  />

                  <Input
                    htmlFor="businessAddress"
                    label="Business Address"
                    type="text"
                    placeholder="Your business address"
                    value={businessAddress}
                    setValue={setBusinessAddress}
                  />

                  <Input
                    htmlFor="phoneNumber"
                    label="Phone Number"
                    type="text"
                    placeholder="Your phone number"
                    value={phoneNumber}
                    setValue={setPhoneNumber}
                  />

                  <div className="space-y-1">
                    <label
                      htmlFor="storeImage"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Store Image
                    </label>
                    <div className="flex items-center mt-1">
                      <input
                        type="file"
                        id="storeImage"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-200"
                      >
                        Choose file
                      </button>
                      <span className="ml-3 text-sm text-gray-600">
                        {storeImage ? storeImage.name : "No file chosen"}
                      </span>
                    </div>
                  </div>

                  <Input
                    htmlFor="sellerPassword"
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    setValue={setPassword}
                  />

                  <Input
                    htmlFor="sellerConfirmPassword"
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    setValue={setConfirmPassword}
                  />

                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      id="sellerTerms"
                      checked={termsAccepted}
                      onChange={() => setTermsAccepted(!termsAccepted)}
                      className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <label
                      htmlFor="sellerTerms"
                      className="text-sm leading-none text-gray-600"
                    >
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-orange-500 hover:underline"
                      >
                        terms and conditions
                      </Link>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-md mt-4 flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Creating account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Register as Seller
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="border-t border-gray-100 p-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-500 hover:text-orange-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
