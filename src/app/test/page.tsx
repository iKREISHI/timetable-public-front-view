"use client"
// pages/schedule.tsx
import React, { useState, useEffect } from 'react';

import {
    getWeekDates, formatDateToDDMMYYYY, formatDateToStrUrl,
    getDayFromDate, getMonthFromDate, getYearFromDate,
    getShortTime, options, toDateInputValue
} from "./dateUtils";

import {
    Organizer, Type, Auditorium, Event,
    Schedule, UniversityUnit, AuditoriumsInfo,
} from "./interfaces"

const SchedulePage = () => {

  const [apiUrl_schedule, setApiUrlSchedule] = useState<string|undefined>(process.env.URL_API_SHEDULE);
  const [apiURL_auditorium, setApiUrlAuditorium] = useState<string|undefined>(process.env.URL_API_AUDITORIUM);
  const [apiURL_university_unit, setApiUrlUniversityUnit] = useState<string|undefined>(process.env.URL_API_UNIVERSITYUNIT);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [auditoriums, setAuditoriums] = useState<AuditoriumsInfo[]|null>(null);
  const [allow_auditoriums, setAllowAuditoriums] = useState<AuditoriumsInfo[]|null>(null);
  const [university_unit, setUniversityUnit] = useState<UniversityUnit[] |null>(null);
  const [loading, setLoading] = useState<Boolean>(true);

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
        setAllowAuditoriums(jsonData as AuditoriumsInfo[])
      }
      catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        // @ts-ignore
        const response = await fetch(apiURL_university_unit);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        let data = jsonData as UniversityUnit[];
        data.sort((a, b) => a.id - b.id);
        console.log("sorted: ", data);
        setUniversityUnit(data);
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
  const [selectUniversityUnitStr, setSelectUniversityUnitStr] = useState<string|null>(String(defaultValueUniversityUnit));
  // @ts-ignore
  const [selectUniversityUnit, setSelectUniversityUnit] = useState<UniversityUnit|null>(university_unit?.find(el => el.id == defaultValueUniversityUnit));
  const [week, setWeek] = useState<Date[]>(getWeekDates(new Date()));
  const [dateCalendar, setDateCalendar] = useState<Date>(new Date());


  const handleSelectUniversityUnit = (event: any) => {
    setSelectUniversityUnitStr(event.target.value);
  }


  const getScheduleByApi = async (url= apiUrl_schedule): Promise<void> => {
      try {
        setLoading(true);
        setSchedule(null);
        // @ts-ignore
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setSchedule(jsonData as Schedule);

      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
      finally {
        if (schedule) {
          setLoading(false);
          console.log("schedule:", schedule);
        }
      }
    };
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
  const hanldeViewButton = () => {
    if (!university_unit) return;
    let unit = university_unit.find(el => el.id == Number(selectUniversityUnitStr));
    if (!unit) {
      console.error(`Error to get UniversityUnit object by id: ${selectUniversityUnitStr}`);
      return;
    }
    setLoading(true);
    //const week = getWeekDates(dateCalendar);
    console.log(selectUniversityUnitStr);
    console.log(unit);
    console.log("DateCalendar:", dateCalendar);
    setSelectUniversityUnit(unit);
    const current_week = getWeekDates(dateCalendar);
    setWeek(current_week);
    console.log(week);
    let auds: AuditoriumsInfo[] = []
    auditoriums?.forEach((element) => {
      if (element.university_unit == unit?.id) {
        auds.push(element);
      }
    });
    console.log("auds:", auds);
    setAllowAuditoriums(auds);
    // console.log(week);

    let url_week = process.env.URL_API_SHEDULE_WEEK;
    const setBooking = `${formatDateToStrUrl(current_week[0])}-${formatDateToStrUrl(current_week[6])}/?format=json`;
    console.log(setBooking);
    url_week = url_week + setBooking;
    console.log("url_week:", url_week);
    setApiUrlSchedule(url_week);


    console.log("Api: ", apiUrl_schedule);
    getScheduleByApi(url_week);
    setLoading(false);
  }



  // @ts-ignore
  return (
    <div className={"container-xxl"}>
      <h2 className={"text-center"}>Расписание</h2>
      {auditoriums && university_unit ? (
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
              <input type={"date"} defaultValue={toDateInputValue(new Date())} onChange={dateCalendarHandler} onInput={dateCalendarHandler}></input>
            </div>
            <div className={"col"}>
              <button className={"btn btn-success"} onClick={hanldeViewButton}>Показать</button>
            </div>
          </div>
      ) : (<>Loading...</>)}
      {schedule && auditoriums && university_unit && !loading ?  (
        <div>


          <br/>
          <p>Start Week: { getWeekDates(dateCalendar)[0].toDateString()}</p>
          <p>End Week: {getWeekDates(dateCalendar)[6].toDateString()}</p>
          <ul>
            {university_unit?.map((unit) => (
                <li key={unit.id}>{unit.name}</li>
            ))}
          </ul>
          <table className={"table table-bordered border-5 border-dark"}>
            <thead>
              <tr>
                <th className={"text-center"}>Дни недели</th>
                {allow_auditoriums?.map((aud) => (
                    aud.university_unit == selectUniversityUnit?.id ? (
                        <>
                          <th key={aud.id} className={"text-center"}>{aud.name}</th>
                        </>
                      ) : (<></>)

                ))}
              </tr>
            </thead>
            <tbody>
            {week.map((day) => (
                <>
                <tr>
                  <td>{day.toLocaleDateString("ru-RU", options)}</td>
                  {allow_auditoriums?.map((aud) => (
                      <>
                      <td>
                        <table className={"table table-bordered border-3"}>
                          {schedule?.results.map((item) => (
                              <>
                              {
                                item.auditorium[0].id == aud.id  &&
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
        <></>
      )}
    </div>
  );
};

export default SchedulePage;
