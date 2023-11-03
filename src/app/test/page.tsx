"use client"
// pages/schedule.tsx
import React, { useState, useEffect } from 'react';

const getWeekDates = (inputDate: Date): Date[] => {
  const currentDate = new Date(inputDate);
  const dayOfWeek = currentDate.getDay();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
  let week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i);
    week.push(new Date(currentDay));
    console.log(`${i} - ${week[i]}`);
  }
  return week;
}


const formatDateToDDMMYYYY = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Месяцы начинаются с 0
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

const getDayFromDate = (date: string): string => {
  return date.split("-")[0];
}

const getMonthFromDate = (date: string): string => {
  return date.split("-")[1];
}

const getYearFromDate = (date: string): string => {
  return date.split("-")[2];
}

const getShortTime = (time: string): string => {
  return `${time.split(":")[0]}:${time.split(":")[1]}`;
}

// @ts-ignore
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

interface Organizer {
  id: number;
}

interface Type {
  id: number;
  name: string;
}

interface Auditorium {
  id: number;
  name: string;
}

interface Event {
  id: number;
  name: string;
  organizer: Organizer;
  type: Type;
  amount_people: number;
  date: string;
  start_time: string;
  end_time: string;
  auditorium: Auditorium[];
  info: string;
}

interface Schedule {
  start_week: string;
  end_week: string;
  results: Event[];
}

interface UniversityUnit {
  id: number;
  name: string;
  abbreviation: string;
  show_in_timetable: boolean;
  default_show: boolean;
}

interface AuditoriumsInfo {
  id: number;
  name: string;
  university_unit: number;
  area: number;
  capacity: number;
  type: number;
  building: number;
}

const options = {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
};

const SchedulePage = (locales?: string | string[], options?: Intl.DateTimeFormatOptions) => {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const apiUrl = process.env.URL_API_SHEDULE;
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        // @ts-ignore
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setSchedule(jsonData as Schedule);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchData();
  }, []);
  const [auditoriums, setAuditoriums] = useState<AuditoriumsInfo[]|null>(null);
  const apiURL_auditorium = process.env.URL_API_AUDITORIUM;
  console.log(apiURL_auditorium);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        // @ts-ignore
        const response = await fetch((apiURL_auditorium));
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(response);
        const jsonData = await response.json();
        console.log(jsonData);
        setAuditoriums(jsonData as AuditoriumsInfo[]);
      }
      catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };
    fetchData();
  }, []);

  const [university_unit, setUniversityUnit] = useState<UniversityUnit[] |null>(null);
  const apiURL_university_unit = process.env.URL_API_UNIVERSITYUNIT;
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        // @ts-ignore
        const response = await fetch(apiURL_university_unit);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setUniversityUnit(jsonData as UniversityUnit[]);
      }
      catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };
    fetchData();
  }, []);

  let defaultValueUniversityUnit = 1;
  if (university_unit) {
    defaultValueUniversityUnit = university_unit[0].id;
  }
  const [selectUniversityUnit, setSelectUniversityUnit] = useState<string|null>(String(defaultValueUniversityUnit));
  const handleSelectUniversityUnit = (event: any) => {
    setSelectUniversityUnit(event.target.value);
  }

  const hanldeViewButton = () => {
    if (!university_unit) return;
    let unit = university_unit.find(el => el.id == Number(selectUniversityUnit));
    if (!unit) {
      console.error(`Error to get UniversityUnit object by id: ${selectUniversityUnit}`);
      return;
    }
    const week = getWeekDates(dateCalendar);
    console.log(selectUniversityUnit);
    console.log(unit);
    console.log(dateCalendar);
    console.log(week);

  }

  const [dateCalendar, setDateCalendar] = useState<Date>(new Date());
  const dateCalendarHandler = (element: any) => {
    try {
      const date = new Date(element.target.value);
      console.log("Date: " + date);
      setDateCalendar(date);
    }
    catch (error) {
      console.error(`Error to get date calendar: ${error}`);
      setDateCalendar(new Date());
    }
  }

  // @ts-ignore
  const start_week = new Date(schedule?.start_week);
  // @ts-ignore
  const end_week = new Date(schedule?.end_week);
  let week: Date[] = [];
  for (let cur = start_week; cur<=end_week; cur.setDate(cur.getDate() + 1)) {
    week.push(new Date(cur));
    console.log(cur);
  }
  // @ts-ignore
  return (
    <div className={"container-xxl"}>
      <h2 className={"text-center"}>Расписание</h2>
      {schedule && auditoriums && university_unit ?  (
        <div>
          <div className={"row align-items-center"}>
            <div className={"col"}>
              <select onChange={handleSelectUniversityUnit} onLoadedData={handleSelectUniversityUnit}>
                {university_unit?.map((unit) => (
                    <>
                      <option value={unit.id}>{unit.name}</option>
                    </>
                ))}
              </select>
            </div>
            <div className={"col"}>
              <input type={"date"} defaultValue={new Date().toDateInputValue()} onChange={dateCalendarHandler}></input>
            </div>
            {/*<div className={"col"}>*/}
            {/*  <label className={"col-form-label"}><input type={"checkbox"} defaultChecked={true}/><b> На всю неделю</b></label>*/}
            {/*</div>*/}
            <div className={"col"}>
              <button className={"btn btn-success"} onClick={hanldeViewButton}>Показать</button>
            </div>
          </div>

          <br/>
          <p>Start Week: { start_week.toDateString()}</p>
          <p>End Week: {end_week.toDateString()}</p>
          <ul>
            {university_unit?.map((unit) => (
                <li key={unit.id}>{unit.name}</li>
            ))}
          </ul>
          <table className={"table table-bordered border-5 border-dark"}>
            <thead>
              <tr>
                <th className={"text-center"}>Дни недели</th>
                {auditoriums.map((aud) => (
                    <th key={aud.id} className={"text-center"}>{aud.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
            {week.map((day) => (
                <>
                <tr>
                  <td>{day.toLocaleDateString("ru-RU", options)}</td>
                  {auditoriums.map((aud) => (
                      <>
                      <td>
                        <table className={"table table-bordered border-3"}>
                          {schedule.results.map((item) => (
                              <>
                              {
                                item.auditorium[0].id == aud.id &&
                                getDayFromDate(formatDateToDDMMYYYY(day)) == item.date.split("-")[0] &&
                                getMonthFromDate(formatDateToDDMMYYYY(day)) == item.date.split("-")[1] &&
                                getYearFromDate(formatDateToDDMMYYYY(day)) == item.date.split("-")[2] ? (
                                  <tr>
                                    <td className={"text-center"}>
                                      {item.name} <br/>
                                      {getShortTime(item.start_time)} - {getShortTime(item.end_time)}<br/>
                                    </td>
                                  </tr>
                              ) : (
                                  <></>
                              )}
                          </>
                              ))}
                        </table>
                      </td>
                      </>
                  ))}
                </tr>
                </>
            ))}

            </tbody>
          </table>
        </div>

      ) : (
        <p>Loading schedule...</p>
      )}
    </div>
  );
};

export default SchedulePage;
