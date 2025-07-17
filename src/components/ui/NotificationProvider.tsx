import { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import type { NotificationProps } from '../../types'
import clsx from 'clsx'

interface NotificationContextType {
    showNotification: (notification: Omit<NotificationProps, 'id'>) => void
    hideNotification: (id: string) => void
    clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider')
    }
    return context
}

interface NotificationWithId extends NotificationProps {
    id: string
}

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<NotificationWithId[]>([])

    const showNotification = useCallback((notification: Omit<NotificationProps, 'id'>) => {
        const id = Date.now().toString()
        const newNotification: NotificationWithId = {
            ...notification,
            id,
            duration: notification.duration || 3000
        }

        setNotifications(prev => [...prev, newNotification])

        // 자동 제거 (persistent가 아닌 경우)
        if (!notification.persistent) {
            setTimeout(() => {
                hideNotification(id)
            }, newNotification.duration)
        }
    }, [])

    const hideNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }, [])

    const clearAll = useCallback(() => {
        setNotifications([])
    }, [])

    const getIcon = (type: NotificationProps['type']) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />
            case 'error':
                return <XCircle className="w-5 h-5 text-red-500" />
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />
            case 'info':
                return <Info className="w-5 h-5 text-blue-500" />
        }
    }

    const getStyles = (type: NotificationProps['type']) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800'
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800'
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800'
            case 'info':
                return 'bg-blue-50 border-blue-200 text-blue-800'
        }
    }

    return (
        <NotificationContext.Provider value={{ showNotification, hideNotification, clearAll }}>
            {children}

            {/* 알림 컨테이너 */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={clsx(
                            'max-w-sm p-4 rounded-lg border shadow-lg backdrop-blur-sm animate-fade-in',
                            getStyles(notification.type)
                        )}
                    >
                        <div className="flex items-start gap-3">
                            {getIcon(notification.type)}
                            <div className="flex-1">
                                {notification.title && (
                                    <h4 className="font-medium mb-1">{notification.title}</h4>
                                )}
                                <p className="text-sm">{notification.message}</p>
                                {notification.action && (
                                    <button
                                        onClick={notification.action.onClick}
                                        className="mt-2 text-sm font-medium underline hover:no-underline"
                                    >
                                        {notification.action.label}
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => hideNotification(notification.id)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    )
}