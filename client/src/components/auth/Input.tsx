type Props = {
  label: string;
  placeholder: string;
  type?: "text" | "password" | "email" | "file";
  value: string;
  setValue: any;
  required?: boolean;
  disabled?: boolean;
  htmlFor?: string;
};

export default function Input({
  label,
  placeholder,
  type = "text",
  value,
  setValue,
  required = true,
  htmlFor,
}: Props) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        required={required}
        type={type}
        id={htmlFor}
        placeholder={placeholder}
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
        className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
      />
    </div>
  );
}
