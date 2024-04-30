import Link from "next/link";
import { cookies } from "next/headers";

export const metadata = {
  title: "Home"
}

export default function HomePage() {
  const userCookie = cookies().get("user");
  let userInfo = {userId:'', calendarNm: '', nickname: ''};
  if(userCookie) userInfo = JSON.parse(userCookie?.value || '');
  //console.log(userInfo);

  return (
    <div>
      <h1>우리가 만나는 시간</h1>
      <ul>
        <li>
          <Link href="/leader">CREATE 리더가 캘린더 만들기</Link>
        </li>
      </ul>
      {
        userInfo.userId != ''
          ? <div><h3>이전에 참여한 캘린더가 있습니다</h3>
            <Link href={`/schedule/${userInfo.userId}`}>{userInfo.calendarNm}|{userInfo.nickname}</Link>
          </div>
          : null
      }
    </div>
  )
}
