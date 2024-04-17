import { API_CALENDAR_DATA } from "@/app/constants";
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
    const resault = { message: "팀원들에게 링크를 공유하세요", data: responseData };
    if (responseData.status != 200) {
      resault.message = responseData.message;
    }

    return resault;
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

export { setCalendarData, getCalendarData }