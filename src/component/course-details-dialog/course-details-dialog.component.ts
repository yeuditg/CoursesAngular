 import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { courseType } from '../../models/courseType';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-course-details-dialog',
  standalone: true,
  imports: [MatDialogModule, MatTableModule, FormsModule, CommonModule, MatCardModule, MatIconModule],
  templateUrl: './course-details-dialog.component.html',
  styleUrls: ['./course-details-dialog.component.css']
})
export class CourseDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CourseDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: courseType
  ) { }

  close(): void {
    this.dialogRef.close();
  }

  getLessonsTitles(): string {
    return this.data.lessons.map(lesson => lesson.title).join(', ');
  }
  downloadMaterials(lesson: any): void {
    const content = lesson.content; // תוכן השיעור
    const blob = new Blob([content], { type: 'text/plain' }); // יצירת Blob מהתוכן
    const url = window.URL.createObjectURL(blob); // יצירת URL מה-BLOB
    const link = document.createElement('a'); // יצירת אלמנט <a>
    link.href = url;
    link.download = `${lesson.title}.txt`; // שם הקובץ שיורד
    link.click(); // לחיצה על הקישור להורדה
    window.URL.revokeObjectURL(url); // ניקוי ה-URL
  }

}

