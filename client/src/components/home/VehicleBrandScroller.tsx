import React from "react";

import Marquee from "react-fast-marquee";
import { useNavigate } from "react-router-dom";
import { brands } from "../../data/brands";
export default function VehicleBrandScroller() {
  const navigate = useNavigate();
  const [speed] = React.useState(70);

  function handleClick(brand: string) {
    navigate("/shop", { state: { brand } });
  }

  return (
    <div className=" w-screen pt-16 pb-24 bg-slate-100">
      <h2 className="text-3xl text-center font-bold text-gray-800 mb-16 w-screen">
        Parts for All Major Brands
      </h2>
      <Marquee speed={speed} gradient={false} className="w-screen" pauseOnHover>
        {brands.map((logo) => (
          <img
            key={logo.brand}
            src={logo.url}
            alt={logo.brand}
            className="h-7 w-auto mx-12 cursor-pointer opacity-70 hover:opacity-100 transition duration-300"
            onClick={() => handleClick(logo.brand)}
          />
        ))}
      </Marquee>
    </div>
  );
}
