type Props = {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
}

export default function Button({ children, onClick, className, disabled }: Props) {
  return (
    <button 
    type="button"
    onClick={onClick}
    disabled={disabled === null ? false : disabled}
    className={'px-6 py-1 bg-main text-black text-base font-medium rounded hover:bg-gray-200 transition ' + className}>
      {children}
    </button>
  )
}
