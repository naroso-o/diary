import { formatDateForDisplay, getCurrentDateString, isDateToday } from "../../utils/dateUtils"
import { Button } from "../ui/Button"

interface DiaryNavigationProps {
    selectedDate: string
    onDateSelect: (date: string) => void
}
export const DiaryNavigation = ({ selectedDate, onDateSelect }: DiaryNavigationProps) => {
    const navigateDate = (direction: 'prev' | 'next') => {
        const currentDate = new Date(selectedDate)
        const newDate = new Date(currentDate)

        if (direction === 'prev') {
            newDate.setDate(newDate.getDate() - 1)
        } else {
            newDate.setDate(newDate.getDate() + 1)
        }

        onDateSelect(newDate.toISOString().split('T')[0])
    }

    const goToToday = () => {
        onDateSelect(getCurrentDateString())
    }

    return (
        <div className="flex items-center gap-2 ml-4">

            <Button
                onClick={() => navigateDate('prev')}
                size="sm"
                variant="secondary"
                label="이전 날짜"
            />
            <span
                className="px-3 py-1 text-sm text-pink-700"
            >
                {formatDateForDisplay(selectedDate)}
            </span>
            <Button
                onClick={() => navigateDate('next')}
                size="sm"
                variant="secondary"
                label="다음 날짜"
            />
            <Button
                onClick={goToToday}
                disabled={isDateToday(selectedDate)}
                size="sm"
                variant="primary"
                label="오늘로 이동"
            />

        </div>
    )
}