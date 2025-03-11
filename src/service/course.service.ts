import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { baseUrl } from './env';
import { courseType } from '../models/courseType';
import { LessonService } from './lesson.service';
import { lessonType } from '../models/lessonType';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private http: HttpClient, private lessonService: LessonService, private userService: UserService) { }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = localStorage.getItem("authToken");
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getCourses(): Observable<courseType[]> {
    return this.http.get<courseType[]>(`${baseUrl}/courses`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getCourseById(id: number): Observable<courseType> {
    return this.http.get<courseType>(`${baseUrl}/courses/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getCoursesByStudentId(studentId: string): Observable<courseType[]> {
    return this.http.get<courseType[]>(`${baseUrl}/courses/student/${studentId}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }
  createCourse(course: courseType, lessons: lessonType[]): Observable<courseType> {
    return this.http.post<courseType>(`${baseUrl}/courses`, course, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateCourse(id: number, course: courseType, lessons: lessonType[] = []): Observable<courseType> {
    return this.http.put<courseType>(`${baseUrl}/courses/${id}`, course, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

   private deleteLessons(courseId: number): Observable<void[]> {
    // קודם כל, נקבל את כל השיעורים של הקורס
    return this.lessonService.getLessons(courseId).pipe(
      switchMap(lessons => {
        // ניצור מערך של בקשות מחיקה לשיעורים
        const deleteRequests = lessons.map(lesson =>
          this.lessonService.deleteLesson(courseId, lesson.id)
        );
        // נחזיר את התוצאה של כל הבקשות
        return forkJoin(deleteRequests);
      }),
      catchError(this.handleError)
    );
  }

  deleteCourse(id: number): Observable<void> {
    this.deleteLessons(id);
    return this.http.delete<void>(`${baseUrl}/courses/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  enrollInCourse(courseId: number): Observable<any> {
    return new Observable(observer => {
      this.userService.user$.subscribe(user => {
        const userId = user?.id; // קבלת מזהה המשתמש
        if (!userId) {
          observer.error('User ID not found'); // טיפול במקרה שאין מזהה
          return;
        }
        this.http.post(`${baseUrl}/courses/${courseId}/enroll`, { userId }, { headers: this.getHeaders() })
          .pipe(catchError(this.handleError))
          .subscribe(response => {
            observer.next(response);
            observer.complete();
          }, error => {
            observer.error(error);
          });
      });
    });
  }

  leaveCourse(courseId: number): Observable<any> {
    return new Observable(observer => {
        this.userService.user$.subscribe(user => {
            const userId = user?.id; // קבלת מזהה המשתמש
            if (!userId) {
                observer.error('User ID not found'); // טיפול במקרה שאין מזהה
                return;
            }
            this.http.delete(`${baseUrl}/courses/${courseId}/unenroll`, { body: { userId }, headers: this.getHeaders() })
                .pipe(catchError(this.handleError))
                .subscribe(response => {
                    observer.next(response);
                    observer.complete();
                }, error => {
                    observer.error(error);
                });
        });
    });
}


  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error);
  }
}