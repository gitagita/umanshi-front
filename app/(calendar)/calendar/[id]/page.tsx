import CalendarMerge from "@/components/calendar_merge";
import { getCalendarMerge } from "@/utils/calendar-data";
import { cookies } from "next/headers";

interface iParams { params: { id: string } }

export default async function CalendarMergePage({ params: { id } }: iParams) {
  const userCookie = cookies().get("user");
  let userInfo = { userId: '', nickname: '', calendarCode: '', calendarNm: '', isLeader: '' };
  if (userCookie) userInfo = JSON.parse(userCookie?.value || '');;

  const mergeData = await getCalendarMerge(userInfo.calendarCode);
  //console.log(mergeData);

  return (
    <div>
      <h1>만날 날짜를 선택하세요</h1>
      <CalendarMerge></CalendarMerge>
    </div>
  );
}