import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white shadow sm:rounded-lg p-6">
      <h2 class="text-lg font-semibold mb-4">Today's Summary</h2>
      <div class="flex flex-col">
        <div class="-m-1.5 overflow-x-auto">
          <div class="p-1.5 min-w-full inline-block align-middle">
            <div class="overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Visits Today</th>
                    <th class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr *ngFor="let employee of employees" class="hover:bg-gray-100">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {{employee.name}}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {{employee.visit_count || 0}}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                      <button
                        (click)="recordVisit(employee.id)"
                        class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        Record Visit
                      </button>
                    </td>
                  </tr>
                  <tr *ngIf="employees.length === 0">
                    <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">
                      No employees added yet
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployeeListComponent {
  @Input() employees: Employee[] = [];
  @Output() visitRecorded = new EventEmitter<void>();

  constructor(private employeeService: EmployeeService) {}

  recordVisit(employeeId: number) {
    this.employeeService.recordVisit(employeeId).subscribe(() => {
      this.visitRecorded.emit();
    });
  }
}