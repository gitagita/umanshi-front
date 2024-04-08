import Link from "next/link";
export const metadata = {
  title: "Home"
}

export default function HomePage() {
  return (
    <div>
      <h1>우리가 만나는 시간</h1>
      <ul>
        <li>
          <Link href="/leader">CREATE</Link>
        </li>
        <li>
          <Link href="/member">START</Link>
        </li>
        <li>
          <Link href="/member/register">JOIN</Link>
        </li>
      </ul>
    </div>
  )
}
