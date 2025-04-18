import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"


type LiProps = {
    to: string,
    children: React.ReactNode,
    onClick?: () => void,
    icon?: any,
}

export default function Li({ children, to, icon, onClick }: LiProps) {
    return (
        <Link
            id='nav-link'
            to={to}
            onClick={onClick}
            className="block px-4 py-2 hover:bg-main hover:brightness-125 text-gray-800 hover:text-black rounded hover:translate-x-3 ease-in duration-75"
        >
            {
                icon && <FontAwesomeIcon className='mr-2' icon={icon} />
            }
            {children}
        </Link>
    )
}