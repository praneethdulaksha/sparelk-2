import {
  Truck,
  Shield,
  BadgeCheck,
  Clock,
  Wrench,
  Headphones,
} from "lucide-react";

export default function WhyBuyFromUs() {
  const features = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Genuine Parts",
      description: "Original and OEM parts with warranty",
    },
    {
      icon: <Truck className="h-5 w-5" />,
      title: "Fast Delivery",
      description: "Free shipping on orders over Rs.30,000",
    },
    {
      icon: <BadgeCheck className="h-5 w-5" />,
      title: "Quality Assured",
      description: "All parts tested and verified",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "24/7 Support",
      description: "Expert assistance anytime",
    },
    {
      icon: <Wrench className="h-5 w-5" />,
      title: "Easy Returns",
      description: "365-day return policy",
    },
    {
      icon: <Headphones className="h-5 w-5" />,
      title: "Expert Help",
      description: "Professional guidance",
    },
  ];

  return (
    <div className="py-12 px-6 bg-white w-full rounded-xl border border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold mb-2">Why Choose SpareLK</h2>
          <p className="text-base text-gray-600">
            We're committed to providing quality parts with exceptional service
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group p-5 rounded-lg border border-gray-100 bg-white transition-shadow hover:shadow-md overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-medium text-base text-gray-800 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-500">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
