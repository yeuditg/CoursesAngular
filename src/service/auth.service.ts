import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserType } from '../models/userType';
import { baseUrl } from './env';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ userId: number, role: string, token: string }> {
    return this.http.post<{ userId: number, role: string, token: string }>(`${baseUrl}/auth/login`, { email, password });
  }

  register(user: UserType): Observable<{ userId: number, role: string, token: string }> {
    return this.http.post<{ userId: number, role: string, token: string }>(`${baseUrl}/auth/register`, user);
  }
}