export function Utils() {

    const days =  [
        {day: "Sunday", abbrev: "Sun"},
        {day: "Monday", abbrev: "Mon"}, 
        {day: "Tuesday", abbrev: "Tues"}, 
        {day: "Wednesday", abbrev: "Wed"}, 
        {day: "Thursday", abbrev: "Thur"}, 
        {day: "Friday", abbrev: "Fri"}, 
        {day: "Saturday", abbrev: "Sat"}
    ];
    const months = [
        { name: "January", days: 31, abbrev: "Jan", month: 0},
        { name: "February", days: 28, abbrev: "Feb", month: 1},
        { name: "March", days: 31, abbrev: "Mar", month: 2},
        { name: "April", days: 30, abbrev: "Apr", month: 3},
        { name: "May", days: 31, abbrev: "May", month: 4},
        { name: "June", days: 30, abbrev: "June", month: 5},
        { name: "July", days: 31, abbrev: "July", month: 6},
        { name: "August", days: 31, abbrev: "Aug", month: 7},
        { name: "September", days: 30, abbrev: "Sep", month: 8},
        { name: "October", days: 31, abbrev: "Oct", month: 9},
        { name: "November", days: 30, abbrev: "Nov", month: 10},
        { name: "December", days: 31, abbrev: "Dec", month: 11}
    ];

    const toLocalIsoString = (dateStr: string) => {
        let date = new Date(dateStr);
        let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        let ISOtime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0,-1); // gets rid of trailing Z

        return ISOtime;
    }

 
    return {
        days,
        months,
        toLocalIsoString
    }
}