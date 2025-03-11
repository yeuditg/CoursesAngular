import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { courseType } from '../../models/courseType';
import { CourseService } from '../../service/course.service';
import { LessonService } from '../../service/lesson.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { CourseEditComponent } from '../course-edit/course-edit.component';
import { CourseDetailsDialogComponent } from '../course-details-dialog/course-details-dialog.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses$ = new BehaviorSubject<courseType[]>([]);

  constructor(private courseService: CourseService, private lessonService: LessonService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    console.log('loadCourses');
    this.courseService.getCourses().subscribe(courses => {
      this.courses$.next(courses);
      courses.forEach(course => this.loadLessons(course.id));
    });
  }

  loadLessons(courseId: number): void {
    this.lessonService.getLessons(courseId).subscribe(lessons => {
      const course = this.courses$.getValue().find(c => c.id === courseId);
      if (course) {
        course.lessons = lessons; // עדכון השיעורים של הקורס
        this.courses$.next(this.courses$.getValue()); // עדכון ה-BehaviorSubject
      }
    });
  }

  openDialog(course?: courseType): void {
    const dialogRef = this.dialog.open(CourseEditComponent, {
      data: course || { lessons: [] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.courseService.updateCourse(result.id, result, result.lessons).subscribe(() => {
            this.loadCourses(); // טען מחדש את הקורסים
          });
        } else {
          
            this.courseService.createCourse(result,result.lessons).subscribe(() => {
              this.loadCourses();
            });
          
        }
      }
    });
  }

  openCourseDetails(course: courseType): void {
    const dialogRef = this.dialog.open(CourseDetailsDialogComponent, {
      data: course
    });
  }

  deleteCourse(id: number): void {
    this.courseService.deleteCourse(id).subscribe(() => {
      this.loadCourses();
    });
  }
}
