/**
 * Section Component
 *
 * A container component that applies consistent width, centering, and spacing
 * to page sections. Used to maintain layout consistency across the application.
 *
 * @module Components/Section
 */
import React from "react";

/**
 * Props interface for the Section component
 *
 * @interface SectionProps
 */
type SectionProps = {
  /** Content to be displayed inside the section container */
  children: React.ReactNode;
  /** Additional CSS classes to apply to the section container */
  className?: string;
};

/**
 * Section component
 * Wraps content in a consistently styled container with max width
 *
 * @param {SectionProps} props - Component props
 * @returns {JSX.Element} Section container component
 */
export default function Section({ children, className }: SectionProps) {
  return (
    <div
      className={`container max-w-7xl flex flex-col items-center ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
}
