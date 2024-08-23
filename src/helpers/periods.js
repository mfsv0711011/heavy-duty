const get24Hours = () => {
    const hoursArray = [];

    for (let i = 0; i < 24; i++) {
        const hour = i < 10 ? '0' + i : i.toString();
        hoursArray.push(`${hour}:00`);
    }

    return hoursArray
}

const get7Days = () => {
    return ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba']
}

const getMonthDays = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    const daysInMonth = new Date(year, month, 0).getDate();

    const daysArray = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const dayString = day < 10 ? '0' + day : day.toString();
        daysArray.push(dayString);
    }

    return daysArray;
}

const get12Months = () => {
    return ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr']
}

export {
    get7Days,
    get12Months,
    get24Hours,
    getMonthDays
}

