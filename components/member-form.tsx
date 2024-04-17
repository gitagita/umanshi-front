"use client"

import { registerToSchedule } from "@/utils/member-register";
import { FormEvent, useState } from "react";
import { useRouter } from 'next/navigation';

export default function MemberForm({ id }: { id: string }) {
  const calendarCode = id;
  const [nickname, setNickname] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const result = await registerToSchedule({ calendarCode, nickname });
      alert(result.message);

      const userId = result.data.userId;
      if(userId) {
        router.push(`/schedule/${userId}`);
      }

      // Additional actions after successful registration
    } catch (error) {
      // Handle error, e.g., display error message
      console.error('Error registering to calendar:', error);
      alert('Failed to register to calendar. Please try again.');
    }
  }

  return (
    <div>
      <h1>팀원들과 일정조율을 시작합니다.</h1>
      <form onSubmit={handleSubmit}>
        <label>
          닉네임 설정
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">START</button>
      </form>
    </div>
  );
}