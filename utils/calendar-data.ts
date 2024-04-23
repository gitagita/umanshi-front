import { API_CALENDAR_DATA, API_CALENDAR_MERGE } from "@/app/constants";
import { EventInput } from "@fullcalendar/core";

interface CalendarDataProps {
  events: EventInput[],
  times: {
    start: string,
    end: string
  }
}

// 캘린더 일정 범위 설정
const setCalendarData = async (calendarData: CalendarDataProps, calendarCode: string) => {
  try {
    const response = await fetch(`/api/${API_CALENDAR_DATA}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateList: JSON.stringify(calendarData),
        calendarCode: calendarCode
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    if (responseData.status == 200) {
      responseData.message = "팀원들에게 링크를 공유하세요";
    }

    return responseData;
  } catch (error) {
    console.error('Error registering to calendar:', error);
    throw error;
  }
}

// 캘린더 일정 데이터 조회
const getCalendarData = async (calendarCode: string) => {
  const response = await fetch(`${process.env.BACKEND_SERVER}/${API_CALENDAR_DATA}/${calendarCode}`);
  const responseData = response.json();
  return responseData;
}

// 캘린더에 속한 사용자 정보 조회
const getCalendarMerge = async (calendarCode: string) => {
  const response = await fetch(`${process.env.BACKEND_SERVER}/${API_CALENDAR_MERGE}/${calendarCode}`);
  const responseData = response.json();
  return responseData;
}

export { setCalendarData, getCalendarData, getCalendarMerge }