import moment from 'moment';
export function prettifyTimeStamp(timestamp) {
    if (timestamp) {
        return moment(timestamp).format('YYYY-MM-DD');
    } else {
        return 'N/A';
    }
}
