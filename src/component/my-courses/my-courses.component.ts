import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../service/course.service';
import { courseType } from '../../models/courseType';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CourseDetailsDialogComponent } from '../course-details-dialog/course-details-dialog.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { UserService } from '../../service/user.service';


@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule, MatCardModule, MatGridListModule],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css'
})
export class MyCoursesComponent implements OnInit {
  courses$ = new BehaviorSubject<courseType[]>([]);
  enrolledCourses: Set<number> = new Set(); // Set to track enrolled courses

  constructor(private courseService: CourseService, public dialog: MatDialog, private userService: UserService) { }

  ngOnInit(): void {
    this.loadCourses();
    this.loadEnrolledCourses(); // Load the courses the user is enrolled in
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe(courses => {
      this.courses$.next(courses);
    });
  }
  loadEnrolledCourses(): void {
    this.userService.user$.subscribe(user => {
      if (user && user.id) { // Check if user and user.id are defined
        const studentId: string = user.id.toString(); // Convert to string if necessary
        this.courseService.getCoursesByStudentId(studentId).subscribe(
          (enrolledCourses: courseType[]) => {
            enrolledCourses.forEach(course => this.enrolledCourses.add(course.id));
          },
          (error) => {
            console.error('Error loading enrolled courses:', error);
          }
        );
      } else {
        console.error('User not found or user ID is undefined. Cannot load enrolled courses.');
      }
    });
  }
  

  joinCourse(course: courseType): void {
    this.courseService.enrollInCourse(course.id).subscribe(() => {
      this.enrolledCourses.add(course.id);
      console.log(`Joined course: ${course.title}`);
    });
  }

  leaveCourse(course: courseType): void {
    this.courseService.leaveCourse(course.id).subscribe(() => {
      this.enrolledCourses.delete(course.id);
      console.log(`Left course: ${course.title}`);
    });
  }

  openCourseDetails(course: courseType): void {
    this.dialog.open(CourseDetailsDialogComponent, {
      data: course
    });
  }
}
