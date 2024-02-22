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
    Box,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Input, ModalCloseButton, ModalContent, ModalOverlay,
    Flex, Spacer, Heading, Text
} from '@chakra-ui/react';

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
    const [apiScheduleItem, setApiScheduleItem] = useState<string| null >(
        process.env.REACT_APP_URL_API_SCHEDULE_ITEM || null
    );
    const URL_ROOT = process.env.REACT_APP_API_SOURCE;



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

        <Box>
            <br/>
            {auditoriums && universityUnit ? (
                <Flex alignItems='center'>
                    <Box p='2'>
                        <Heading fontSize='3xl'>{universityUnit[0].name}</Heading>
                    </Box>
                    <Spacer />
                    <Box >
                        <Input type={'date'} defaultValue={toDateInputValue(new Date())} onChange={dateCalendarHandler} fontSize={15} width={"30vw"} height={"30px"}/>
                        <br/>
                        <Button colorScheme="green" onClick={hanldeViewButton} fontSize={15} width={"30vw"} height={"30px"}>
                            Показать
                        </Button>
                    </Box>

                    {/*<ButtonGroup >*/}
                    {/*    */}
                    {/*    */}
                    {/*</ButtonGroup>*/}
                </Flex>
            ) : (
                <>Loading...</>
            )}
            {schedule && auditoriums && universityUnit && !loading ? (
                <Box display='block' overflowY='scroll'>
                    <br/>
                        <Table colorScheme="simple" borderWidth="3px" style={{borderCollapse:"separate", borderSpacing:"0 1em"}}>
                            <Thead>
                                <Tr>
                                    <Th className={'text-center'} width={"7%"} textAlign={"center"} fontSize={11} lineHeight="1.2">
                                        Дни недели
                                    </Th>
                                    {allowAuditoriums?.map((aud) =>
                                        aud.university_unit === selectUniversityUnit?.id && checkAuditoriumSchedule(aud) ? (
                                            <Th key={aud.id} textAlign={"center"} fontSize={14}>
                                                {aud.name}
                                            </Th>
                                        ) : null
                                    )}
                                </Tr>
                            </Thead>
                            <Tbody fontSize='2xl'>
                                {week.map((day) => (
                                    <Tr key={day.toDateString()}>
                                        <Td>
                                            <Text lineHeight="1.2">
                                                {day.toLocaleDateString('ru-RU', options)}
                                            </Text>

                                        </Td>
                                        {allowAuditoriums?.map((aud) =>
                                            checkAuditoriumSchedule(aud) ? (
                                                <Td key={aud.id}>
                                                    <Table variant="simple" colorScheme="simple" >
                                                        <Tbody>
                                                            {schedule?.results.map(
                                                                (item) =>
                                                                    item.auditorium[0].id === aud.id &&
                                                                    getDayFromDate(formatDateToDDMMYYYY(day)) === item.date.split('-')[0] &&
                                                                    getMonthFromDate(formatDateToDDMMYYYY(day)) === item.date.split('-')[1] &&
                                                                    getYearFromDate(formatDateToDDMMYYYY(day)) === item.date.split('-')[2] ? (
                                                                        <Tr key={item.id}>
                                                                            <Td
                                                                                // className={`text-center + ${setScheduleItemColor(Number(item.id))}`}
                                                                                backgroundColor={`${setScheduleItemColor(Number(item.id))}`}
                                                                                className={`text-center`}
                                                                                id={String(item.id)}
                                                                                onClick={() => handleShowModalInfo(Number(item.id))}
                                                                                textAlign={"center"}

                                                                            >
                                                                                <Text lineHeight="1.2">
                                                                                    {item.name} <br />
                                                                                    {getShortTime(item.start_time)} - {getShortTime(item.end_time)}<br />
                                                                                </Text>
                                                                            </Td>
                                                                        </Tr>
                                                                    ) : null
                                                            )}
                                                        </Tbody>
                                                    </Table>
                                                </Td>
                                            ) : null
                                        )}
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                </Box>
            ) : (
                <></>
            )}
            <Modal isOpen={showModalInfo} onClose={handleCloseModalInfo} size={"xl"}>
                <ModalOverlay />
                <ModalContent fontSize={15}>
                    <ModalHeader fontSize={16}>{modalInfo?.name}</ModalHeader>
                    <ModalCloseButton colorScheme="blue" />
                    <ModalBody>
                        <p>Тип: {modalInfo?.type.name}</p>
                        <p>Дата: {modalInfo?.date}</p>
                        <p>Время начала: {modalInfo?.start_time.slice(0, -3)}</p>
                        <p>Время окончания: {modalInfo?.end_time.slice(0, -3)}</p>
                        <p>Аудитория: {modalInfo?.auditorium.map((el) => String(el.name) + " ")}</p>
                        <p>Дополнительная информация: {modalInfo?.info}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleCloseModalInfo} fontSize={15}>
                            Закрыть
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>


        </Box>
    );
};

export default App;
