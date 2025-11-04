// Import generated types from OpenAPI
import { components } from './api';

// Export the generated types with friendly names
// Note: Adjust these based on what's actually in the OpenAPI spec
export type TimeChange = components['schemas']['TimeChange'];
export type TimeChangesResponse = components['schemas']['TimeChangesResponse'];

// If the API returns a simple array, use this:
export type TimeTrackingData = TimeChange[];

// Custom types for calculations
export interface ProjectAllocation {
  projectId: string;
  projectName: string;
  totalHours: number;
  employeeCount: number;
  employees: {
    id: string;
    name: string;
    hours: number;
  }[];
}

export interface EmployeeStats {
  id: string;
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

// Fallback types in case OpenAPI generation fails
export interface TimeChangeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  projectId: string;
  projectName: string;
  hours: number;
  date: string;
  timestamp?: string;
}