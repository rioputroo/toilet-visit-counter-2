import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white shadow sm:rounded-lg mb-6 p-6">
      <h2 class="text-lg font-semibold mb-4">Add New Employee</h2>
      <div class="flex gap-4">
        <input
          type="text"
          [(ngModel)]="employeeName"
          class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          placeholder="Employee name"
        />
        <button
          (click)="onSubmit()"
          class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
        >
          Add Employee
        </button>
      </div>
    </div>
  `
})
export class EmployeeFormComponent {
  @Output() employeeAdded = new EventEmitter<void>();
  employeeName = '';

  constructor(private employeeService: EmployeeService) {}

  onSubmit() {
    if (this.employeeName.trim()) {
      this.employeeService.addEmployee(this.employeeName)
        .subscribe(() => {
          this.employeeAdded.emit();
          this.employeeName = '';
        });
    }
  }
}