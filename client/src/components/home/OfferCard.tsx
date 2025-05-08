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
    <div className='w-[350px] h-[240px]  text-gray-100 rounded-sm p-8 flex flex-col justify-center bg-center bg-cover relative'>
      <h2 className='text-2xl font-bold text-gray-100 z-10'>{h1}</h2>
      <h1 className='text-xl font-semibold' z-10>{h2}</h1>
      <p className='text-sm mt-3 z-10'>{p}</p>
      {btnText && <Button onClick={onClick} className='mt-2 w-32 z-10 bg-main text-light'>{btnText}</Button>}

      <div className='bg-center bg-cover w-full h-full absolute left-0 top-0 ' style={{ backgroundImage: `url(${imgLink})`}}></div>
      <div className='bg-gradient-to-r from-black to-black/20 w-full h-full absolute left-0 top-0 '></div>
    </div>
  )
}
