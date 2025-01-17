
type Props = {
    label: string;
    placeholder: string;
    type?: 'text' | 'password' | 'email';
    value: string;
    setValue: any;
    required?: boolean;
    disabled?: boolean;
    htmlFor?: string;
}

export default function Input({
    label,
    placeholder,
    type = 'text',
    value,
    setValue,
    required = true,
    htmlFor,
}: Props) {
    return (
        <>
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
                onChange={(e:any) => setValue(e.target.value)}
                className="mt-1 block w-full p-3 rounded-md bg-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200"
            />
        </>
    )
}
