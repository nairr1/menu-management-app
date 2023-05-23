export function formatDayForClient(day: number) {
    let dayString = "";

    switch(day) {
        case(1):
            dayString = "Monday";
            break;
        case(2):
            dayString = "Tuesday";
            break;
        case(3):
            dayString = "Wednesday";
            break;
        case(4):
            dayString = "Thursday";
            break;
        case(5):
            dayString = "Friday";
            break;
        case(6):
            dayString = "Saturday";
            break;
        case(0):
            dayString = "Sunday";
            break;
    }

    return dayString;
}