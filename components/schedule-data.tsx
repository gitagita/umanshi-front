import { getCalendarData } from '@/utils/calendar-data';
import ScheduleRange from "@/components/schedule-range";

interface iParams { params: { id: string, calendarCode: string } }

export default async function ScheduleData({ params: { id, calendarCode } }: iParams) {

  const calendar = await getCalendarData(calendarCode);

  return (
    <div>
      <ScheduleRange params={{ id: id, calendarCode: calendarCode, dateList: calendar.data.date_list}} />
    </div>
  );
}