/**
 * Li Component
 *
 * A styled list item component used primarily for navigation menus.
 * Combines Link from React Router with FontAwesome icons and styled presentation.
 *
 * @module Components/Li
 */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

/**
 * Props interface for the Li component
 *
 * @interface LiProps
 */
type LiProps = {
  /** Target route for navigation */
  to: string;
  /** Content to be displayed inside the list item */
  children: React.ReactNode;
  /** Optional click handler function */
  onClick?: () => void;
  /** Optional FontAwesome icon to display before text */
  icon?: IconDefinition;
  /** Current path for active state styling */
  currentPath?: string;
};

/**
 * Li component
 * Renders a styled list item with link functionality for navigation menus
 *
 * @param {LiProps} props - Component props
 * @returns {JSX.Element} Styled list item component
 */
export default function Li({
  children,
  to,
  icon,
  onClick,
  currentPath,
}: LiProps) {
  return (
    <Link
      id="nav-link"
      to={to}
      onClick={onClick}
      className={`block px-4 py-2 text-slate-700 text-sm hover:bg-accent hover:text-accent-foreground rounded ease-in duration-75 
                ${currentPath === to && "bg-muted text-muted-foreground"}`}
    >
      {/* Render icon if provided */}
      {icon && <FontAwesomeIcon className="mr-2 text-slate-700" icon={icon} />}
      {children}
    </Link>
  );
}
