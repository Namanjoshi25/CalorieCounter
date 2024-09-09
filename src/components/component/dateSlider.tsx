import React from 'react';
import {format} from "date-fns"
interface DateSliderProps {
  dates: Date[];
  onDateSelect: (date: Date) => void;
  onPrevious: () => void;
  onNext: () => void;
 
 
}

const DateSlider: React.FC<DateSliderProps> = ({ dates, onDateSelect, onPrevious, onNext} ) => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
/* console.log(todayDate); */
  const handleDateClick = (date: Date) => {
 
    setSelectedDate(date);
    onDateSelect(date);
  };


  return (
    <div className="flex items-center space-x-4 p-4">
      <button onClick={onPrevious} className="px-4 py-2 border rounded bg-gray-100">
        &lt; Previous
      </button>
      <div className="flex overflow-x-auto space-x-4">
        {dates.map((date, index) => (
          
          <button
            key={index}
            onClick={() => handleDateClick(date)}
            className={`px-4 
              ${selectedDate.toDateString() === date.toDateString() ? " font-semibold shadow-lg bg-primary text-background" : ""}
               py-2 border rounded 
            
            `}
          >
            {  format(date, "MMM/dd/yy")}
          </button>
        ))}
      </div>
      <button onClick={onNext} className="px-4 py-2 border rounded bg-gray-100">
        Next &gt;
      </button>
    </div>
  );
};

export default DateSlider;
