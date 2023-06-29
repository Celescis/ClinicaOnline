import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date',
})
export class DatePipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): unknown {
    let rtn = value.getHours() + ':' + value.getMinutes();
    if (rtn.split(':')[1] == '0') {
      rtn = rtn + '0';
    }
    if (parseInt(rtn.split(':')[0]) < 10) {
      rtn = '0' + rtn;
    }    
    // rtn = rtn + "hs";
    return rtn;
  }
}
