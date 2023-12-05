export const getWeekDates = (inputDate: Date): Date[] => {
    const currentDate = new Date(inputDate);
    const dayOfWeek = currentDate.getDay();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    let week: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + i);
        week.push(new Date(currentDay));
        // console.log(`${i} - ${week[i]}`);
    }
    return week;
}


export const formatDateToDDMMYYYY = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Месяцы начинаются с 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

export const formatDateToStrUrl = (date: Date): string => {
    const day = date.getDate();
    const month = (date.getMonth() + 1); // Месяцы начинаются с 0
    const year = String(date.getFullYear()).replace("20", "");
    return `${day}_${month}_${year}`
}

export const getDayFromDate = (date: string): string => {
    return date.split("-")[0];
}

export const getMonthFromDate = (date: string): string => {
    return date.split("-")[1];
}

export const getYearFromDate = (date: string): string => {
    return date.split("-")[2];
}

export const getShortTime = (time: string): string => {
    return `${time.split(":")[0]}:${time.split(":")[1]}`;
}

export const toDateInputValue = (date: Date): any => {
    let local = new Date(date);
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
}

export const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
};