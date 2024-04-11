"use client";

import { useState } from "react";
import { EventInput, EventClickArg, DateSelectArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

let eventGuid: number = 0;

export default function CalendarRange() {
  const [events, setEvents] = useState<EventInput[]>([]);

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

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        selectable={true}
        eventClick={handleEventClick}
        select={handleDateSelect}
        selectAllow={handleSelectAllow}
      />
    </>
  );
};