
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getAvailableSlots } from "../lib/api";
import { Loader2 } from "lucide-react";
import moment from 'moment-timezone';

export default function TimeSlots({ selectedDate, selectedTime, onTimeSelect }) {
  // Ensure selectedDate is formatted as YYYY-MM-DD in PKT
  const formattedDate = selectedDate 
    ? moment.tz(selectedDate, 'Asia/Karachi').format('YYYY-MM-DD')
    : null;
  console.log('Selected date (raw):', selectedDate); // Debug log
  console.log('Formatted date (PKT):', formattedDate); // Debug log

  const { data: slotsData, isLoading, error } = useQuery({
    queryKey: ['/api/slots', formattedDate],
    queryFn: () => getAvailableSlots(formattedDate),
    enabled: !!formattedDate,
  });
  console.log('Slots data:', slotsData); // Debug log

  if (!formattedDate) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please select a date first
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading time slots. Please try again.
      </div>
    );
  }

  const { availableSlots, bookedSlots } = slotsData;

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const allSlots = [
    "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {allSlots.map((slot) => {
        const isAvailable = availableSlots.includes(slot);
        const isBooked = bookedSlots.includes(slot);
        const isSelected = selectedTime === slot;

        if (isBooked) {
          return (
            <div
              key={slot}
              className="flex items-center justify-between p-3 border border-red-300 rounded-lg bg-red-50 cursor-not-allowed opacity-75"
            >
              <span className="font-medium text-gray-500">{formatTime(slot)}</span>
              <span className="text-sm text-red-600 font-medium">Booked</span>
            </div>
          );
        }

        if (!isAvailable) {
          return (
            <div
              key={slot}
              className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed opacity-75"
            >
              <span className="font-medium text-gray-500">{formatTime(slot)}</span>
              <span className="text-sm text-gray-500 font-medium">Unavailable</span>
            </div>
          );
        }

        return (
          <Button
            key={slot}
            type="button"
            variant="outline"
            onClick={() => onTimeSelect(slot)}
            className={`
              w-full flex items-center justify-between p-3 h-auto
              ${isSelected 
                ? 'border-primary bg-blue-50 text-primary hover:bg-blue-100' 
                : 'border-gray-300 hover:border-primary hover:bg-blue-50'
              }
            `}
          >
            <span className="font-medium">{formatTime(slot)}</span>
            <span className={`text-sm font-medium ${
              isSelected ? 'text-primary' : 'text-green-600'
            }`}>
              {isSelected ? 'Selected' : 'Available'}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
