import { Button } from "@/components/ui/button";

type Props = {
  h1: string;
  p: string;
  btnText: string;
  imgLink: string;
  handleClick: () => void;
};

export default function Slide({ h1, p, btnText, imgLink, handleClick }: Props) {
  return (
    <div className="h-full w-full flex items-center text-white p-8 md:p-16 lg:p-20 relative">
      {/* Background image with dimming overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imgLink})` }}
      ></div>

      {/* Dark gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>

      {/* Additional dimming overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content container */}
      <div className="max-w-[90%] md:max-w-[60%] lg:max-w-[40%] z-10 relative ml-9 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4 text-white drop-shadow-md ">
          {h1}
        </h1>
        <p className="mb-6 text-gray-100 drop-shadow-md">{p}</p>
        <Button
          onClick={handleClick}
          size="lg"
          className="bg-orange-500 hover:bg-orange-400 text-white font-medium text-base shadow-lg hover:shadow-xl transition duration-250"
        >
          {btnText}
        </Button>
      </div>
    </div>
  );
}
