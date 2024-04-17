import { API_SCHEDULE_CREATE } from "@/app/constants";

export async function registerToSchedule(data: { calendarCode: string; nickname: string }) {
  try {
    const response = await fetch(`/api/${API_SCHEDULE_CREATE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        calendarCode: data.calendarCode,
        userNm: data.nickname,
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    //console.log(responseData);

    if (responseData.status == 200) {
      responseData.message = "팀원들과 일정조율 시작!";
    }

    return responseData;
  } catch (error) {
    console.error('Error registering to calendar:', error);
    throw error;
  }
}