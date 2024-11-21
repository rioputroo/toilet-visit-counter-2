import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Employee } from './models/employee.model';
import { EmployeeService } from './services/employee.service';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { Subscription, interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    EmployeeFormComponent,
    EmployeeListComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-100">
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4">
          <h1 class="text-3xl font-bold text-gray-900">Toilet Visit Tracker</h1>
        </div>
      </header>

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="space-y-6">
          <app-employee-form (employeeAdded)="loadSummary()"/>
          <app-employee-list [employees]="employees" (visitRecorded)="loadSummary()"/>
        </div>
      </main>
    </div>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  employees: Employee[] = [];
  private updateSubscription?: Subscription;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.setupAutoRefresh();
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  loadSummary() {
    this.employeeService.getSummary().subscribe(data => {
      this.employees = data;
    });
  }

  private setupAutoRefresh() {
    this.updateSubscription = interval(60000).pipe(
      startWith(0),
      switchMap(() => this.employeeService.getSummary())
    ).subscribe(data => {
      this.employees = data;
    });
  }
}