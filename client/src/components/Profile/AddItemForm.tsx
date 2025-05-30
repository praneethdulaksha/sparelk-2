import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { RootState } from "../../store/store";
import { api } from "../../api/api";
import { allCategories } from "../../data/categories";
import { ECondition } from "../../types";
import { brands } from "../../data/brands";

const AddItemForm = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [itemData, setItemData] = useState({
    code: "",
    name: "",
    discount: 0,
    price: 0,
    description: "",
    brand: "",
    vehicleModel: "",
    image: null,
    condition: ECondition.NEW,
    stock: 0,
    category: "",
  });
  const [validations, setValidations] = useState({
    code: false,
    name: false,
    discount: true,
    vehicleModel: false,
    brand: false,
    price: false,
    description: false,
    image: false,
    stock: false,
    category: false,
  });
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [categories] = useState(allCategories);
  const isNewItem = params.itemId === "new";

  const storeId = useSelector((state: RootState) => state.user.user?.store._id);

  useEffect(() => {
    if (params.itemId !== "new") {
      getItem();
      setValidations({
        code: true,
        name: true,
        discount: true,
        vehicleModel: true,
        brand: true,
        price: true,
        description: true,
        image: true,
        stock: true,
        category: true,
      });
    }
  }, []);

  const handleChange = (e: any) => {
    if (e.target.type === "file") {
      setItemData({
        ...itemData,
        [e.target.name]: e.target.files[0],
      });

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
      checkValidations("image", e.target.files[0]);
    } else {
      const { name, value } = e.target;
      setItemData({
        ...itemData,
        [name]: value,
      });
      checkValidations(name, value);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("code", itemData.code.toUpperCase());
    formData.append("name", itemData.name);
    formData.append("discount", itemData.discount.toString());
    formData.append("brand", itemData.brand);
    formData.append("vehicleModel", itemData.vehicleModel);
    formData.append("price", itemData.price.toString());
    formData.append("description", itemData.description);
    formData.append("condition", itemData.condition);
    formData.append("image", itemData.image as any);
    formData.append("stock", itemData.stock.toString());
    formData.append("category", itemData.category);
    formData.append("store", storeId);

    isNewItem ? saveItem(formData) : updateItem(formData);
  };

  function saveItem(formData: any) {
    api
      .post("item", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
        console.log(result.data.data);
        navigate("/manage-items");
        Swal.fire({
          icon: "success",
          title: "Item Added Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response.data.err,
          showConfirmButton: true,
        });
      });
  }

  function updateItem(formData: any) {
    api
      .put("item/" + params.itemId, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
        console.log(result);
        navigate("/manage-items");
        Swal.fire({
          icon: "success",
          title: "Item Updated Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response.data.err,
          showConfirmButton: true,
        });
      });
  }

  function getItem() {
    api
      .get("item/" + params.itemId)
      .then((result) => {
        setItemData(result.data.data);
        setImagePreview(
          "http://localhost:3000/images/" + result.data.data.image
        );
      })
      .catch((err) => console.log(err));
  }

  const checkValidations = (field: string, value: string) => {
    if (field === "name") {
      value
        ? setValidations({ ...validations, name: true })
        : setValidations({ ...validations, name: false });
    } else if (field === "discount") {
      parseFloat(value) <= 100 && parseFloat(value) >= 0
        ? setValidations({ ...validations, discount: true })
        : setValidations({ ...validations, discount: false });
    } else if (field === "vehicleModel") {
      value
        ? setValidations({ ...validations, vehicleModel: true })
        : setValidations({ ...validations, vehicleModel: false });
    } else if (field === "price") {
      parseFloat(value) >= 0
        ? setValidations({ ...validations, price: true })
        : setValidations({ ...validations, price: false });
    } else if (field === "description") {
      value
        ? setValidations({ ...validations, description: true })
        : setValidations({ ...validations, description: false });
    } else if (field === "image") {
      !value
        ? setValidations({ ...validations, image: false })
        : setValidations({ ...validations, image: true });
    } else if (field === "stock") {
      parseInt(value) > 0 && Number.isInteger(parseFloat(value))
        ? setValidations({ ...validations, stock: true })
        : setValidations({ ...validations, stock: false });
    } else if (field === "category") {
      !value
        ? setValidations({ ...validations, category: false })
        : setValidations({ ...validations, category: true });
    } else if (field === "brand") {
      value
        ? setValidations({ ...validations, brand: true })
        : setValidations({ ...validations, brand: false });
    } else if (field === "code") {
      value
        ? setValidations({ ...validations, code: true })
        : setValidations({ ...validations, code: false });
    }
  };

  return (
    <>
      <h2 className="text-2xl md:text-3xl lg:text-4xl mt-3 underline w-full text-center font-semibold mb-4">
        Add Item
      </h2>
      <div className=" mx-auto rounded px-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image (1 : 1)
            </label>
            {imagePreview && (
              <div
                className="my-2 w-80 aspect-square bg-cover bg-center"
                style={{ backgroundImage: `url(${imagePreview})` }}
              ></div>
            )}

            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className={`w-80 h-9 ${validations.image ? "bg-green-100" : "bg-red-100"
                } rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200`}
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="mb-4 col-span-1">
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Item Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={itemData.code}
                onChange={handleChange}
                className={`w-full h-9 uppercase ${validations.code ? "bg-green-100" : "bg-red-100"
                  } px-2 border border-black rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200`}
              />
            </div>
            <div className="mb-4 col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={itemData.name}
                onChange={handleChange}
                className={`w-full h-9 ${validations.name ? "bg-green-100" : "bg-red-100"
                  } px-2 border border-black rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200`}
              />
            </div>
            <div className="mb-4 col-span-2 sm:col-span-1">
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Stock
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={itemData.stock}
                onChange={handleChange}
                className={`w-full h-9 ${validations.stock ? "bg-green-100" : "bg-red-100"
                  } border px-2 border-black rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200`}
              />
            </div>
            <div className="mb-4 col-span-2 sm:col-span-1">
              <label
                htmlFor="discount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Discount (%)
              </label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={itemData.discount}
                onChange={handleChange}
                className={`w-full h-9 ${validations.discount ? "bg-green-100" : "bg-red-100"
                  } px-2 border border-black rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200`}
              />
            </div>
            <div className="mb-4 col-span-4 sm:col-span-2">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price (Rs)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={itemData.price}
                onChange={handleChange}
                className={`w-full h-9 ${validations.price ? "bg-green-100" : "bg-red-100"
                  } px-2 border border-black rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200`}
              />
            </div>
            <div className="mb-4 col-span-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={itemData.description}
                onChange={handleChange}
                className={`w-full ${validations.description ? "bg-green-100" : "bg-red-100"
                  } border p-2 border-black rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200`}
              ></textarea>
            </div>
            {/* radio buttons for condition new or used */}
            <div>
              <label
                htmlFor="condition"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Condition
              </label>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="new"
                  name="condition"
                  value="New"
                  checked={itemData.condition === ECondition.NEW}
                  onChange={handleChange}
                  className="form-radio mr-2"
                />
                <label
                  htmlFor="new"
                  className="text-sm font-medium text-gray-700 mr-5"
                >
                  New
                </label>
                <input
                  type="radio"
                  id="used"
                  name="condition"
                  value="Used"
                  checked={itemData.condition === ECondition.USED}
                  onChange={handleChange}
                  className="form-radio"
                />
                <label
                  htmlFor="used"
                  className="text-sm font-medium text-gray-700 ml-2"
                >
                  Used
                </label>
              </div>
            </div>
            <div className="mb-4 col-span-3">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={itemData.category}
                onChange={handleChange}
                className={`w-full h-9 ${validations.category ? "bg-green-100" : "bg-red-100"
                  } border px-2 border-black rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 col-span-1">
              <label
                htmlFor="brand"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Brand
              </label>
              <select
                id="brand"
                name="brand"
                value={itemData.brand}
                onChange={handleChange}
                className={`w-full h-9 ${validations.brand ? "bg-green-100" : "bg-red-100"
                  } border px-2 border-black rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200`}
              >
                <option value="">Select Brand</option>
                {brands.map(({ brand }) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 col-span-4 sm:col-span-3">
              <label
                htmlFor="vehicleModel"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Vehicle Model
              </label>
              <input
                type="text"
                id="vehicleModel"
                name="vehicleModel"
                placeholder="all or specific model"
                value={itemData.vehicleModel}
                onChange={handleChange}
                className={`w-full h-9 ${validations.vehicleModel ? "bg-green-100" : "bg-red-100"
                  } px-2 border border-black rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200`}
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white mb-5 py-1 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
            >
              {isNewItem ? "Add" : "Update"} Item
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddItemForm;
