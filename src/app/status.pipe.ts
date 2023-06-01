import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(items, status = ''): unknown{

   if (status=='All') {
    return items
    }
    if (!status) {
    return items
    }
    return items.filter(items => {

      return items.process.toLowerCase()==status.toLowerCase()
    })
  }

}
