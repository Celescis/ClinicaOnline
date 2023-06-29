import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayWithHour',
})
export class DayWithHourPipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): unknown {
    if (value.seconds) {
      value = new Date(value.seconds * 1000);
    }
    let rtn = '';
    let dia =
      value.getDate() +
      '-' +
      (value.getMonth() + 1) +
      '-' +
      value.getFullYear();
    if (parseInt(dia.split('-')[0]) < 10 && parseInt(dia.split('-')[0]) > 0) {
      dia =
        '0' +
        value.getDate() +
        '-' +
        (value.getMonth() + 1) +
        '-' +
        value.getFullYear();
    }
    let hora =
      value.getHours() + ':' + value.getMinutes() + ':' + value.getSeconds();
    if (parseInt(hora.split(':')[0]) < 10) {
      hora =
        '0' +
        value.getHours() +
        ':' +
        value.getMinutes() +
        ':' +
        value.getSeconds();
    } else {
      hora =
        value.getHours() + ':' + value.getMinutes() + ':' + value.getSeconds();
    }
    if (parseInt(hora.split(':')[1]) < 10) {
      hora =
        hora.split(':')[0] +
        ':0' +
        value.getMinutes() +
        ':' +
        value.getSeconds();
    } else {
      hora =
        hora.split(':')[0] +
        ':' +
        value.getMinutes() +
        ':' +
        value.getSeconds();
    }
    if (parseInt(hora.split(':')[2]) < 10) {
      hora =
        hora.split(':')[0] +
        ':' +
        hora.split(':')[1] +
        ':0' +
        value.getSeconds();
    } else {
      hora =
        hora.split(':')[0] +
        ':' +
        hora.split(':')[1] +
        ':' +
        value.getSeconds();
    }
    rtn = dia + ' (' + hora + ' hs)';
    return rtn;
  }
}
