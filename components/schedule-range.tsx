"use client"

import { useEffect, useState } from "react"
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
interface DateListParams {
  id: string,
  date: string,
  check: boolean
}
interface ScheduleParams {
  userNm: string,
  dateList: string
}
interface iParams { params: { id: string, calendarCode: string, dateList: CalendarDataParams, scheduleList: ScheduleParams } }

export default function ScheduleRange({ params: { id, calendarCode, dateList, scheduleList } }: iParams) {
  const [events, setEvents] = useState<EventInput[]>([]);
  const userId: string = id;
  const [eventList, setEventList] = useState<DateListParams[]>([]);
  const [businessStart, setBusinessStart] = useState<string>();
  const [businessEnd, setBusinessEnd] = useState<string>();
  const [visible, setVisible] = useState(false);
  const [scheduleVisible, setScheduleVisible] = useState(false);

  useEffect(() => {
    listEvents();
    listSchedules();
    setTimeData();
  }, []);

  const listEvents = () => {
    let cnt: number = 0;
    if (dateList && dateList.events) {
      dateList.events.map((e: EventInput) => {
        var start = JSON.stringify(e.start);
        var end = JSON.stringify(e.end);
        var date = new Date(start);

        var nextDay = { id: 'date' + cnt, date: e.start as string, check: false };

        while (JSON.stringify(nextDay.date) < end) {
          cnt++;
          eventList.push(nextDay);
          var next = new Date(date.setDate(date.getDate() + 1));
          var nextDay = { id: 'date' + cnt, date: setDateFormat(next), check: false };
        }
      })
    }
    setVisible(true);
  }

  const listSchedules = () => {
    console.log(JSON.parse(scheduleList.dateList));
    if (scheduleList && scheduleList.dateList) {
      const schedule = JSON.parse(scheduleList.dateList);
      setEvents(schedule);

      //일정 체크 표시
      schedule.map((s:EventInput)=> {
        eventList.map((el) => {
          if (!el.check && (el.date == setDateFormat(new Date(s.start as string)))) {
            el.check = true;
          }
        })
      })
    }
    setScheduleVisible(true);
  }

  const setTimeData = () => {
    if (dateList && dateList.times) {
      setBusinessStart(dateList.times.start);
      setBusinessEnd(dateList.times.end);
    }
  }

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

    // 일정 체크 표시 제거
    if (clickInfo.event.start) {
      const cDate = setDateFormat(clickInfo.event.start);
      eventList.map((el) => {
        // console.log(cDate, ' ', el.date);
        if (el.check && (el.date == cDate)) {
          if (events.filter((e: EventInput) => {
            return setDateFormat(new Date(e.start as Date)) == cDate;
          }).length == 1) {
            el.check = false;
          }
          return;
        }
      })
    }
  };

  const createEventId = (): string => {
    return `event${++eventGuid}`;
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const eventId: string = createEventId();
    addEvents(eventId, selectInfo.startStr, selectInfo.endStr);

    //일정 체크 표시
    const sDate = setDateFormat(selectInfo.start);
    eventList.map((el) => {
      if (!el.check && (el.date == sDate)) {
        el.check = true;
      }
    })
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
      const result = await setScheduleData(events, userId, calendarCode);
      alert(result.message);
    } catch (error) {
      console.error('Error registering to calendar:', error);
      alert('Failed to register to calendar. Please try again.');
    }
  }

  return (
    <div>
      {visible ? eventList.map(((event, index) => {
        return <li key={index}>{event.date} {event.check ? '[✔️]' : '[가능 일정 설정 안함]'}</li>
      })) : <></>}
      {scheduleVisible ?
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
              startTime: businessStart,
              endTime: businessEnd
            }}
            selectConstraint='businessHours'
            nowIndicator={true}
          />
        </div>
        : <></>}
    </div>
  );
}