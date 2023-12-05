export interface Organizer {
    id: number;
}

export interface Type {
    id: number;
    name: string;
}

export interface Auditorium {
    id: number;
    name: string;
}

export interface Event {
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

export interface Schedule {
    start_week: string;
    end_week: string;
    results: Event[];
}

export interface UniversityUnit {
    id: number;
    name: string;
    abbreviation: string;
    show_in_timetable: boolean;
    default_show: boolean;
}

export interface AuditoriumsInfo {
    id: number;
    name: string;
    university_unit: number;
    area: number;
    capacity: number;
    type: number;
    building: number;
}