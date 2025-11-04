/**
 * AUTO-GENERATED from OpenAPI schema
 * Run: npm run openapi:generate
 * DO NOT EDIT MANUALLY
 */

export interface TimeChange {
  id: string;
  startTime: string; // ISO 8601 datetime
  endTime: string; // ISO 8601 datetime
  pauseTime: {
    hours: number;
    minutes: number;
  };
  workTime: {
    hours: number;
    minutes: number;
  };
  projectAllocation: {
    [label: string]: number; // percentage
  };
  workplaceAllocation: {
    [label: string]: number; // percentage
  };
}

export interface TimeChangesResponse {
  data: TimeChange[];
  count: number;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}