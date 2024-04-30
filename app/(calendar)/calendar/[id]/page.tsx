import CalendarMerge from "@/components/calendar-merge";
import { getCalendarMerge } from "@/utils/calendar-data";
import { cookies } from "next/headers";
import { Suspense } from "react";

interface iParams { params: { id: string } }

export default async function CalendarMergePage({ params: { id } }: iParams) {
  const userCookie = cookies().get("user");
  let userInfo = { userId: '', nickname: '', calendarCode: '', calendarNm: '', isLeader: '' };
  if (userCookie) userInfo = JSON.parse(userCookie?.value || '');;
  const mergeData = await getCalendarMerge(id);

  return (
    <div>
      <h1>만날 날짜를 선택하세요</h1>
      <Suspense fallback={<h1>Loading calendar info</h1>}>
        <CalendarMerge params={{ id: id, userList: mergeData.data.userList }} ></CalendarMerge>
      </Suspense>
    </div>
  );
}