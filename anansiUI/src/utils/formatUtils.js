import moment from 'moment';
export function prettifyTimeStamp(timestamp) {
    if (timestamp) {
        return moment(timestamp).format('YYYY-MM-DD');
    } else {
        return 'N/A';
    }
}
export function getMagIssue(date){
    var dateObj = moment(date, 'YYYY-MM-DD');
    return dateObj.format('MMMM') + ' ' + dateObj.format('YYYY');
}
export function getMovieYear(date){
    var dateObj = moment(date, 'YYYY-MM-DD');
    return dateObj.format('YYYY');
}
