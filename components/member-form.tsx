"use client"

import { registerToSchedule } from "@/utils/member-register";
import { FormEvent, useState } from "react";

export default function MemberForm() {
  const [calendarCode, setCalendarCode] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const message = await registerToSchedule({ calendarCode, nickname });
      alert(message);
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
          그룹코드 입력
          <input
            type="text"
            value={calendarCode}
            onChange={(e) => setCalendarCode(e.target.value)}
          />
        </label>
        <br />
        <label>
          닉네임 설정
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">START</button>
      </form>
    </div>
  );
}