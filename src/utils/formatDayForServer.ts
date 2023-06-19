export function formatDayForServer(day: string) {
    let formattedDay = 0;

    switch(day) {
        case("Monday"):
            formattedDay = 1;
            break;
        case("Tuesday"):
            formattedDay = 2;
            break;
        case("Wednesday"):
            formattedDay = 3;
            break;
        case("Thursday"):
            formattedDay = 4;
            break;
        case("Friday"):
            formattedDay = 5;
            break;
        case("Saturday"):
            formattedDay = 6;
            break;
        case("Sunday"):
            formattedDay = 0;
            break;
    }

    return formattedDay;
}