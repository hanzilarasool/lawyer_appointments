
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import moment from 'moment-timezone';

export default function Calendar({ selectedDate, onDateSelect }) {
  const [currentMonth, setCurrentMonth] = useState(moment.tz('Asia/Karachi').toDate());

  const today = moment.tz('Asia/Karachi').startOf('day').toDate();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(year, month + direction, 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = moment.tz({ year, month, day }, 'Asia/Karachi');
    if (clickedDate.isSameOrAfter(today, 'day')) {
      const dateString = clickedDate.format('YYYY-MM-DD');
      console.log('Selected date (PKT):', dateString); // Debug log
      onDateSelect(dateString);
    }
  };

  const isSelectedDate = (day) => {
    if (!selectedDate) return false;
    const dateString = moment.tz({ year, month, day }, 'Asia/Karachi').format('YYYY-MM-DD');
    return dateString === selectedDate;
  };

  const isPastDate = (day) => {
    const dateToCheck = moment.tz({ year, month, day }, 'Asia/Karachi');
    return dateToCheck.isBefore(today, 'day');
  };

  const isWeekend = (day) => {
    const date = moment.tz({ year, month, day }, 'Asia/Karachi');
    return date.day() === 0 || date.day() === 6; // Sunday or Saturday
  };

  // Generate calendar days
  const calendarDays = [];

  // Previous month's trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPast: true,
    });
  }

  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isPast: isPastDate(day),
      isWeekend: isWeekend(day),
      isSelected: isSelectedDate(day),
    });
  }

  // Next month's leading days
  const remainingSlots = 42 - calendarDays.length;
  for (let day = 1; day <= remainingSlots; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isPast: false,
    });
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h4 className="font-semibold text-gray-900">
          {monthNames[month]} {year}
        </h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-200"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {dayNames.map((dayName) => (
          <div key={dayName} className="text-xs font-medium text-gray-500 p-2">
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarDays.map((calendarDay, index) => {
          const { day, isCurrentMonth, isPast, isWeekend, isSelected } = calendarDay;
          
          if (!isCurrentMonth) {
            return (
              <div key={index} className="p-2 text-sm text-gray-400">
                {day}
              </div>
            );
          }

          const isDisabled = isPast || isWeekend;

          return (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => !isDisabled && handleDateClick(day)}
              disabled={isDisabled}
              className={`
                p-2 text-sm h-8 w-8 
                ${isSelected 
                  ? 'bg-primary text-white hover:bg-blue-800' 
                  : 'hover:bg-blue-100'
                }
                ${isDisabled 
                  ? 'text-gray-400 cursor-not-allowed hover:bg-transparent' 
                  : 'text-gray-900'
                }
                ${isWeekend && !isPast ? 'bg-red-50 text-red-400' : ''}
              `}
            >
              {day}
            </Button>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <div>• Weekends are not available</div>
        <div>• Select an available date to see time slots</div>
      </div>
    </div>
  );
}
