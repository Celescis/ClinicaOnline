import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayDate',
})
export class DayDatePipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): unknown {
    if(value.seconds) {
      value = new Date(value.seconds * 1000);
    }
    let rtn = value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate();
    if (parseInt(rtn.split('-')[2]) < 10 && parseInt(rtn.split('-')[2]) > 0) {
      rtn = value.getFullYear() + '-' + (value.getMonth() + 1) + '-0' + value.getDate();
    } else {
      rtn = value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate();
    }
    return rtn;
  }
}
