import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

@Pipe({
  name: 'timeAgo',
  standalone: true,
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '';
    // Cek jika value adalah objek Timestamp Firestore
    const date = value.toDate ? value.toDate() : new Date(value);
    return formatDistanceToNow(date, { addSuffix: true, locale: id });
  }
}
