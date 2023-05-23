export function formatTimestamp(timestamp: Date) {
    const date = timestamp.toDateString().slice(4);
    const time = timestamp.toTimeString().slice(0, 5);
    const hour = timestamp.getHours();

    let formattedTime = "";

    if (hour === 0) formattedTime = `12${time.slice(2)} AM, ${date}`;
    if (hour < 12 && hour !== 0) formattedTime = `${time.replace(/^0+/, "")} AM, ${date}`;
    if (hour === 12) formattedTime = `12${time.slice(2)} PM, ${date}`;
    if (hour > 12) formattedTime = `${hour - 12}${time.slice(2)} PM, ${date}`;

    return formattedTime;
}