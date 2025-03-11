import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { courseType } from '../../models/courseType';
import { lessonType } from '../../models/lessonType'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { LessonService } from '../../service/lesson.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.css']
})
export class CourseEditComponent {
  newLesson: lessonType = { title: '', content: '', courseId: this.data.id, id: 0 };
  isDialogVisible: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<CourseEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: courseType,
    private lessonService: LessonService
  ) { }

  onNoClick(): void {
    this.isDialogVisible = false;
    this.dialogRef.close();
  }

  addLesson(): void {
    if (this.newLesson.title && this.newLesson.content) {
      console.log("create edit add:", this.data);
      
      this.lessonService.createLesson(this.data.id, this.newLesson).subscribe(() => {
        this.data.lessons = this.data.lessons || [];
        this.data.lessons.push({ ...this.newLesson, id: this.data.lessons.length + 1 });
        this.newLesson = { title: '', content: '', courseId: this.data.id, id: 0 };
        // Swal.fire({
        //   title: "Success add lesson",
        //   icon: "success",
        //   draggable: true
        // });
      });
    }
  }

  editLesson(lesson: lessonType): void {
    console.log('Editing lesson:', lesson);
    
    this.newLesson = { ...lesson }; // מעתיקים את השיעור לעריכה
    console.log('Editing lesson:', lesson);
  }

  saveLesson(): void {
    console.log('save lesson:', this.newLesson);
    console.log('save lesson data:', this.data);
    const index = this.newLesson.id;
    
  if (this.data && this.data.lessons) {
    if (index !== 0) {
      this.data.lessons[index] = { ...this.newLesson }; // מעדכנים את השיעור ברשימה
      this.lessonService.updateLesson(this.data.id, this.data.lessons[index].id, this.newLesson).subscribe(() => {
        // Swal.fire({
        //   title: "Success update lesson",
        //   icon: "success",
        //   draggable: true
        // });
    })};
    } else {
      this.addLesson();
    }
    this.newLesson = { title: '', content: '', courseId: this.data.id, id: 0 }; // איפוס השיעור
  }

  deleteLesson(lesson: lessonType): void {
    if (this.data && this.data.lessons) {
    const index = this.data.lessons?.findIndex(l => l.id === lesson.id);
    if (index !== -1) {
      this.lessonService.deleteLesson(this.data.id, lesson.id).subscribe(() => {
        this.data.lessons?.splice(index, 1); // מסירים את השיעור מהרשימה
        console.log('Lesson deleted');
      })};
    }
  }
}









