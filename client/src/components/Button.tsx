/**
 * Button Component
 *
 * Reusable button component with consistent styling and behavior.
 * Supports customization through className prop and provides default styling.
 *
 * @module Components/Button
 */

/**
 * Props interface for the Button component
 *
 * @interface Props
 */
type Props = {
  /** Content to be displayed inside the button */
  children: React.ReactNode;
  /** Additional CSS classes to apply to the button */
  className?: string;
  /** Function to execute when button is clicked */
  onClick?: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** HTML button type attribute */
  type?: "button" | "submit" | "reset" | undefined;
};

/**
 * Button component
 * Renders a stylized button with configurable properties
 *
 * @param {Props} props - Component props
 * @returns {JSX.Element} Styled button component
 */
export default function Button({
  children,
  onClick,
  type,
  className,
  disabled,
}: Props) {
  return (
    <button
      type={type ? type : "button"}
      onClick={onClick}
      disabled={disabled === null ? false : disabled}
      className={
        "px-6 py-1 bg-main text-black text-base font-medium rounded hover:bg-gray-200 transition " +
        className
      }
    >
      {children}
    </button>
  );
}
