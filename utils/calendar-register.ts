import { API_CALENDAR_REG } from "@/app/constants";

// 캘린더 생성
const registerToCalendar = async (data: { calendarName: string; nickname: string }) => {
  try {
    const response = await fetch(`/api/${API_CALENDAR_REG}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        calendarNm: data.calendarName,
        userNm: data.nickname,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    const resault = { message: "새로운 캘린더를 만들었습니다! 날짜와 시간 범위를 설정해봅시다", data: responseData.data };
    if (responseData.status != 200) {
      resault.message = responseData.message;
    }

    return resault;
  } catch (error) {
    console.error('Error registering to calendar:', error);
    throw error;
  }
}


export { registerToCalendar }