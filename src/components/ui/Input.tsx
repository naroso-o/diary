import { XIcon } from "lucide-react"

interface InputProps {
    placeholder: string
    value: string
    onChange: (value: string) => void
}

export const Input = ({ placeholder, value, onChange }: InputProps) => {
    return (
        <div className="relative">
            <input type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="input" />
            {value && <XIcon className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer" onClick={() => onChange('')} />}
        </div>
    )
}