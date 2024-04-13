"use client";

import { useState, FormEvent } from 'react';
import { registerToCalendar } from '@/utils/calendar-register';
import { useRouter } from 'next/navigation';

export default function LeaderForm() {
  const [calendarName, setCalendarName] = useState('');
  const [nickname, setNickname] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const result = await registerToCalendar({ calendarName, nickname });
      alert(result.message);
      
      const calendarCode = result.data.calendarCode;
      if(calendarCode) {
        router.push(`leader/${calendarCode}`);
      }
      
    } catch (error) {
      console.error('Error registering to calendar:', error);
      alert('Failed to register to calendar. Please try again.');
    }
  };

  return (
    <div>
      <h1>일정 조율 시작</h1>
      <form onSubmit={handleSubmit}>
        <label>
          그룹명 설정:
          <input
            type="text"
            value={calendarName}
            onChange={(e) => setCalendarName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          닉네임 설정:
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
