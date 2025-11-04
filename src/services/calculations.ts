import {
  TimeChangeEntry,
  ProjectAllocation,
  EmployeeStats,
  DailyTimeTracking,
} from './types';

/**
 * Calculate project allocation from time tracking data
 */
export function calculateProjectAllocation(
  data: TimeChangeEntry[] | null
): ProjectAllocation[] {
  // Safety check - return empty array if no data
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data available for project allocation calculation');
    return [];
  }

  const projectMap = new Map<string, ProjectAllocation>();

  data.forEach((entry) => {
    const projectId = entry.projectId;
    const projectName = entry.projectName || `Project ${projectId}`;
    const employeeId = entry.employeeId;
    const employeeName = entry.employeeName || `Employee ${employeeId}`;
    const hours = entry.hours || 0;

    // Initialize project if not exists
    if (!projectMap.has(projectId)) {
      projectMap.set(projectId, {
        projectId,
        projectName,
        totalHours: 0,
        employeeCount: 0,
        employees: [],
      });
    }

    const project = projectMap.get(projectId)!;

    // Find or create employee entry for this project
    let employeeEntry = project.employees.find((e) => e.id === employeeId);
    
    if (!employeeEntry) {
      employeeEntry = {
        id: employeeId,
        name: employeeName,
        hours: 0,
      };
      project.employees.push(employeeEntry);
    }

    // Add hours
    employeeEntry.hours += hours;
    project.totalHours += hours;
  });

  // Update employee counts and sort
  const result = Array.from(projectMap.values()).map((project) => ({
    ...project,
    employeeCount: project.employees.length,
    employees: project.employees.sort((a, b) => b.hours - a.hours),
  }));

  return result.sort((a, b) => b.totalHours - a.totalHours);
}

/**
 * Calculate employee statistics
 */
export function calculateEmployeeStats(
  data: TimeChangeEntry[] | null
): EmployeeStats[] {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }

  const employeeMap = new Map<string, EmployeeStats>();
  const employeeProjects = new Map<string, Set<string>>();

  data.forEach((entry) => {
    const employeeId = entry.employeeId;
    const employeeName = entry.employeeName || `Employee ${employeeId}`;
    const hours = entry.hours || 0;
    const projectId = entry.projectId;

    // Initialize employee if not exists
    if (!employeeMap.has(employeeId)) {
      employeeMap.set(employeeId, {
        id: employeeId,
        name: employeeName,
        totalHours: 0,
        projectCount: 0,
        averageHoursPerProject: 0,
      });
      employeeProjects.set(employeeId, new Set());
    }

    const stats = employeeMap.get(employeeId)!;
    stats.totalHours += hours;

    // Track unique projects
    employeeProjects.get(employeeId)!.add(projectId);
  });

  // Calculate project counts and averages
  employeeMap.forEach((stats, employeeId) => {
    const projects = employeeProjects.get(employeeId)!;
    stats.projectCount = projects.size;
    stats.averageHoursPerProject =
      stats.projectCount > 0 ? stats.totalHours / stats.projectCount : 0;
  });

  return Array.from(employeeMap.values()).sort((a, b) => b.totalHours - a.totalHours);
}

/**
 * Calculate daily time tracking trends
 */
export function calculateDailyTracking(
  data: TimeChangeEntry[] | null
): DailyTimeTracking[] {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }

  const dailyMap = new Map<string, DailyTimeTracking>();
  const dailyEmployees = new Map<string, Set<string>>();
  const dailyProjects = new Map<string, Set<string>>();

  data.forEach((entry) => {
    const date = entry.date || 'Unknown';
    const hours = entry.hours || 0;

    // Initialize date if not exists
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date,
        totalHours: 0,
        employeeCount: 0,
        projectCount: 0,
      });
      dailyEmployees.set(date, new Set());
      dailyProjects.set(date, new Set());
    }

    const daily = dailyMap.get(date)!;
    daily.totalHours += hours;

    // Track unique employees and projects
    dailyEmployees.get(date)!.add(entry.employeeId);
    dailyProjects.get(date)!.add(entry.projectId);
  });

  // Update counts
  dailyMap.forEach((daily, date) => {
    daily.employeeCount = dailyEmployees.get(date)?.size || 0;
    daily.projectCount = dailyProjects.get(date)?.size || 0;
  });

  return Array.from(dailyMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

/**
 * Get summary statistics
 */
export function getSummaryStats(data: TimeChangeEntry[] | null) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      totalHours: 0,
      totalEmployees: 0,
      totalProjects: 0,
      totalEntries: 0,
      averageHoursPerEntry: 0,
    };
  }

  const uniqueEmployees = new Set(data.map((e) => e.employeeId));
  const uniqueProjects = new Set(data.map((e) => e.projectId));
  const totalHours = data.reduce((sum, e) => sum + (e.hours || 0), 0);

  return {
    totalHours,
    totalEmployees: uniqueEmployees.size,
    totalProjects: uniqueProjects.size,
    totalEntries: data.length,
    averageHoursPerEntry: data.length > 0 ? totalHours / data.length : 0,
  };
}