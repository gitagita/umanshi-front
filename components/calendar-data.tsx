import { getCalendarData } from '@/utils/calendar-data';

import CalendarRange from "@/components/calendar-range";

interface iParams { params: { id: string } }
export default async function CalendarData({ params: { id } }: iParams) {

  const calendar = await getCalendarData(id);

  return (
    <div>
      <CalendarRange params={{ id: id, dateList: calendar.data.dateList }} />
    </div>
  );
}