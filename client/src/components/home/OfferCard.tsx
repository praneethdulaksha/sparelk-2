import Button from '../Button'

type Props = {
    h1?: string;
    h2?: string;
    p?: string;
    btnText?: string;
    imgLink: string;
    onClick?: () => void;
}

export default function OfferCard({ h1, h2, p, btnText, imgLink, onClick }: Props) {
  return (
    <div className='w-[350px] h-[240px] bg-gradient-to-r from-black to-black/20 text-gray-300 rounded-sm p-8 flex flex-col justify-center bg-center bg-cover relative'>
      <h2 className='text-2xl font-bold text-main'>{h1}</h2>
      <h1 className='text-xl font-semibold'>{h2}</h1>
      <p className='text-base mt-3'>{p}</p>
      {btnText && <Button onClick={onClick} className='mt-2 w-32'>{btnText}</Button>}

      <div className='bg-center bg-cover w-full h-full absolute left-0 top-0 -z-10' style={{ backgroundImage: `url(${imgLink})`}}></div>
    </div>
  )
}
