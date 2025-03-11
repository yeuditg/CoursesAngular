import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lessonTitle',
  standalone: true
})
export class LessonTitlePipe implements PipeTransform {
  transform(title: string): string {
    return title.toUpperCase(); // לדוגמה, להפוך את השם לאותיות גדולות
  }
}
