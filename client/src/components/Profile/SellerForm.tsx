import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import { api } from "@/api/api";
import { userActions } from "@/reducers/userSlice";
import {
  Store,
  User,
  Building,
  FileText,
  UploadCloud,
  AlertCircle,
  Check,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SellerFormSkeleton } from "@/components/skeletons";
import { ErrorMessage } from "@/components/ui/error-message";
import { toast } from "sonner";

export default function SellerForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user.user);
  const [formStep, setFormStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Initialize all form state at the top, before any conditional returns
  const [formData, setFormData] = useState({
    name: user?.store ? user.store.name : "",
    address: user?.store
      ? user.store.address
      : user?.address
      ? `${user.address.no}, ${user.address.street}, ${user.address.city}`
      : "",
    email: user?.store ? user.store.email : user?.email || "",
    phone: user?.store ? user.store.phone : "",
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState<any>(
    user?.store ? "http://localhost:3000/images/" + user.store.image : null
  );

  const [errors, setErrors] = useState({
    name: false,
    address: false,
    email: false,
    phone: false,
    image: false,
  });

  // Simulate loading state for initial user data fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        setLoading(false);

        // Update form data when user data becomes available
        setFormData({
          name: user.store ? user.store.name : "",
          address: user.store
            ? user.store.address
            : user.address
            ? `${user.address.no}, ${user.address.street}, ${user.address.city}`
            : "",
          email: user.store ? user.store.email : user.email,
          phone: user.store ? user.store.phone : "",
          description: "",
          image: null,
        });

        setImagePreview(
          user.store ? "http://localhost:3000/images/" + user.store.image : null
        );
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  const validateCurrentStep = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (formStep === 1) {
      // Validate Personal Information fields
      if (
        !formData.name.trim() ||
        !/^[^0-9]*[a-zA-Z]{2,}[^0-9]*$/.test(formData.name)
      ) {
        newErrors.name = true;
        isValid = false;
      } else {
        newErrors.name = false;
      }

      if (
        !formData.email.trim() ||
        !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
          formData.email
        )
      ) {
        newErrors.email = true;
        isValid = false;
      } else {
        newErrors.email = false;
      }
    }

    if (formStep === 2) {
      // Validate Business Information fields
      if (
        !formData.address.trim() ||
        !/^[^0-9]*[a-zA-Z]{2,}[^0-9]*$/.test(formData.address)
      ) {
        newErrors.address = true;
        isValid = false;
      } else {
        newErrors.address = false;
      }

      if (
        !formData.phone.trim() ||
        !/^\+?[0-9]{1,3}-?[0-9]{3,14}$/.test(formData.phone)
      ) {
        newErrors.phone = true;
        isValid = false;
      } else {
        newErrors.phone = false;
      }
    }

    if (formStep === 3) {
      // Validate Store Setup fields
      if (!formData.image && !imagePreview) {
        newErrors.image = true;
        isValid = false;
      } else {
        newErrors.image = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setFormStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setFormStep((prev) => prev - 1);
  };

  const handleChange = (e: any) => {
    if (e.target.type === "file") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0],
      });

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) return;

    if (!validateCurrentStep()) return;

    setSubmitting(true);

    const fData = new FormData();
    fData.append("name", formData.name);
    fData.append("address", formData.address);
    fData.append("email", formData.email);
    fData.append("phone", formData.phone);
    fData.append("image", formData.image as any);
    fData.append("userId", user._id as string);

    user.store ? updateStore(fData) : createStore(fData);
  };

  function createStore(form: any) {
    if (!user) return;
    api
      .post("store", form)
      .then((d) => {
        dispatch(userActions.setStore(d.data.data));
        setSubmitting(false);
        toast.success("Store Successfully Created", {
          description: "You can now sell items on SpareLK",
        });
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Store Successfully Created, Now you can sell items",
          showConfirmButton: true,
          confirmButtonText: "Sell Item",
          timer: 3000,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/profile/add-item/new");
          }
        });
      })
      .catch((e) => {
        console.log(e);
        setError("Failed to create store. Please try again.");
        setSubmitting(false);
      });
  }

  function updateStore(form: any) {
    if (!user || !user.store) return;
    api
      .put("store/" + user.store._id, form)
      .then((d) => {
        dispatch(userActions.setStore(d.data.data));
        setSubmitting(false);
        toast.success("Store Profile Updated");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Store Profile Successfully Updated",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((er) => {
        console.log(er);
        setError("Failed to update store. Please try again.");
        setSubmitting(false);
      });
  }

  function removeStore() {
    if (!user || !user.store) return;
    Swal.fire({
      title: "Are you sure?",
      text: "Store and Items will be removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Remove Store!",
    }).then((result) => {
      if (result.isConfirmed) {
        setSubmitting(true);
        api
          .delete("store/" + user.store._id)
          .then(() => {
            dispatch(userActions.setStore(null));
            toast.success("Store has been removed");
            setSubmitting(false);
          })
          .catch((er) => {
            console.log(er);
            setError("Failed to remove store. Please try again.");
            setSubmitting(false);
          });

        Swal.fire({
          title: "Removed!",
          text: "Store items has been removed",
          icon: "success",
        });
      }
    });
  }

  // Conditional returns after all hooks
  if (loading) {
    return <SellerFormSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 pt-12 pb-20">
          <div className="max-w-md mx-auto">
            <ErrorMessage message={error} />
            <div className="mt-4 flex justify-center">
              <Button
                onClick={() => setError(null)}
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
    <>
      <div className="w-full min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 pt-12 pb-20">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              {user?.store ? "Update Store Profile" : "Register as a Seller"}
            </h2>
            <p className="text-lg text-gray-600">
              Complete the form below to start your seller journey with SpareLK
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-10">
              <div className="flex justify-between items-center">
                <div
                  className={`flex flex-col items-center flex-1 ${
                    formStep >= 1 ? "text-orange-500" : "text-slate-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-2 ${
                      formStep >= 1
                        ? "bg-orange-500 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    1
                  </div>
                  <span className="text-sm font-medium">Personal Info</span>
                </div>
                <div
                  className={`h-1 flex-1 mx-2 ${
                    formStep >= 2 ? "bg-orange-500" : "bg-slate-200"
                  }`}
                ></div>
                <div
                  className={`flex flex-col items-center flex-1 ${
                    formStep >= 2 ? "text-orange-500" : "text-slate-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-2 ${
                      formStep >= 2
                        ? "bg-orange-500 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-sm font-medium">Business Info</span>
                </div>
                <div
                  className={`h-1 flex-1 mx-2 ${
                    formStep >= 3 ? "bg-orange-500" : "bg-slate-200"
                  }`}
                ></div>
                <div
                  className={`flex flex-col items-center flex-1 ${
                    formStep >= 3 ? "text-orange-500" : "text-slate-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-2 ${
                      formStep >= 3
                        ? "bg-orange-500 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    3
                  </div>
                  <span className="text-sm font-medium">Store Setup</span>
                </div>
                <div
                  className={`h-1 flex-1 mx-2 ${
                    formStep >= 4 ? "bg-orange-500" : "bg-slate-200"
                  }`}
                ></div>
                <div
                  className={`flex flex-col items-center flex-1 ${
                    formStep >= 4 ? "text-orange-500" : "text-slate-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-2 ${
                      formStep >= 4
                        ? "bg-orange-500 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    4
                  </div>
                  <span className="text-sm font-medium">Review</span>
                </div>
              </div>
            </div>
            <div className="bg-white border rounded-lg shadow-sm">
              <div className="p-8">
                <form onSubmit={(e) => e.preventDefault()}>
                  {/* Step 1: Personal Information */}
                  {formStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                          <User className="mr-2 h-5 w-5 text-orange-500" />{" "}
                          Personal Information
                        </h3>
                        <p className="text-slate-500 mb-6">
                          Please provide your contact details. This information
                          will be used for communication purposes.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-slate-700 mb-1"
                          >
                            Store Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md ${
                              errors.name
                                ? "border-red-500"
                                : "border-slate-300"
                            }`}
                            placeholder="Enter your store name"
                          />
                          {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                              Store name is required and must contain at least 2
                              alphabetic characters
                            </p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-slate-700 mb-1"
                          >
                            Email Address{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md ${
                              errors.email
                                ? "border-red-500"
                                : "border-slate-300"
                            }`}
                            placeholder="you@example.com"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                              Please enter a valid email address
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Business Information */}
                  {formStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                          <Building className="mr-2 h-5 w-5 text-orange-500" />{" "}
                          Business Information
                        </h3>
                        <p className="text-slate-500 mb-6">
                          Tell us about your business location and contact
                          details.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label
                            htmlFor="address"
                            className="block text-sm font-medium text-slate-700 mb-1"
                          >
                            Business Address{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md ${
                              errors.address
                                ? "border-red-500"
                                : "border-slate-300"
                            }`}
                            placeholder="Enter your business address"
                          />
                          {errors.address && (
                            <p className="text-red-500 text-sm mt-1">
                              Business address is required and must be valid
                            </p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-slate-700 mb-1"
                          >
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md ${
                              errors.phone
                                ? "border-red-500"
                                : "border-slate-300"
                            }`}
                            placeholder="e.g., +94 77 123 4567"
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">
                              Please enter a valid phone number
                            </p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium text-slate-700 mb-1"
                          >
                            Store Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border border-slate-300 rounded-md"
                            placeholder="Describe your store and what you sell"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Store Setup */}
                  {formStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                          <Store className="mr-2 h-5 w-5 text-orange-500" />{" "}
                          Store Setup
                        </h3>
                        <p className="text-slate-500 mb-6">
                          Set up your store profile with an image. This
                          information will be visible to customers.
                        </p>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Store Cover Image [3:1]{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-slate-300 hover:border-orange-500 transition-colors">
                            <div className="space-y-2 text-center">
                              {imagePreview ? (
                                <div>
                                  <img
                                    src={imagePreview}
                                    alt="Store logo preview"
                                    className="mx-auto h-40 w-auto object-contain"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setImagePreview(null);
                                      setFormData({ ...formData, image: null });
                                    }}
                                    className="mt-2 text-sm text-red-500 hover:text-red-700"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                                  <div className="flex text-sm text-slate-600">
                                    <label
                                      htmlFor="image-upload"
                                      className="relative cursor-pointer rounded-md font-medium text-orange-500 hover:text-orange-600"
                                    >
                                      <span>Upload a file</span>
                                      <input
                                        id="image-upload"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        onChange={handleChange}
                                      />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                  </div>
                                  <p className="text-xs text-slate-500">
                                    PNG, JPG, GIF up to 2MB (recommended size:
                                    1200×400px)
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                          {errors.image && (
                            <p className="text-red-500 text-sm mt-1">
                              Store image is required
                            </p>
                          )}
                        </div>
                        <div className="bg-blue-50 p-4 rounded-md">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <AlertCircle className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-blue-800">
                                Store Image Requirements
                              </h3>
                              <div className="mt-2 text-sm text-blue-700">
                                <p>
                                  For best results, use an image with a 3:1
                                  aspect ratio. This image will be displayed on
                                  your store profile and in search results.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Review */}
                  {formStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                          <FileText className="mr-2 h-5 w-5 text-orange-500" />{" "}
                          Review & Submit
                        </h3>
                        <p className="text-slate-500 mb-6">
                          Please review your information before submitting.
                        </p>
                      </div>
                      <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-md">
                          <h4 className="font-medium mb-3 text-lg">
                            Store Information
                          </h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-slate-500">
                                Store Name:
                              </span>
                              <p className="font-medium">{formData.name}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Email:</span>
                              <p className="font-medium">{formData.email}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Phone:</span>
                              <p className="font-medium">{formData.phone}</p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-slate-500">Address:</span>
                              <p className="font-medium">{formData.address}</p>
                            </div>
                            {formData.description && (
                              <div className="col-span-2">
                                <span className="text-slate-500">
                                  Description:
                                </span>
                                <p className="font-medium">
                                  {formData.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {imagePreview && (
                          <div>
                            <h4 className="font-medium mb-2 text-lg">
                              Store Image
                            </h4>
                            <div className="border rounded-md p-3">
                              <img
                                src={imagePreview}
                                alt="Store preview"
                                className="h-40 object-contain mx-auto"
                              />
                            </div>
                          </div>
                        )}

                        <div className="bg-orange-50 border border-orange-100 p-4 rounded-md">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <Check className="h-5 w-5 text-orange-500" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-orange-800">
                                By submitting this form, you confirm that all
                                provided information is accurate. You will be
                                able to update your store information later.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form Navigation Buttons */}
                  <div className="mt-8 flex justify-between">
                    {formStep > 1 && (
                      <Button
                        variant="outline"
                        type="button"
                        onClick={handlePrevStep}
                        className="px-4 py-2 border border-gray-300"
                      >
                        Previous Step
                      </Button>
                    )}

                    {formStep < 4 ? (
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="ml-auto px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                      >
                        Next Step
                      </Button>
                    ) : (
                      <div className="ml-auto space-x-2">
                        {user?.store && (
                          <Button
                            type="button"
                            onClick={removeStore}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            Remove Store
                          </Button>
                        )}
                        <Button
                          type="button"
                          onClick={handleSubmit}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          {user?.store ? "Update Store" : "Create Store"}
                        </Button>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
