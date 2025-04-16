import React from "react";
import { FiChevronDown } from "react-icons/fi";

interface CollapsibleSectionProps {
    title: string;
    isOpened: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, isOpened, onToggle, children }) => {
    return (
        <div className="py-3 mb-3 border-b border-main">
            <div className="flex items-center">
                <h5 className="text-gray-600 font-semibold uppercase flex-grow">{title}</h5>
                <span className={`text-3xl text-gray-500 cursor-pointer duration-75 ${isOpened ? 'rotate-180' : 'rotate-0'}`} onClick={onToggle}><FiChevronDown /></span>
            </div>
            {isOpened && children}
        </div>
    );
};

export default CollapsibleSection;