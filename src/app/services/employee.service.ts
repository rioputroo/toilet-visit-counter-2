import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSummary(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/summary`);
  }

  addEmployee(name: string): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/employees`, { name });
  }

  recordVisit(employeeId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/visits`, { employeeId });
  }
}