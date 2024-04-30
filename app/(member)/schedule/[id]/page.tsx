import { Suspense } from "react";
import ScheduleData from "@/components/schedule-data";
import { cookies } from "next/headers";
import { checkUserCalendar } from '@/utils/schedule-data';
import { redirect } from 'next/navigation';

interface iParams { params: { id: string } }
export default async function SchedulePage({ params: { id } }: iParams) {
  const userCookie = cookies().get("user");
  let userInfo = { userId: '', nickname: '', calendarCode: '', calendarNm: '', isLeader: '' };
  if (userCookie) userInfo = JSON.parse(userCookie?.value || '');;

  const check = await checkUserCalendar(id, userInfo.calendarCode);
  if (!check.success) {
    redirect('/');
  }

  return (
    <div>
      <h1>가능한 시간을 설정하세요.</h1>
      <Suspense fallback={<h1>Loading calendar info</h1>}>
        <ScheduleData params={{ id: id, calendarCode: userInfo.calendarCode }} />
      </Suspense>
    </div >
  );
}