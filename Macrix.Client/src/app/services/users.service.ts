import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `https://localhost:7105/api`;

  constructor(private readonly httpClient: HttpClient) { }

  getUsers(): Observable<User[]> {
    const url = `${this.apiUrl}/Users`;
    return this.httpClient.get<User[]>(url);
  }

  getUser(userId: string): Observable<User> {
    const url = `${this.apiUrl}/Users/${userId}`;
    return this.httpClient.get<User>(url);
  }

  addUser(user: User): Observable<User> {
    const url = `${this.apiUrl}/Users`;
    return this.httpClient.post<User>(url, user);
  }

  updateUser(userId: string, user: User): Observable<void> {
    const url = `${this.apiUrl}/Users/${userId}`;
    return this.httpClient.put<void>(url, user);
  }

  deleteUser(userId: string): Observable<void> {
    const url = `${this.apiUrl}/Users/${userId}`;
    return this.httpClient.delete<void>(url);
  }

  saveChanges(): Observable<void> {
    const url = `${this.apiUrl}/Users/SaveChanges`;
    return this.httpClient.post<void>(url, null);
  }

  discardChanges(): Observable<void> {
    const url = `${this.apiUrl}/Users/DiscardChanges`;
    return this.httpClient.post<void>(url, null);
  }
}
