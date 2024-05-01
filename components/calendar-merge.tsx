"use client";

import { useState, useEffect } from "react";
import { DateInput, EventInput } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import styles from "@/styles/calendar.module.css";
import { timeToNum, numToTime } from "@/data/imos-format";
import Modal from 'react-modal';

Modal.setAppElement('body');

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 10
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};
interface UserListParams {
  userId: number,
  userNm: string,
  dateList: string,
  isLeader: number
}
interface userInfo {
  userId: string,
  userNm: string
}
interface eventsType {
  start: string,
  end: string,
  title: string,
  user: userInfo[]
}
interface iParams { params: { id: string, userList: UserListParams[] } }

export default function CalendarMerge({ params: { id, userList } }: iParams) {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [visible, setVisible] = useState(false);
  const [mergeEvents, setMergeEvents] = useState<eventsType[]>([]);
  const [userVisible, setUserVisible] = useState(false);
  const [user, setUser] = useState<userInfo[]>([]);

  useEffect(() => {
    setUserList();
  }, [])

  const setUserList = () => {
    userList.map((ul) => {
      if (ul.dateList) {
        var dateList = JSON.parse(ul.dateList);

        dateList.map((date: EventInput) => {
          var id = date.id;
          var start = date.start;
          var end = date.end;
          var userInfo = { userId: ul.userId, userNm: ul.userNm }
          events.push({ id, start, end, userInfo });
        })
      }
    })

    events.sort((a, b) => new Date(a.start as string).valueOf() - new Date(b.start as string).valueOf()); //이벤트 정렬

    //일정 병합 프로세스
    var TIME_RANGE = 48;
    var imos: number[] = Array.from({ length: TIME_RANGE }, () => 0);
    var tmpDate: string;
    var user: userInfo[] = [];

    events.map((e, index) => {
      var start = new Date(e.start as string);
      var end = new Date(e.end as string);
      var startDate = setDateFormat(start, 0);
      var startTime = setTimeFormat(start);
      var endTime = setTimeFormat(end);
      user.push(e.userInfo);

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
            mergeEvents.push({ start, end, title, user });
          }
          if (count != im) {
            tmpIndex = index;
          }
          count = im;
        })
        imos = Array.from({ length: TIME_RANGE }, () => 0); //imos 배열 초기화
        user = [];  //user 정보 초기화
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

  const openUserList = (eventInfo: EventInput) => {
    setUser(eventInfo.event.extendedProps.user);
    setUserVisible(true);
  }

  const closeUserList = () => {
    setUser([]);
    setUserVisible(false);
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
          // eventMouseEnter={openUserList}
          // eventMouseLeave={closeUserList}
          // selectable={true}
          eventClick={openUserList}
        // select={handleDateSelect}
        // selectAllow={handleSelectAllow}
        />
      </div> : <></>}

      <div>
        <Modal
          isOpen={userVisible}
          onRequestClose={closeUserList}
          style={customStyles}
        >
          <div>
            <h3>가능한 사람들</h3>
            <button onClick={closeUserList}>닫기</button>
            <form>
              {user.map(((u, index) => {
                return <li key={index}>{u.userNm}</li>
              }))}
            </form>
          </div>
        </Modal>
      </div>

    </div>
  );
}