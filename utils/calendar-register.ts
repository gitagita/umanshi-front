import { API_CALENDAR_REG } from "@/app/constants";

export async function registerToCalendar(data: { calendarName: string; nickname: string }) {
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
    console.log(responseData);
    
    return responseData;
  } catch (error) {
    console.error('Error registering to calendar:', error);
    throw error;
  }
}
  