"use client"

import { useState } from "react"
import { EventInput, EventClickArg, DateSelectArg } from "@fullcalendar/core";
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react"
import { setScheduleData } from "@/utils/schedule-data";

let eventGuid: number = 0;

interface SelectInfoParams {
  start: Date, end: Date, startStr: string, endStr: string
}

interface CalendarDataParams {
  events: EventInput[],
  times: {
    start: string,
    end: string
  }
}
interface iParams { params: { id: string, calendarCode: string, dateList: CalendarDataParams } }

export default function ScheduleRange({ params: { id, calendarCode, dateList } }: iParams) {
  const [events, setEvents] = useState<EventInput[]>([]);
  const userId: string = id;

  const addEvents = (id: string, start: string, end: string) => {
    const newEvents: EventInput[] = [...events];
    newEvents.push({ id, start, end });
    setEvents(newEvents);
  };

  const removeEvent = (id: string) => {
    const newEvents: EventInput[] = events.filter(
      (e: EventInput) => e.id != id
    );
    setEvents(newEvents);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    clickInfo.event.remove();
    removeEvent(clickInfo.event.id);
  };

  const createEventId = (): string => {
    return `event${++eventGuid}`;
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const eventId: string = createEventId();
    addEvents(eventId, selectInfo.startStr, selectInfo.endStr);
  }

  const setDateFormat = (date: Date) => {
    var years = date.getFullYear();
    var month = (date.getMonth() + 1) < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    var day = date.getDate() < 9 ? '0' + date.getDate() : date.getDate();

    return years + '-' + month + '-' + day;
  }

  const handleSelectAllow = (selectInfo: SelectInfoParams) => {
    let sStart = JSON.stringify(setDateFormat(selectInfo.start));
    let sEnd = JSON.stringify(setDateFormat(selectInfo.end));

    //캘린더 일정 설정 허용 날짜 및 시간 범위
    if (dateList.events.filter((e: EventInput) => {
      let eStart = JSON.stringify(e.start);
      let eEnd = JSON.stringify(e.end);
      return ((sStart >= eStart) && (sEnd < eEnd))
    }).length > 0) return true;

    return false;
  }

  //일정 정보 저장 api 호출 함수
  const insertScheduleData = async () => {
    try {
      const result = await setScheduleData(events, userId);
      alert(result.message);
    } catch (error) {
      console.error('Error registering to calendar:', error);
      alert('Failed to register to calendar. Please try again.');
    }
  }

  return (
    <div>
      <button onClick={insertScheduleData}>결과 저장</button>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView='timeGridWeek'
        selectable={true}
        events={events}
        eventClick={handleEventClick}
        select={handleDateSelect}
        selectAllow={handleSelectAllow}
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'timeGridWeek,timeGridDay' // user can switch between the two
        }}
        businessHours={{
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
          startTime: dateList.times.start,
          endTime: dateList.times.end
        }}
        selectConstraint='businessHours'
        nowIndicator={true}
      />
    </div>
  );
}