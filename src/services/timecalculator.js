import { add, str } from 'timelite/time';

export function subDateTime(dt1, dt2) {
    let diff = Math.abs(dt1 - dt2);
    return new Date(diff).toUTCString().split(" ")[4];
}

export function addDateTime(dt1, dt2) {
    dt1 = dt1.toTimeString()[0];
    dt2 = dt2.toTimeString()[0];
    return str(add([dt1, dt2]));
}

export function addTime(t1, t2) {
    return str(add([t1, t2]));
}