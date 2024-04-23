"use client";

import { useState } from "react";
import { EventInput } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import styles from "@/styles/calendar.module.css";

export default function CalendarMerge() {
  const [events, setEvents] = useState<EventInput[]>([]);
  return (
    <div>
      <div className={styles.calendarContainer}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          // selectable={true}
          // eventClick={handleEventClick}
          // select={handleDateSelect}
          // selectAllow={handleSelectAllow}
        />
      </div>
    </div>
  );
}