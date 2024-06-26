import { API_SCHEDULE_DATA } from "@/app/constants";
import { EventInput } from "@fullcalendar/core";

//개인 일정 정보 저장
const setScheduleData = async (scheduleData: EventInput[], userId: string, calendarCode: string) => {
  try {
    const response = await fetch(`/api/${API_SCHEDULE_DATA}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateList: JSON.stringify(scheduleData),
        userId: userId,
        calendarCode: calendarCode
      })
    })

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    if (responseData.status == 200) {
      responseData.message = "일정이 저장되었습니다";
    }

    return responseData;
  } catch (error) {
    console.error('Error registering to calendar:', error);
    throw error;
  }
}

//개인 일정 데이터 조회
const getScheduleData = async(userId: string, calendarCode: string) => {
  const response = await fetch(`${process.env.BACKEND_SERVER}/${API_SCHEDULE_DATA}/${userId}/${calendarCode}`);
  const responseData = response.json();
  return responseData;
}

// 사용자가 속한 캘린더 검사
const checkUserCalendar = async(userId: string, calendarCode: string) => {
  const response = await fetch(`${process.env.BACKEND_SERVER}/${API_SCHEDULE_DATA}/${userId}/check/${calendarCode}`);
  const responseData = response.json();
  return responseData;
}

export { setScheduleData, getScheduleData, checkUserCalendar }