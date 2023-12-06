import React, { useState, useEffect, ChangeEvent } from 'react';
import {
    getWeekDates,
    formatDateToDDMMYYYY,
    formatDateToStrUrl,
    getDayFromDate,
    getMonthFromDate,
    getYearFromDate,
    getShortTime,
    options,
    toDateInputValue,
} from './dateUtils';

import {
    Organizer,
    Type,
    Auditorium,
    Event,
    Schedule,
    UniversityUnit,
    AuditoriumsInfo,
} from './interfaces';

import {
    Button, Modal
} from "react-bootstrap";

const App: React.FC = () => {
    const [apiUrlSchedule, setApiUrlSchedule] = useState<string | undefined>(
        process.env.REACT_APP_URL_API_SHEDULE
    );
    const [apiURLAuditorium, setApiUrlAuditorium] = useState<string | undefined>(
        process.env.REACT_APP_URL_API_AUDITORIUM
    );
    const [apiURLUniversityUnit, setApiUrlUniversityUnit] = useState<string | undefined>(
        process.env.REACT_APP_URL_API_UNIVERSITY_UNIT
    );
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [auditoriums, setAuditoriums] = useState<AuditoriumsInfo[] | null>(null);
    const [allowAuditoriums, setAllowAuditoriums] = useState<AuditoriumsInfo[] | null>(null);
    const [universityUnit, setUniversityUnit] = useState<UniversityUnit[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [apiScheduleItem, setApiScheduleItem] = useState<string| null >(
        process.env.REACT_APP_URL_API_SCHEDULE_ITEM || null
    );

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

    const handleSelectUniversityUnit = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectUniversityUnitStr(event.target.value);
    };

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

        return !(schedule?.results.find((el) => el.auditorium[0].id === aud.id) === undefined);
    }

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
            const t = async () => {
                await setModalInfo(r)
            };
            t();
        });
        console.log("Item schedule", modalInfo);

        setShowModalInfo(true);
    }

    return (
        <>
            <div className={'container-xxl'}>
                <h2 className={'text-center'}>Расписание</h2>
                {auditoriums && universityUnit ? (
                    <div className={'row align-items-center'}>
                        <div className={'col'}>
                            <select onChange={handleSelectUniversityUnit} value={selectUniversityUnitStr || ''}>
                                {universityUnit?.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={'col'}>
                            <input
                                type={'date'}
                                defaultValue={toDateInputValue(new Date())}
                                onChange={dateCalendarHandler}
                                onInput={dateCalendarHandler}/>
                        </div>
                        <div className={'col'}>
                            <button className={'btn btn-success'} onClick={hanldeViewButton}>
                                Показать
                            </button>
                        </div>
                    </div>
                ) : (
                    <>Loading...</>
                )}
                {schedule && auditoriums && universityUnit && !loading ? (
                    <div>
                        <br/>
                        <table className={'table table-bordered border-2'}>
                            <thead>
                            <tr>
                                <th className={'text-center'}>Дни недели</th>
                                {allowAuditoriums?.map((aud) => aud.university_unit === selectUniversityUnit?.id
                                    && checkAuditoriumSchedule(aud) ? (
                                        <th key={aud.id} className={'text-center'}>
                                            {aud.name}
                                        </th>
                                    ) : null
                                )}
                            </tr>
                            </thead>
                            <tbody>
                            {week.map((day) => (
                                <tr key={day.toDateString()}>
                                    <td>{day.toLocaleDateString('ru-RU', options)}</td>
                                    {allowAuditoriums?.map((aud) => checkAuditoriumSchedule(aud) ? (
                                        <td key={aud.id}>
                                            <table className={'table table-bordered border-3'}>
                                                <tbody>
                                                {schedule?.results.map((item) => item.auditorium[0].id === aud.id &&
                                                    getDayFromDate(formatDateToDDMMYYYY(day)) ===
                                                    item.date.split('-')[0] &&
                                                    getMonthFromDate(formatDateToDDMMYYYY(day)) ===
                                                    item.date.split('-')[1] &&
                                                    getYearFromDate(formatDateToDDMMYYYY(day)) ===
                                                    item.date.split('-')[2] ? (
                                                        <tr key={item.id}>
                                                            <td
                                                                className={'text-center'} id={String(item.id)}
                                                                onClick={() => handleShowModalInfo(Number(item.id))}
                                                            >
                                                                {item.name} <br/>
                                                                {getShortTime(item.start_time)} - {getShortTime(item.end_time)}<br/>
                                                            </td>
                                                        </tr>
                                                    ) : null
                                                )}
                                                </tbody>
                                            </table>
                                        </td>
                                    ):null
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <></>
                )}
            </div>
            <Modal show={showModalInfo} onHide={handleCloseModalInfo}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalInfo?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Тип: {modalInfo?.type.name}</p>
                    <p></p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalInfo}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal></>
    );
};

export default App;
