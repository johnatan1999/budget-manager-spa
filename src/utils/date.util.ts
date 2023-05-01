export default class DateUtil {
    
    static compareDate(date, date2) {
        const d = new Date(date).getTime();
        const d2 = new Date(date2).getTime();
        if(d < d2) return -1;
        else if(d > d2) return 1;
        return 0;
    }

    static getTimeOfDay(date: Date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        return `${hours > 9 ? hours : '0'+hours}:${minutes > 9 ? minutes : '0'+minutes}:${seconds > 9 ? seconds : '0'+seconds}`
    }
    
    static addTimeToDate(date, time): Date {
        const [hours, minutes ] = time.split(":");
        date.setHours(parseInt(hours));
        date.setMinutes(parseInt(minutes));
        return date;
    }

    static compareTransactionDateDesc(t, t2) {
        const d = DateUtil.addTimeToDate(new Date(t.date), t.time).getTime();
        const d2 = DateUtil.addTimeToDate(new Date(t2.date), t2.time).getTime();
        if(d < d2) return 1;
        else if(d > d2) return -1;
        return 0;
    }

}