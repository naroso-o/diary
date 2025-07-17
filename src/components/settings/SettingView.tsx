import { Settings } from 'lucide-react'
import type { ViewType } from '../../types'

interface SettingsViewProps {
    onViewChange: (view: ViewType) => void
}

export const SettingsView = ({ onViewChange }: SettingsViewProps) => {
    return (
        <div className="p-6">
            <div className="text-center py-20">
                <Settings className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-pink-800 mb-2">설정</h2>
                <p className="text-pink-600">설정 기능이 곧 추가될 예정입니다.</p>
            </div>
        </div>
    )
}