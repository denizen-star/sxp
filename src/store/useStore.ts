import { create } from 'zustand';
import { AppState, UserPersona, TimeAllocation, Activity, WeeklySchedule, ScheduleItem } from '../types';
import { format } from 'date-fns';

interface AppStore extends AppState {
  // Actions
  setSelectedPersona: (persona: UserPersona | null) => void;
  setTimeAllocation: (allocation: Partial<TimeAllocation>) => void;
  setCurrentSchedule: (schedule: WeeklySchedule | null) => void;
  setPersonas: (personas: UserPersona[]) => void;
  setActivities: (activities: Activity[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Complex actions
  loadPersonas: () => Promise<void>;
  generateSchedule: () => Promise<void>;
  exportSchedule: () => Promise<string>;
}

const defaultTimeAllocation: TimeAllocation = {
  individual_activities_percent: 16.0,
  networking_social_percent: 21.6,
  couple_activities_percent: 23.8,
  individual_breakdown: {
    running_percent: 27.0,
    personal_development_percent: 19.0,
    fitness_grooming_percent: 35.0,
    reflection_planning_percent: 19.0,
  },
  networking_breakdown: {
    professional_networking_percent: 24.0,
    social_activities_percent: 50.0,
    professional_dev_networking_percent: 18.0,
    other_social_percent: 8.0,
  },
  couple_breakdown: {
    daily_meals_percent: 29.0,
    evening_together_percent: 25.0,
    weekend_activities_percent: 25.0,
    breakfast_together_percent: 13.0,
    household_together_percent: 8.0,
  },
};

export const useStore = create<AppStore>((set, get) => ({
  // Initial state - Kevin Job Search as default
  selectedPersona: null, // Will be set after personas load
  timeAllocation: defaultTimeAllocation,
  currentSchedule: null,
  personas: [],
  activities: [],
  isLoading: false,
  error: null,

  // Basic setters
  setSelectedPersona: (persona) => set({ selectedPersona: persona }),
  setTimeAllocation: (allocation) => 
    set((state) => ({ 
      timeAllocation: { ...state.timeAllocation, ...allocation } 
    })),
  setCurrentSchedule: (schedule) => set({ currentSchedule: schedule }),
  setPersonas: (personas) => set({ personas }),
  setActivities: (activities) => set({ activities }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Complex actions
  loadPersonas: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // Kevin personas based on the original LifePlanner data
      const personas: UserPersona[] = [
        {
          persona_id: "kevin_job_search",
          persona_name: "Kevin - Job Searching",
          description: "40-year-old Head of Data in career transition, building professional network while maintaining fitness routine",
          demographics: {
            age_range: [40, 45],
            life_stage: "mid_career",
            occupation: "Head of Data (Seeking New Role)",
            income_level: "high",
            location_preference: "Toronto",
            relationship_status: "married",
            has_children: false,
            education_level: "university"
          },
          personality: {
            personality_type: "introvert-extrovert",
            energy_pattern: "not_morning_person",
            social_style: "selective",
            risk_tolerance: 7,
            spontaneity_level: 3,
            perfectionism_level: 8,
            stress_tolerance: 8,
            decision_making_style: "analytical"
          },
          goals: {
            primary_goals: [
              "Build healthy social network outside bar scene",
              "Build professional network in Toronto, New York and Miami", 
              "Practice more intentional activities",
              "Establish clear morning and evening routines",
              "Drink less alcohol"
            ],
            career_goals: [
              "Find new Head of Data role",
              "Build professional network in Toronto, New York and Miami",
              "Excel in fintech data role",
              "Lead data initiatives",
              "Attend industry events and meetups"
            ],
            personal_goals: [
              "Complete half marathon training",
              "Build healthy social network individually and as couple",
              "Practice intentional activities", 
              "Establish stimulating morning and evening routines"
            ],
            short_term_goals: [
              "Join Frontrunners or another queer run club",
              "Attend Toronto Data Science Meetup",
              "Participate in early morning breakfast events",
              "Maintain running schedule (Tue/Thu/Fri/Sun)",
              "Apply to 5 jobs per week"
            ],
            long_term_goals: [
              "Secure new Head of Data position",
              "Build strong professional network across multiple cities",
              "Complete half marathon",
              "Establish consistent morning/evening routines"
            ]
          },
          preferences: {
            activity_preferences: ["professional_driven", "fitness_focused"],
            preferred_activity_types: ["professional", "fitness", "networking", "skill_development"],
            avoided_activity_types: ["bar_scene", "heavy_drinking"],
            preferred_locations: ["Financial District", "Entertainment District", "Running Paths", "Professional Venues"],
            budget_preference: "moderate",
            time_preferences: {
              morning_start: "8:00 AM",
              bedtime: "10:30 PM",
              preferred_breakfast: "Skip breakfast",
              preferred_dinner: "6:00 PM"
            },
            group_size_preference: "small_groups",
            frequency_preference: "high"
          },
          constraints: {
            max_daily_budget: 200.0,
            max_weekly_budget: 1000.0,
            available_weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            available_weekends: ["Saturday", "Sunday"],
            time_constraints: {
              job_search_hours: "9:00 AM - 5:00 PM",
              running_schedule: "Tuesday, Thursday, Friday, Sunday",
              mass_schedule: "Sunday 9:30 AM"
            },
            physical_limitations: [],
            dietary_restrictions: [],
            accessibility_needs: []
          },
          behavioral_patterns: {
            typical_morning_routine: ["Late start (not morning person)", "Job search activities", "Skill development", "Networking research"],
            typical_evening_routine: ["Running or fitness", "Professional networking", "Couple time", "Application follow-ups"],
            weekend_habits: ["Long runs", "Professional meetups", "Data science events", "Couple activities"],
            stress_management: ["Running", "Data analysis", "Professional networking", "Couple support"],
            learning_preferences: ["Hands-on experiences", "Data-driven learning", "Professional workshops", "Online courses"]
          },
          networking: {
            networking_priority: 9,
            preferred_networking_venues: ["Toronto Data Science Meetup", "Fintech events", "Professional breakfast events", "Industry conferences"],
            networking_approach: "strategic",
            relationship_depth_preference: "professional",
            follow_up_style: "professional",
            communication_preference: "in_person"
          },
          metadata: {
            created_date: new Date().toISOString(),
            last_updated: new Date().toISOString(),
            is_active: true,
            usage_count: 0
          }
        },
        {
          persona_id: "kevin_working",
          persona_name: "Kevin - Working",
          description: "40-year-old Head of Data with stable job, focusing on building social network and maintaining fitness",
          demographics: {
            age_range: [40, 45],
            life_stage: "mid_career",
            occupation: "Head of Data at Fintech",
            income_level: "high",
            location_preference: "Toronto",
            relationship_status: "married",
            has_children: false,
            education_level: "university"
          },
          personality: {
            personality_type: "introvert-extrovert",
            energy_pattern: "not_morning_person",
            social_style: "selective",
            risk_tolerance: 7,
            spontaneity_level: 3,
            perfectionism_level: 8,
            stress_tolerance: 8,
            decision_making_style: "analytical"
          },
          goals: {
            primary_goals: [
              "Build healthy social network outside bar scene",
              "Excel in current Head of Data role",
              "Maintain work-life balance",
              "Complete half marathon training"
            ],
            career_goals: [
              "Lead data initiatives at current company",
              "Build professional network in Toronto",
              "Mentor junior data professionals",
              "Attend industry events and meetups"
            ],
            personal_goals: [
              "Complete half marathon training",
              "Build healthy social network individually and as couple",
              "Practice intentional activities",
              "Establish stimulating morning and evening routines"
            ],
            short_term_goals: [
              "Join Frontrunners or another queer run club",
              "Attend Toronto Data Science Meetup",
              "Maintain running schedule (Tue/Thu/Fri/Sun)",
              "Reduce alcohol consumption"
            ],
            long_term_goals: [
              "Build strong professional network",
              "Complete half marathon",
              "Establish consistent routines",
              "Build healthy social network outside bar scene"
            ]
          },
          preferences: {
            activity_preferences: ["professional_driven", "fitness_focused"],
            preferred_activity_types: ["professional", "fitness", "networking", "social"],
            avoided_activity_types: ["bar_scene", "heavy_drinking"],
            preferred_locations: ["Financial District", "Entertainment District", "Running Paths", "Professional Venues"],
            budget_preference: "moderate",
            time_preferences: {
              morning_start: "6:00 AM",
              bedtime: "10:30 PM",
              preferred_breakfast: "7:00 AM",
              preferred_dinner: "6:00 PM"
            },
            group_size_preference: "small_groups",
            frequency_preference: "moderate"
          },
          constraints: {
            max_daily_budget: 150.0,
            max_weekly_budget: 800.0,
            available_weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            available_weekends: ["Saturday", "Sunday"],
            time_constraints: {
              work_start: "9:00 AM",
              work_end: "6:00 PM",
              running_schedule: "Tuesday, Thursday, Friday, Sunday",
              mass_schedule: "Sunday 9:30 AM"
            },
            physical_limitations: [],
            dietary_restrictions: [],
            accessibility_needs: []
          },
          behavioral_patterns: {
            typical_morning_routine: ["Flexible start", "Creative work", "Coffee", "Inspiration time"],
            typical_evening_routine: ["Client work", "Creative projects", "Social time", "Reflection"],
            weekend_habits: ["Art galleries", "Creative workshops", "Networking events", "Personal projects"],
            stress_management: ["Creative expression", "Nature time", "Social connection", "Physical activity"],
            learning_preferences: ["Hands-on experiences", "Visual learning", "Collaborative learning", "Trial and error"]
          },
          networking: {
            networking_priority: 7,
            preferred_networking_venues: ["Art galleries", "Creative workshops", "Cafes", "Co-working spaces"],
            networking_approach: "organic",
            relationship_depth_preference: "mixed",
            follow_up_style: "professional",
            communication_preference: "in_person"
          },
          metadata: {
            created_date: new Date().toISOString(),
            last_updated: new Date().toISOString(),
            is_active: true,
            usage_count: 0
          }
        }
      ];
      
      // Set Kevin Job Search as the default selected persona
      const defaultPersona = personas.find(p => p.persona_id === "kevin_job_search") || personas[0];
      set({ personas, selectedPersona: defaultPersona, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load personas', isLoading: false });
    }
  },

  generateSchedule: async () => {
    const { selectedPersona } = get();
    if (!selectedPersona) {
      set({ error: 'No persona selected' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      // Generate realistic schedule based on persona preferences
      const weekStart = new Date();
      const weekEnd = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000);
      
      const schedule: WeeklySchedule = {
        week_start: weekStart.toISOString().split('T')[0],
        week_end: weekEnd.toISOString().split('T')[0],
        days: [],
        weekly_summary: {
          total_cost: 0,
          total_activities: 0,
          networking_activities: 0,
          couple_activities: 0,
          individual_activities: 0
        }
      };

      // Generate activities for each day based on persona
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(weekStart);
        currentDate.setDate(currentDate.getDate() + i);
        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const isWeekend = dayName === 'saturday' || dayName === 'sunday';
        
        const daySchedule = generateDaySchedule(selectedPersona, currentDate, isWeekend);
        schedule.days.push(daySchedule);
        
        // Update weekly summary
        schedule.weekly_summary.total_activities += daySchedule.activities.length;
        schedule.weekly_summary.total_cost += daySchedule.activities.reduce((sum: number, activity: any) => sum + (activity.activity.cost_cad || 0), 0);
        schedule.weekly_summary.networking_activities += daySchedule.activities.filter((a: any) => a.type === 'networking').length;
        schedule.weekly_summary.couple_activities += daySchedule.activities.filter((a: any) => a.type === 'couple').length;
        schedule.weekly_summary.individual_activities += daySchedule.activities.filter((a: any) => a.type === 'individual').length;
      }

      set({ currentSchedule: schedule, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to generate schedule', isLoading: false });
    }
  },

  exportSchedule: async () => {
    const { currentSchedule } = get();
    if (!currentSchedule) {
      throw new Error('No schedule to export');
    }

    // Mock export functionality
    return `schedule_${currentSchedule.week_start}.md`;
  }
}));

// Helper function to generate realistic daily schedules
function generateDaySchedule(persona: UserPersona, date: Date, isWeekend: boolean): any {
  const activities: ScheduleItem[] = [];
  const dayName = format(date, 'EEEE').toLowerCase();
  
  // Base activities based on persona preferences
  if (persona.persona_id === 'kevin_job_search') {
    // Kevin's job search schedule
    if (!isWeekend) {
      // Weekday activities
      activities.push({
        start_time: '07:00',
        end_time: '08:00',
        date: format(date, 'yyyy-MM-dd'),
        type: 'individual',
        activity: {
          id: 'morning_exercise',
          name: 'Morning Exercise',
          category: 'fitness',
          subcategory: 'cardio',
          description: 'Running or gym workout to start the day energized',
          cost_cad: 0,
          duration_minutes: 60,
          networking_potential: 2,
          location: 'Local Park / Gym',
          tags: ['fitness', 'running', 'energy'],
          requirements: ['workout clothes'],
          best_time: ['morning'],
          frequency: 'daily'
        }
      });

      activities.push({
        start_time: '09:00',
        end_time: '12:00',
        date: format(date, 'yyyy-MM-dd'),
        type: 'individual',
        activity: {
          id: 'job_search',
          name: 'Job Search & Applications',
          category: 'career',
          subcategory: 'job_search',
          description: 'Researching companies, tailoring resumes, submitting applications',
          cost_cad: 0,
          duration_minutes: 180,
          networking_potential: 0,
          location: 'Home Office',
          tags: ['career', 'job_search', 'applications'],
          requirements: ['computer', 'internet'],
          best_time: ['morning'],
          frequency: 'daily'
        }
      });

      activities.push({
        start_time: '14:00',
        end_time: '16:00',
        date: format(date, 'yyyy-MM-dd'),
        type: 'networking',
        activity: {
          id: 'networking_event',
          name: 'Networking Event',
          category: 'networking',
          subcategory: 'professional',
          description: 'Industry meetup, conference, or professional event',
          cost_cad: 25,
          duration_minutes: 120,
          networking_potential: 8,
          location: 'Downtown Venue',
          tags: ['networking', 'professional', 'career'],
          requirements: ['business cards', 'elevator pitch'],
          best_time: ['afternoon'],
          frequency: 'weekly'
        }
      });

      activities.push({
        start_time: '18:00',
        end_time: '19:30',
        date: format(date, 'yyyy-MM-dd'),
        type: 'couple',
        activity: {
          id: 'dinner_with_peter',
          name: 'Dinner with Peter',
          category: 'couple',
          subcategory: 'meals',
          description: 'Quality time over a shared meal',
          cost_cad: 40,
          duration_minutes: 90,
          networking_potential: 0,
          location: 'Home / Restaurant',
          tags: ['couple', 'meal', 'connection'],
          requirements: [],
          best_time: ['evening'],
          frequency: 'daily'
        }
      });
    } else {
      // Weekend activities
      activities.push({
        start_time: '10:00',
        end_time: '12:00',
        date: format(date, 'yyyy-MM-dd'),
        type: 'couple',
        activity: {
          id: 'weekend_brunch',
          name: 'Weekend Brunch',
          category: 'couple',
          subcategory: 'meals',
          description: 'Relaxed weekend meal together',
          cost_cad: 35,
          duration_minutes: 120,
          networking_potential: 0,
          location: 'Local Cafe',
          tags: ['couple', 'weekend', 'relaxation'],
          requirements: [],
          best_time: ['morning'],
          frequency: 'weekly'
        }
      });

      activities.push({
        start_time: '14:00',
        end_time: '16:00',
        date: format(date, 'yyyy-MM-dd'),
        type: 'individual',
        activity: {
          id: 'skill_development',
          name: 'Skill Development',
          category: 'learning',
          subcategory: 'online_course',
          description: 'Online course or skill building activity',
          cost_cad: 0,
          duration_minutes: 120,
          networking_potential: 1,
          location: 'Home',
          tags: ['learning', 'skills', 'development'],
          requirements: ['computer', 'internet'],
          best_time: ['afternoon'],
          frequency: 'weekly'
        }
      });
    }
  } else {
    // Default schedule for other personas
    activities.push({
      start_time: '08:00',
      end_time: '09:00',
      date: format(date, 'yyyy-MM-dd'),
      type: 'individual',
      activity: {
        id: 'morning_routine',
        name: 'Morning Routine',
        category: 'personal',
        subcategory: 'wellness',
        description: 'Personal morning routine and preparation',
        cost_cad: 0,
        duration_minutes: 60,
        networking_potential: 0,
        location: 'Home',
        tags: ['personal', 'wellness', 'routine'],
        requirements: [],
        best_time: ['morning'],
        frequency: 'daily'
      }
    });

    if (!isWeekend) {
      activities.push({
        start_time: '09:00',
        end_time: '17:00',
        date: format(date, 'yyyy-MM-dd'),
        type: 'individual',
        activity: {
          id: 'work_day',
          name: 'Work Day',
          category: 'career',
          subcategory: 'work',
          description: 'Regular work activities',
          cost_cad: 0,
          duration_minutes: 480,
          networking_potential: 3,
          location: 'Office / Remote',
          tags: ['work', 'career', 'professional'],
          requirements: [],
          best_time: ['morning', 'afternoon'],
          frequency: 'daily'
        }
      });
    }
  }

  return {
    date: format(date, 'yyyy-MM-dd'),
    day_name: dayName,
    activities: activities,
    daily_summary: {
      total_cost: activities.reduce((sum, activity) => sum + (activity.activity.cost_cad || 0), 0),
      total_activities: activities.length,
      networking_activities: activities.filter(a => a.type === 'networking').length,
      couple_activities: activities.filter(a => a.type === 'couple').length,
      individual_activities: activities.filter(a => a.type === 'individual').length
    }
  };
}
