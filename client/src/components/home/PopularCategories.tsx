import Button from "../Button";

type TCategory = {
    title: string;
    image: string;
    items: string[];
}

const categories: TCategory[] = [
    {
        title: "Body Parts",
        image: "/bodyparts-category.png", // Replace with the correct image path
        items: ["Bumpers", "Doors", "Fenders", "Mirrors"],
    },
    {
        title: "Electronics",
        image: "/electronics-category.png",
        items: ["Amplifiers", "Installation Parts", "Speakers", "Stereos"],
    },
    {
        title: "Lighting",
        image: "/lighting-category.png",
        items: ["Fog Lights", "Headlights", "LED Lights", "Replacement Bulbs"],
    },
    {
        title: "Performance Parts",
        image: "/performance-category.png",
        items: ["Air Intake Systems", "Engine Components", "Exhaust Systems", "Performance Chips"],
    },
    {
        title: "Repair Parts",
        image: "/repairparts-category.png",
        items: ["Brake Parts", "Engine Parts", "Exhaust Parts", "Fuel Delivery"],
    },
    {
        title: "Wheels and Tires",
        image: "/tires-category.png",
        items: ["Lug Nuts & Locks", "Tire Chains", "Tires", "Wheel Covers"],
    },
];

const PopularCategories = () => {
    return (
        <section className="popular-categories">
            <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                    <CategoryCard key={index} category={category} />
                ))}
            </div>
        </section>
    );
};

type CategoryCardProps = {
    category: TCategory;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
    return (
        <div className="category-card border flex rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
            <img
                src={category.image}
                alt={category.title}
                className="w-1/2 object-contain mb-4 pr-4"
            />
            <div>
                <h3 className="text-xl font-semibold mb-3">{category.title}</h3>
                <ul className="text-gray-600 mb-4 text-sm">
                    {category.items.map((item, index) => (
                        <li key={index} className="mb-1">
                            {item}
                        </li>
                    ))}
                </ul>
                <a
                    href="#"
                    className="text-main font-medium hover:underline"
                >
                    Show All &gt;
                </a>
            </div>

        </div>
    );
};

export default PopularCategories;
