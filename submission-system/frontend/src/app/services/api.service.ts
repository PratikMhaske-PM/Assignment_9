import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Submission } from '../models/submission.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  createSubmission(data: Partial<Submission>): Observable<Submission> {
    return this.http.post<Submission>(`${this.baseUrl}/submissions/`, data);
  }

  getSubmissions(): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${this.baseUrl}/submissions/`);
  }
}
