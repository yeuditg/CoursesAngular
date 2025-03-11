import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { lessonType } from '../models/lessonType'; // Import lessonType
import { baseUrl } from './env'; // Assuming you have a base URL defined

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem("authToken");
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getLessons(courseId: number): Observable<lessonType[]> {
    return this.http.get<lessonType[]>(`${baseUrl}/courses/${courseId}/lessons`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
  
  // 2. GET a lesson by ID
  getLessonById(courseId: number, lessonId: number): Observable<lessonType> {
    return this.http.get<lessonType>(`${baseUrl}/courses/${courseId}/lessons/${lessonId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // 3. POST a new lesson
  createLesson(courseId: number, lesson: lessonType): Observable<lessonType> {
    const lessonData = {
      title: lesson.title,
      content: lesson.content,
      courseId: lesson.courseId
  };
  console.log("courseId: "+courseId,lesson,lessonData);
  
    return this.http.post<lessonType>(`${baseUrl}/courses/${courseId}/lessons`, lessonData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // 4. PUT (update) a lesson by ID
  updateLesson(courseId: number, lessonId: number, lesson: lessonType): Observable<lessonType> {
    console.log("מעודכן שיעור עם מזהה קורס:", courseId, "מזהה שיעור:", lessonId, "נתוני שיעור:", lesson);

    // יצירת אובייקט חדש ללא ה-ID
    const lessonData = {
        title: lesson.title,
        content: lesson.content,
        courseId: lesson.courseId
    };

    return this.http.put<lessonType>(`${baseUrl}/courses/${courseId}/lessons/${lessonId}`, lessonData, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
}


  // 5. DELETE a lesson by ID
  deleteLesson(courseId: number, lessonId: number): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/courses/${courseId}/lessons/${lessonId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error);
  }
}
