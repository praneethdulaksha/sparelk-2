/**
 * CollapsibleSection Component
 *
 * A collapsible/expandable section with a header that can be toggled.
 * Used for accordions, filter sections, and other expandable content areas.
 *
 * @module Components/CollapsibleSection
 */
import React from "react";
import { FiChevronDown } from "react-icons/fi";

/**
 * Props interface for the CollapsibleSection component
 *
 * @interface CollapsibleSectionProps
 */
interface CollapsibleSectionProps {
  /** Title displayed in the header of the collapsible section */
  title: string;
  /** Whether the section is currently expanded/opened */
  isOpened: boolean;
  /** Function to call when toggling the section open/closed */
  onToggle: () => void;
  /** Content to display when the section is expanded */
  children: React.ReactNode;
}

/**
 * CollapsibleSection component
 * Renders a toggleable section with header and expandable content
 *
 * @param {CollapsibleSectionProps} props - Component props
 * @returns {JSX.Element} Collapsible section component
 */
const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  isOpened,
  onToggle,
  children,
}) => {
  return (
    <div className="py-3 mb-3 border-b border-main">
      {/* Section header with toggle functionality */}
      <div className="flex items-center">
        <h5 className="text-gray-600 font-semibold uppercase flex-grow">
          {title}
        </h5>
        <span
          className={`text-3xl text-gray-500 cursor-pointer duration-75 ${
            isOpened ? "rotate-180" : "rotate-0"
          }`}
          onClick={onToggle}
        >
          <FiChevronDown />
        </span>
      </div>
      {isOpened && children}
    </div>
  );
};

export default CollapsibleSection;
