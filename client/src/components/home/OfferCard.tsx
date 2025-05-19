import Button from "../Button";

type Props = {
  h1?: string;
  h2?: string;
  p?: string;
  btnText?: string;
  imgLink: string;
  onClick?: () => void;
};

export default function OfferCard({
  h1,
  h2,
  p,
  btnText,
  imgLink,
  onClick,
}: Props) {
  return (
    <div className="w-[350px] h-[240px] text-gray-100 rounded-xl overflow-hidden p-8 flex flex-col justify-center bg-center bg-cover relative group shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <h2 className="text-2xl font-bold text-gray-100 z-10">{h1}</h2>
      <h1 className="text-xl font-semibold" z-10>
        {h2}
      </h1>
      <p className="text-sm mt-3 z-10">{p}</p>
      {btnText && (
        <Button
          onClick={onClick}
          className="mt-5 py-2 w-32 z-10 rounded-full bg-transparent border border-orange-500 text-white hover:bg-orange-500 hover:border-orange-500 transition-all duration-300"
        >
          {btnText}
        </Button>
      )}

      <div
        className="bg-center bg-cover w-full h-full absolute left-0 top-0 rounded-xl transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundImage: `url(${imgLink})` }}
      ></div>
      <div className="bg-gradient-to-r from-black to-black/20 w-full h-full absolute left-0 top-0 rounded-xl"></div>
    </div>
  );
}
