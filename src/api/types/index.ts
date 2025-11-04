// Import generated types from OpenAPI
import { components } from './api';

// Export the generated types with friendly names
export type Employee = components['schemas']['Employee'];
export type Project = components['schemas']['Project'];
export type TimeEntry = components['schemas']['TimeEntry'];
export type TimeTrackingData = components['schemas']['TimeTrackingData'];

// Custom types for calculations
export interface ProjectAllocation {
  projectId: number;
  projectName: string;
  totalHours: number;
  employeeCount: number;
  employees: {
    id: number;
    name: string;
    hours: number;
  }[];
}

export interface EmployeeStats {
  id: number;
  name: string;
  totalHours: number;
  projectCount: number;
  averageHoursPerProject: number;
}

export interface DailyTimeTracking {
  date: string;
  totalHours: number;
  employeeCount: number;
  projectCount: number;
}