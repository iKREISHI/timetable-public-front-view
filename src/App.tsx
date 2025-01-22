import React, {ChangeEvent, useEffect, useState} from 'react';
import {
    formatDateToDDMMYYYY,
    formatDateToStrUrl,
    getDayFromDate,
    getMonthFromDate,
    getShortTime,
    getWeekDates,
    getYearFromDate,
    options,
    toDateInputValue,
} from './dateUtils';

import {Auditorium, AuditoriumsInfo, Event, Schedule, UniversityUnit,} from './interfaces';

const App: React.FC = () => {
    const [apiUrlSchedule, setApiUrlSchedule] = useState<string | undefined>(
        process.env.REACT_APP_URL_API_SHEDULE
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [apiURLAuditorium, setApiUrlAuditorium] = useState<string | undefined>(
        process.env.REACT_APP_URL_API_AUDITORIUM
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [apiURLUniversityUnit, setApiUrlUniversityUnit] = useState<string | undefined>(
        process.env.REACT_APP_URL_API_UNIVERSITY_UNIT
    );
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [auditoriums, setAuditoriums] = useState<AuditoriumsInfo[] | null>(null);
    const [allowAuditoriums, setAllowAuditoriums] = useState<AuditoriumsInfo[] | null>(null);
    const [universityUnit, setUniversityUnit] = useState<UniversityUnit[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [apiScheduleItem, setApiScheduleItem] = useState<string | null>(
        process.env.REACT_APP_URL_API_SCHEDULE_ITEM || null
    );
    const URL_ROOT = process.env.REACT_APP_API_SOURCE;

    const handlePageClick = () => {
        if (showModalInfo) handleCloseModalInfo();
    }

    console.log("apiUrlSchedule", apiUrlSchedule);
    console.log("apiURLAuditorium", apiURLAuditorium);
    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const response = await fetch(apiURLAuditorium!);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const jsonData = await response.json();
                setAuditoriums(jsonData as AuditoriumsInfo[]);
                setAllowAuditoriums(jsonData as AuditoriumsInfo[]);
            } catch (error) {
                console.error('Error fetching schedule:', error);

            }
        };
        fetchData();
    }, [apiURLAuditorium]);
    console.log("auditoriums:", auditoriums);

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const response = await fetch(apiURLUniversityUnit!);
                console.log(response);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const jsonData = await response.json();
                let data = jsonData as UniversityUnit[];
                data.sort((a, b) => a.id - b.id);
                console.log('sorted: ', data);
                setUniversityUnit(data);
            } catch (error) {
                console.error('Error fetching schedule:', error);
            }
        };
        fetchData();
    }, [apiURLUniversityUnit]);
    console.log("apiURLUniversityUnit", apiURLUniversityUnit);
    let defaultValueUniversityUnit = 1;
    if (universityUnit) {
        defaultValueUniversityUnit = universityUnit[0].id;
    }
    const [selectUniversityUnitStr, setSelectUniversityUnitStr] = useState<string | null>(
        String(defaultValueUniversityUnit)
    );
    const [selectUniversityUnit, setSelectUniversityUnit] = useState<UniversityUnit | null>(
        universityUnit?.find((el) => el.id === defaultValueUniversityUnit) || null
    );
    const [week, setWeek] = useState<Date[]>(getWeekDates(new Date()));
    const [dateCalendar, setDateCalendar] = useState<Date>(new Date());
    const [showModalInfo, setShowModalInfo] = useState<boolean>(false);
    const [modalInfo, setModalInfo] = useState<Event | null>(null);
    const [modalInfoUrl, setModalInfoUrl] = useState<string>("");

    // const handleSelectUniversityUnit = (event: ChangeEvent<HTMLSelectElement>) => {
    //     setSelectUniversityUnitStr(event.target.value);
    // };

    const getScheduleByApi = async (url: string = apiUrlSchedule || ''): Promise<void> => {
        try {
            setLoading(true);
            setSchedule(null);
            const response = await fetch(url);
            console.log("response", response);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const jsonData = await response.json();
            setSchedule(jsonData as Schedule);

            // @ts-ignore
            window.DOIT();

            setAuditoriumSchedule();
        } catch (error) {
            console.error('Error fetching schedule:', error);
        } finally {
            setLoading(false);
            console.log('schedule:', schedule);
        }
    };


    const dateCalendarHandler = (element: ChangeEvent<HTMLInputElement>) => {
        try {
            const date = new Date(element.target.value);
            console.log('Date: ' + date);
            setDateCalendar(date);
        } catch (error) {
            console.error(`Error to get date calendar: ${error}`);
            setDateCalendar(new Date());
        }
    };

    const checkAuditoriumSchedule = (aud: Auditorium) => {
        return !(
            schedule?.results.find((el) => {
                if (Array.isArray(el.auditorium) && el.auditorium.length > 0) {
                    return el.auditorium[0].id === aud.id;
                }
                return false;
            }) === undefined
        );
    };

    const setAuditoriumSchedule = () => {
        let unit = universityUnit?.find((el) => el.id === Number(selectUniversityUnitStr));
        if (!unit) {
            console.error(`Error to get UniversityUnit object by id: ${selectUniversityUnitStr}`);
            return;
        }
        setSelectUniversityUnit(unit);
        let auds: AuditoriumsInfo[] = [];
        console.log("Check 1: ", schedule);
        auditoriums?.forEach((element) => {
            if (element.university_unit === unit?.id) {
                console.log("Check: ", checkAuditoriumSchedule(element), element.name);
                auds.push(element);
            }
        });
        console.log('auds:', auds);
        setAllowAuditoriums(auds);
    }

    const hanldeViewButton = () => {
        if (!universityUnit) return;
        let unit = universityUnit.find((el) => el.id === Number(selectUniversityUnitStr));
        if (!unit) {
            console.error(`Error to get UniversityUnit object by id: ${selectUniversityUnitStr}`);
            return;
        }
        setSelectUniversityUnit(unit);
        setLoading(true);
        const current_week = getWeekDates(dateCalendar);
        setWeek(current_week);
        console.log('week:', week);

        console.log("-- selectUniversityUnit: ", selectUniversityUnit);
        console.log("-- allow auds: ", allowAuditoriums);
        let url_week = process.env.REACT_APP_URL_API_SHEDULE_WEEK!;
        console.log("url_week: ", url_week);
        const setBooking = `${formatDateToStrUrl(current_week[0])}-${formatDateToStrUrl(
            current_week[6]
        )}/?format=json`;
        console.log(setBooking);
        url_week = url_week + setBooking;
        console.log('url_week:', url_week);
        setApiUrlSchedule(url_week);
        setAuditoriumSchedule();
        console.log('Api: ', apiUrlSchedule);
        getScheduleByApi(url_week);


        setLoading(false);
    };

    const getScheduleItemInfo = (url: string): Promise<any> => {
        return fetch(url)
            .then((response) => {
                console.log("response", response);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((jsonData) => {
                setModalInfo(jsonData as Event);
                return jsonData as Event;
            })
            .catch((error) => {
                console.error('Error fetching schedule:', error);
            })
            .finally(() => {
                console.log('schedule item:', modalInfo);
            });
    };

    useEffect(() => {
        getScheduleItemInfo(modalInfoUrl)
            .then((data) => {
                setModalInfo(data);
            });
    }, [modalInfoUrl]);
    const handleCloseModalInfo = () => {
        setShowModalInfo(false);
    }
    const handleShowModalInfo = (item_id: Number) => {

        let url = apiScheduleItem + String(item_id) + "/?format=json";
        setModalInfoUrl(url);
        console.log("Item ID = ", item_id, url);
        getScheduleItemInfo(url).then(r => {
            console.log("Item item", r);
            setModalInfo(r)
        });
        console.log("Item schedule", modalInfo);

        setShowModalInfo(true);
    }

    const setScheduleItemColor = (id: number): string => {
        const item = schedule?.results.find((el) => el.id === id);
        if (!item) {
            return "";
        }
        let today = new Date();
        let day = new Date(`${item.date.split("-").reverse().join("-")}T00:00:00`);
        today.setHours(0, 0, 0, 0);

        if (day.getTime() > today.getTime()) {
            return "#d1e7dd";
        } else if (day.getTime() < today.getTime()) {
            return "#e2e3e5";
        } else {
            return "#f8d7da";
        }
    };

    return (
        <div>
            <br/>
            {auditoriums && universityUnit ? (
                <div className="d-flex align-items-center">
                    <div className="ms-auto mb-2">
                        <div className="input-group">
                            <input type="date" className="form-control" defaultValue={toDateInputValue(new Date())}
                                   onChange={dateCalendarHandler}
                                   style={{fontSize: '15px', width: '35vw', height: '30px'}}/>
                            <span className="input-group-btn">
                                <button className="btn btn-success" onClick={hanldeViewButton}
                                        style={{fontSize: '15px', height: '30px'}}>
                                    Показать
                                </button>
                            </span>
                        </div>
                    </div>
                </div>

            ) : (
                <p>Loading...</p>
            )}
            {schedule && auditoriums && universityUnit && !loading ? (
                <div className="block" style={{overflowY: 'scroll'}}>
                    <br/>
                    <table className="table"
                           style={{borderCollapse: 'separate', borderSpacing: '0 1em'}}>
                        <thead>
                        <tr>
                            <th className="text-center" style={{width: '7%', fontSize: '11px', lineHeight: '1.2'}}
                                align="center">
                                Дни недели
                            </th>
                            {allowAuditoriums?.map((aud) =>
                                aud.university_unit === selectUniversityUnit?.id && checkAuditoriumSchedule(aud) ? (
                                    <th key={aud.id} align="center" style={{fontSize: '14px'}}>{aud.name}</th>
                                ) : null
                            )}
                        </tr>
                        </thead>
                        <tbody style={{fontSize: '2xl'}}>
                        {week.map((day) => (
                            <tr key={day.toDateString()}>
                                <td>
                                    <span style={{lineHeight: '1.2'}}>{day.toLocaleDateString('ru-RU', options)}</span>
                                </td>
                                {allowAuditoriums?.map((aud) =>
                                    checkAuditoriumSchedule(aud) ? (
                                        <td key={aud.id}>
                                            <table className="table table-bordered border-2">
                                                <tbody>
                                                {schedule?.results.map(
                                                    (item) =>
                                                        Array.isArray(item.auditorium) &&
                                                        item.auditorium.length > 0 &&
                                                        item.auditorium[0].id === aud.id &&
                                                        getDayFromDate(formatDateToDDMMYYYY(day)) === item.date.split('-')[0] &&
                                                        getMonthFromDate(formatDateToDDMMYYYY(day)) === item.date.split('-')[1] &&
                                                        getYearFromDate(formatDateToDDMMYYYY(day)) === item.date.split('-')[2] ? (
                                                            <tr key={item.id}>
                                                                <td style={{backgroundColor: `${setScheduleItemColor(Number(item.id))}`}}
                                                                    className="text-center" id={String(item.id)}
                                                                    onClick={() => handleShowModalInfo(Number(item.id))}
                                                                    align="center">
                                                                     <span
                                                                         style={{lineHeight: '1.2'}}>{item.name}<br/>{getShortTime(item.start_time)} - {getShortTime(item.end_time)}<br/></span>
                                                                </td>
                                                            </tr>
                                                        ) : null
                                                )}
                                                </tbody>
                                            </table>
                                        </td>
                                    ) : null
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : null}
            <div className="modal" style={{display: showModalInfo ? 'block' : 'none'}}>
                <div className="modal-dialog modal-xl">
                    <div className="modal-content" style={{fontSize: '15px'}}>
                        <div className="modal-header" style={{fontSize: '16px'}}>
                            <h5 className="modal-title">{modalInfo?.name}</h5>
                        </div>
                        <div className="modal-body">
                            <p>Тип: {modalInfo?.type.name}</p>
                            <p>Дата: {modalInfo?.date}</p>
                            <p>Время начала: {modalInfo?.start_time.slice(0, -3)}</p>
                            <p>Время окончания: {modalInfo?.end_time.slice(0, -3)}</p>
                            <p>Аудитория: {modalInfo?.auditorium.map((el) => String(el.name) + " ")}</p>
                            <p>Дополнительная информация: {modalInfo?.info}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={handleCloseModalInfo}>Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
