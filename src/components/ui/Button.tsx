interface ButtonProps {
    label: string
    onClick: () => void
    disabled?: boolean
    variant?: 'primary' | 'secondary' | 'tertiary'
    icon?: React.ReactNode
    size?: 'sm' | 'md' | 'lg'
}

export const Button = ({ label, onClick, disabled, variant = 'primary', icon, size = 'md' }: ButtonProps) => {
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        tertiary: 'btn-tertiary'
    }
    const sizeClasses = {
        sm: 'text-sm px-2 py-1',
        md: 'text-base',
        lg: 'text-lg'
    }

    return (
        <button className={`cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]}`} onClick={onClick} disabled={disabled}>
            <div className="flex items-center justify-centerw-full h-full">
                {icon && <span className="mr-2">{icon}</span>}
                <span className="whitespace-nowrap">{label}</span>
            </div>
        </button>
    )
}