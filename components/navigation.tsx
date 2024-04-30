import Link from "next/link";
import { cookies } from "next/headers";
import style from "@/styles/global.module.css";

export default function Navigation() {
  const userCookie = cookies().get("user");
  let userInfo = { userId: '', calendarNm: '', nickname: '', calendarCode: '' };
  if (userCookie) userInfo = JSON.parse(userCookie?.value || '');

  return (
    <ul className={style.navigation}>
      <li>
        <Link href="/">Home</Link>
      </li>
      {
        userInfo.userId != '' ?
          <li>
            <Link href={`/schedule/${userInfo.userId}`}>가능 일정 설정</Link>
          </li>
          : null
      }
      {
        userInfo.calendarCode != '' ?
        <li>
          <Link href={`/calendar/${userInfo.calendarCode}`}>캘린더 현황</Link>
        </li>
        : null
      }
      {
        userInfo.calendarCode != '' ?
        <li>
          <Link href={`/votes/${userInfo.calendarCode}`}>투표 하기</Link>
        </li>
        : null
      }
    </ul>
  );
}