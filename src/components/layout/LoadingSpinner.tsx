
import clsx from 'clsx'

interface LoadingSpinnerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    className?: string
    color?: 'pink' | 'white' | 'gray'
}
export const LoadingSpinner = ({
    size = 'md',
    className = '',
    color = 'pink'
}: LoadingSpinnerProps) => {
    const sizeClasses = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    }

    const colorClasses = {
        pink: 'border-pink-500 border-t-transparent',
        white: 'border-white border-t-transparent',
        gray: 'border-gray-500 border-t-transparent'
    }

    return (
        <div
            className={clsx(
                'border-2 rounded-full animate-spin',
                sizeClasses[size],
                colorClasses[color],
                className
            )}
            role="status"
            aria-label="로딩 중..."
        >
            <span className="sr-only">로딩 중...</span>
        </div>
    )
}