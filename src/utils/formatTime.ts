export function formatTime(time: string) {
    const hour = Number(time.slice(0, 2));

    if (hour === 0) return `12${time.slice(2)} AM`;
    if (hour < 12 && hour !== 0) return `${time.replace(/^0+/, "")} AM`;
    if (hour === 12) return `12${time.slice(2)} PM`;
    if (hour > 12) return `${hour - 12}${time.slice(2)} PM`;
}