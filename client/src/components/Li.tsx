import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"


type LiProps = {
    to: string,
    children: React.ReactNode,
    onClick?: () => void,
    icon?: any,
    currentPath?: string
}

export default function Li({ children, to, icon, onClick, currentPath }: LiProps) {
    return (
        <Link
            id='nav-link'
            to={to}
            onClick={onClick}
            className={`block px-4 py-2 hover:bg-main/50 hover:text-black hover:brightness-125 rounded hover:translate-x-3 ease-in duration-75 
                ${currentPath === to && 'bg-main text-light hover:bg-main'}`}
        >
            {
                icon && <FontAwesomeIcon className='mr-2' icon={icon} />
            }
            {children}
        </Link>
    )
}