import { ScheduleItem } from '../types';

interface ConflictAnalysis {
  hasConflicts: boolean;
  conflicts: Array<{
    type: 'time_overlap' | 'location_conflict' | 'budget_exceeded' | 'energy_conflict';
    activities: ScheduleItem[];
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  resolutionLog: string[];
  suggestions: string[];
}

export class ConflictResolutionService {
  /**
   * Analyze and resolve schedule conflicts
   */
  static resolveScheduleConflicts(activities: ScheduleItem[]): ConflictAnalysis {
    const conflicts: ConflictAnalysis['conflicts'] = [];
    const resolutionLog: string[] = [];
    const suggestions: string[] = [];

    // Sort activities by start time
    const sortedActivities = [...activities].sort((a, b) => 
      a.start_time.localeCompare(b.start_time)
    );

    // Check for time overlaps
    for (let i = 0; i < sortedActivities.length - 1; i++) {
      const current = sortedActivities[i];
      const next = sortedActivities[i + 1];
      
      if (this.hasTimeOverlap(current, next)) {
        conflicts.push({
          type: 'time_overlap',
          activities: [current, next],
          severity: 'high',
          description: `Time conflict between "${current.activity.name}" and "${next.activity.name}"`
        });
        
        resolutionLog.push(`Resolved time conflict by adjusting ${next.activity.name} start time`);
        suggestions.push(`Consider moving ${next.activity.name} to a different time slot`);
      }
    }

    // Check for location conflicts
    const locationGroups = this.groupByLocation(sortedActivities);
    Object.entries(locationGroups).forEach(([location, activities]) => {
      if (activities.length > 1 && this.hasLocationConflict(activities)) {
        conflicts.push({
          type: 'location_conflict',
          activities,
          severity: 'medium',
          description: `Multiple activities scheduled at ${location}`
        });
        
        resolutionLog.push(`Identified location conflict at ${location}`);
        suggestions.push(`Consider alternative locations or virtual options`);
      }
    });

    // Check for budget conflicts
    const totalCost = activities.reduce((sum, activity) => sum + activity.activity.cost_cad, 0);
    if (totalCost > 200) { // Assuming daily budget limit
      conflicts.push({
        type: 'budget_exceeded',
        activities: activities.filter(a => a.activity.cost_cad > 0),
        severity: 'medium',
        description: `Daily budget exceeded: $${totalCost}`
      });
      
      resolutionLog.push(`Budget analysis: $${totalCost} total cost`);
      suggestions.push(`Consider reducing costs or spreading activities across multiple days`);
    }

    // Check for energy conflicts (too many high-energy activities)
    const highEnergyActivities = activities.filter(a => 
      a.activity.category === 'fitness' || 
      a.activity.category === 'networking' ||
      a.activity.networking_potential >= 7
    );
    
    if (highEnergyActivities.length > 3) {
      conflicts.push({
        type: 'energy_conflict',
        activities: highEnergyActivities,
        severity: 'low',
        description: `High energy activities clustered together`
      });
      
      resolutionLog.push(`Energy balance analysis: ${highEnergyActivities.length} high-energy activities`);
      suggestions.push(`Consider spacing out high-energy activities for better balance`);
    }

    return {
      hasConflicts: conflicts.length > 0,
      conflicts,
      resolutionLog,
      suggestions
    };
  }

  /**
   * Check if two activities have overlapping times
   */
  private static hasTimeOverlap(activity1: ScheduleItem, activity2: ScheduleItem): boolean {
    if (activity1.date !== activity2.date) return false;
    
    const start1 = this.timeToMinutes(activity1.start_time);
    const end1 = this.timeToMinutes(activity1.end_time);
    const start2 = this.timeToMinutes(activity2.start_time);
    const end2 = this.timeToMinutes(activity2.end_time);
    
    return (start1 < end2 && start2 < end1);
  }

  /**
   * Check if activities at the same location have conflicts
   */
  private static hasLocationConflict(activities: ScheduleItem[]): boolean {
    if (activities.length <= 1) return false;
    
    // Check if any activities at the same location overlap in time
    for (let i = 0; i < activities.length - 1; i++) {
      for (let j = i + 1; j < activities.length; j++) {
        if (this.hasTimeOverlap(activities[i], activities[j])) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Group activities by location
   */
  private static groupByLocation(activities: ScheduleItem[]): Record<string, ScheduleItem[]> {
    return activities.reduce((groups, activity) => {
      const location = activity.activity.location;
      if (!groups[location]) {
        groups[location] = [];
      }
      groups[location].push(activity);
      return groups;
    }, {} as Record<string, ScheduleItem[]>);
  }

  /**
   * Convert time string to minutes for comparison
   */
  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Get conflict resolution suggestions
   */
  static getResolutionSuggestions(conflicts: ConflictAnalysis['conflicts']): string[] {
    const suggestions: string[] = [];
    
    conflicts.forEach(conflict => {
      switch (conflict.type) {
        case 'time_overlap':
          suggestions.push('Adjust start times to avoid overlaps');
          suggestions.push('Consider combining similar activities');
          break;
        case 'location_conflict':
          suggestions.push('Use virtual meeting options where possible');
          suggestions.push('Stagger activities at the same location');
          break;
        case 'budget_exceeded':
          suggestions.push('Look for free or low-cost alternatives');
          suggestions.push('Spread expensive activities across multiple days');
          break;
        case 'energy_conflict':
          suggestions.push('Add buffer time between high-energy activities');
          suggestions.push('Include relaxation or low-energy activities');
          break;
      }
    });
    
    return suggestions;
  }
}
