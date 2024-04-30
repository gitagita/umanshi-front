"use client";

import { useState, useEffect } from "react";
import { DateInput, EventInput } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import styles from "@/styles/calendar.module.css";
import { timeToNum, numToTime } from "@/data/imos-format";

interface UserListParams {
  userId: number,
  userNm: string,
  dateList: string,
  isLeader: number
}
interface eventsType {
  start: string,
  end: string,
  title: string
}
interface iParams { params: { id: string, userList: UserListParams[] } }
export default function CalendarMerge({ params: { id, userList } }: iParams) {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [visible, setVisible] = useState(false);
  const [mergeEvents, setmergeEvents] = useState<eventsType[]>([]);

  useEffect(() => {
    setUserList();
  }, [])

  const setUserList = () => {
    userList.map((ul) => {
      // console.log(ul);
      if (ul.dateList) {
        var dateList = JSON.parse(ul.dateList);

        dateList.map((date: EventInput) => {
          var id = date.id;
          var start = date.start;
          var end = date.end;
          events.push({ id, start, end });
        })
      }
    })

    events.sort((a, b) => new Date(a.start as string).valueOf() - new Date(b.start as string).valueOf()); //이벤트 정렬

    //일정 병합 프로세스
    var TIME_RANGE = 48;
    var imos: number[] = Array.from({ length: TIME_RANGE }, () => 0);
    var tmpDate: string;
    events.map((e, index) => {
      var start = new Date(e.start as string);
      var end = new Date(e.end as string);
      var startDate = setDateFormat(start, 0);
      var startTime = setTimeFormat(start);
      var endTime = setTimeFormat(end);

      if (tmpDate != undefined && ((tmpDate != startDate && imos.length > 0) || index === events.length - 1)) {
        if (index === events.length - 1) {  //마지막 이벤트에 대한 일정 처리
          imos[timeToNum[startTime]] += 1;
          imos[timeToNum[endTime]] -= 1;
        }

        //누적합 계산
        var now = 0;
        imos.map((im, index) => {
          now += im;
          imos[index] = now;
        })

        var count = 0;  //중첩 개수
        var tmpIndex = 0; //중첩 일정 시작 시간
        imos.map((im, index) => {
          if (count != im && count > 0) {
            var tmpEndDate = tmpDate;
            var start = tmpDate + 'T' + numToTime[tmpIndex] + '+09:00';
            var end = tmpEndDate + 'T' + numToTime[index] + '+09:00';
            var title = count + " 명";
            mergeEvents.push({ start, end, title });
          }
          if (count != im) {
            tmpIndex = index;
          }
          count = im;
        })
        imos = Array.from({ length: TIME_RANGE }, () => 0);
      }

      imos[timeToNum[startTime]] += 1;
      imos[timeToNum[endTime]] -= 1;

      tmpDate = startDate;
    })

    setVisible(true);
  }

  const setTimeFormat = (date: Date) => {
    var hour = ('0' + date.getHours()).slice(-2);
    var min = ('0' + date.getMinutes()).slice(-2);
    var sec = ('0' + date.getSeconds()).slice(-2);
    return hour + ':' + min + ':' + sec;
  }

  const setDateFormat = (date: Date, sel: number) => {
    var years = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    date.setDate(date.getDate() + sel);
    var day = ('0' + date.getDate()).slice(-2);
    return years + '-' + month + '-' + day;
  }

  return (
    <div>
      {visible ? <div className={styles.calendarContainer}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
          }}
          events={mergeEvents}
          dayMaxEventRows={true}
        // selectable={true}
        // eventClick={handleEventClick}
        // select={handleDateSelect}
        // selectAllow={handleSelectAllow}
        />
      </div> : <></>}

    </div>
  );
}