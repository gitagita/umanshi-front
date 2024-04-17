"use client";

import { useState } from "react";
import { EventInput, EventClickArg, DateSelectArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setCalendarData } from '@/utils/calendar-data';
import CalendarModal from "@/components/calendar-modal";
import styles from "@/styles/calendar.module.css";

let eventGuid: number = 0;

export default function CalendarRange({ id }: { id: string }) {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [calendarCode, setCalendarCode] = useState<string>(id);
  const [visible, setVisible] = useState(false);

  const filterPassedTime = (time: Date) => {
    const currentDate = new Date(startTime);
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

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

  const handleSelectAllow = (selectInfo: any) => {
    //지난 날 제외
    var now = new Date();
    var yesterday = new Date(now.setDate(now.getDate() - 1));
    if (selectInfo.start <= yesterday) return false;

    // 이미 선택된 날 제외
    let sStart = JSON.stringify(selectInfo.startStr);
    let sEnd = JSON.stringify(selectInfo.endStr);

    if (events.filter((e: EventInput) => {
      let eStart = JSON.stringify(e.start);
      let eEnd = JSON.stringify(e.end);
      return ((eStart <= sStart && eEnd > sStart) || (eStart >= sStart && eStart < sEnd))
    }).length > 0) return false;

    return true;
  }

  const setTimeFormat = (today: Date) => {
    var hours = ('0' + today.getHours()).slice(-2);
    var minutes = ('0' + today.getMinutes()).slice(-2);

    return hours + ':' + minutes;
  }

  //캘린더 정보 저장 api 호출 함수
  const insertCalendarData = async () => {
    const calendarData = {
      events: events,
      times: {
        start: setTimeFormat(startTime),
        end: setTimeFormat(endTime)
      }
    }

    try {
      const result = await setCalendarData(calendarData, calendarCode);
      setVisible(true);
      alert(result.message);
    } catch (error) {
      console.error('Error registering to calendar:', error);
      alert('Failed to register to calendar. Please try again.');
    }
  }

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.datepicker}>
        <DatePicker
          selected={startTime}
          onChange={(date: Date) => setStartTime(date)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={30}
          timeCaption="Time"
          dateFormat="h:mm aa"
        />

        <DatePicker
          selected={endTime}
          onChange={(date: Date) => setEndTime(date)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={30}
          filterTime={filterPassedTime}
          timeCaption="Time"
          dateFormat="h:mm aa"
        />
        <button onClick={insertCalendarData}>결과 저장</button>

        {visible ?
          <CalendarModal id={calendarCode} />
          : <></>
        }
      </div>

      <div className={styles.calendarContainer}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          selectable={true}
          eventClick={handleEventClick}
          select={handleDateSelect}
          selectAllow={handleSelectAllow}
        />
      </div>
    </div >
  );
};