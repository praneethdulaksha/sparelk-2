
type Props = {
    h1: string;
    p: string;
    btnText: string;
    imgLink: string;
    handleClick: () => void;
}

export default function Slide({ h1, p, btnText, imgLink, handleClick }: Props) {
    return (
        <div className="h-full w-full flex items-center bg-gradient-to-r from-black to-transparent  text-white p-20">
            <div className="bg-cover bg-center w-full h-full absolute brightness-75 left-0 top-0" style={{ backgroundImage: `url(${imgLink})` }}></div>
            <div className="max-w-[40%] z-10">
                <h1 className="text-3xl font-bold leading-tight mb-4">{h1}</h1>
                <p className="mb-6 text-gray-300">{p}</p>
                <button onClick={handleClick} className="px-6 py-1 bg-main text-black font-medium rounded hover:bg-gray-200 transition">{btnText}</button>
            </div>
        </div>
    )
}
