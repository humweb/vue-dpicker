import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

export function useDateHelpers() {
  const getDaysInMonth = (month: number, year: number) => {
    const date = dayjs().month(month).year(year);
    const daysInMonth = date.daysInMonth();
    const firstDayOfMonth = date.startOf('month').day();

    const days = [];

    const prevMonth = date.subtract(1, 'month');
    const prevMonthDays = prevMonth.daysInMonth();
    for (let i = firstDayOfMonth; i > 0; i--) {
      days.push({
          date: prevMonth.date(prevMonthDays - i + 1).startOf('day').toDate(),
          isCurrentMonth: false,
      });
  }

  for (let i = 1; i <= daysInMonth; i++) {
      days.push({
          date: date.date(i).startOf('day').toDate(),
          isCurrentMonth: true,
      });
  }

  const remainingDays = 42 - days.length;
  const nextMonth = date.add(1, 'month');
  for (let i = 1; i <= remainingDays; i++) {
      days.push({
          date: nextMonth.date(i).startOf('day').toDate(),
          isCurrentMonth: false,
      });
    }

    return days;
  };

  const combineDateAndTime = (date: Date, time: { hours: number; minutes: number }) => {
    return dayjs(date)
      .hour(time.hours)
      .minute(time.minutes)
      .second(0)
      .millisecond(0)
      .toDate();
  };

  const isDateInRange = (date: Date, startDate: Date | null, endDate: Date | null) => {
    if (!startDate || !endDate) return false;
    const start = dayjs(startDate).startOf('day');
    const end = dayjs(endDate).endOf('day');
    return dayjs(date).isAfter(start) && dayjs(date).isBefore(end);
  }

  const isSameDate = (date1: Date, date2: Date) => {
    return dayjs(date1).isSame(date2, 'day');
  }

  const parseDate = (date: string | Date): Date => {
    return dayjs(date).toDate();
  }

  return {
    getDaysInMonth,
    combineDateAndTime,
    isDateInRange,
    isSameDate,
    parseDate
  };
}
