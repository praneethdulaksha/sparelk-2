/**
 * Logo Component
 *
 * Displays the SpareLK brand logo with configurable size, variant, and text visibility.
 * Used throughout the application for consistent brand presentation.
 *
 * @module Components/Logo
 */
import { Link } from "react-router-dom";

/**
 * Props interface for the Logo component
 *
 * @interface LogoProps
 */
interface LogoProps {
  /** Color variant of the logo - 'light' for white text, 'dark' for slate text */
  variant?: "light" | "dark";
  /** Size variant affecting the dimensions of the logo and text */
  size?: "small" | "medium" | "large";
  /** Whether to display the brand name text alongside the logo icon */
  showText?: boolean;
}

/**
 * Logo component
 * Renders the SpareLK logo with configurable appearance options
 *
 * @param {LogoProps} props - Component props
 * @returns {JSX.Element} Logo component with appropriate styling
 */
export default function Logo({
  variant = "light",
  size = "medium",
  showText = true,
}: LogoProps) {
  // Size mappings for responsive design
  const sizeClasses = {
    small: {
      container: "gap-1.5",
      circle: "h-6 w-6",
      svg: "w-[15px] h-[15px]",
      text: "text-base",
    },
    medium: {
      container: "gap-2",
      circle: "h-8 w-8",
      svg: "w-[20px] h-[20px]",
      text: "text-xl",
    },
    large: {
      container: "gap-3",
      circle: "h-10 w-10",
      svg: "w-[25px] h-[25px]",
      text: "text-2xl",
    },
  };

  // Color variants based on light/dark prop
  const textColor = variant === "light" ? "text-white" : "text-slate-800";

  return (
    <Link
      to="/"
      className={`flex items-center ${sizeClasses[size].container} hover:scale-105 transition-transform duration-200`}
    >
      {/* Logo circle */}
      <div
        className={`flex items-center justify-center rounded-full bg-orange-500 ${sizeClasses[size].circle}`}
      >
        {/* Plus icon inside circle */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-white ${sizeClasses[size].svg}`}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
      </div>

      {/* Brand name text - conditionally rendered */}
      {showText && (
        <span className={`font-bold ${textColor} ${sizeClasses[size].text}`}>
          SpareLK
        </span>
      )}
    </Link>
  );
}
