import { API_SCHEDULE_DATA } from "@/app/constants";
import { EventInput } from "@fullcalendar/core";

//개인 일정 정보 저장
const setScheduleData = async (scheduleData: EventInput[], userId: string) => {
  try {
    const response = await fetch(`/api/${API_SCHEDULE_DATA}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateList: JSON.stringify(scheduleData),
        userId: userId
      })
    })

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    const resault = { message: "일정이 저장되었습니다", data: responseData.data };
    if (responseData.status != 200) {
      resault.message = responseData.message;
    }

    return resault;
  } catch (error) {
    console.error('Error registering to calendar:', error);
    throw error;
  }
}

//개인 일정 데이터 조회
const getScheduleData = async(userId: string) => {
  const response = await fetch(`${process.env.BACKEND_SERVER}/${API_SCHEDULE_DATA}/${userId}`);
  const responseData = response.json();
  return responseData;
}

export { setScheduleData, getScheduleData }