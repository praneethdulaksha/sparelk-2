import { useNavigate } from "react-router-dom";

type TCategory = {
  title: string;
  image: string;
  items: string[];
  cat: string;
};

const categories: TCategory[] = [
  {
    title: "Body Parts",
    image: "/bodyparts-category.png", // Replace with the correct image path
    items: ["Bumpers", "Doors", "Fenders", "Mirrors"],
    cat: "Body Parts & Mirrors",
  },
  {
    title: "Electronics",
    image: "/electronics-category.png",
    items: ["Amplifiers", "Installation Parts", "Speakers", "Stereos"],
    cat: "Electrical Components",
  },
  {
    title: "Lighting",
    image: "/lighting-category.png",
    items: ["Fog Lights", "Headlights", "LED Lights", "Replacement Bulbs"],
    cat: "Lighting & Indicators",
  },
  {
    title: "Performance Parts",
    image: "/performance-category.png",
    items: [
      "Air Intake Systems",
      "Engine Components",
      "Exhaust Systems",
      "Performance Chips",
    ],
    cat: "Engine & Drivetrain",
  },
  {
    title: "Repair Parts",
    image: "/repairparts-category.png",
    items: ["Brake Parts", "Engine Parts", "Exhaust Parts", "Fuel Delivery"],
    cat: "Brakes & Suspension",
  },
  {
    title: "Wheels and Tires",
    image: "/tires-category.png",
    items: ["Lug Nuts & Locks", "Tire Chains", "Tires", "Wheel Covers"],
    cat: "Wheels & Tires",
  },
];

const PopularCategories = () => {
  return (
    <section className="mb-16 w-full">
      <h2 className="text-3xl font-bold mb-11 text-center text-gray-800">
        Popular Categories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <CategoryCard key={index} category={category} />
        ))}
      </div>
    </section>
  );
};

type CategoryCardProps = {
  category: TCategory;
};

const CategoryCard = ({ category }: CategoryCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex border border-gray-200 h-full cursor-pointer relative"
      onClick={() => navigate("/shop", { state: { cat: category.cat } })}
    >
      {/* Left orange bar that appears on hover */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

      {/* Content section */}
      <div className="py-5 px-7 flex-grow flex flex-col">
        <h3 className="font-bold text-lg text-gray-900 mb-2">
          {category.title}
        </h3>
        <ul className="text-gray-600 mb-4 text-sm flex flex-col gap-1">
          {category.items.map((item, index) => (
            <li key={index} className="text-sm text-gray-500 flex items-center">
              <span className="h-1 w-1 rounded-full bg-orange-500 mr-2"></span>
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <span className="text-orange-500 text-sm font-medium group-hover:underline flex items-center">
            View All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Image container with hover effect */}
      <div className="relative h-auto w-1/2 overflow-hidden bg-gray-50">
        <img
          className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300"
          src={category.image}
          alt={category.title}
        />
      </div>
    </div>
  );
};

export default PopularCategories;
