import { ScheduleItem } from '../types';

export class CalendarService {
  /**
   * Generate Google Calendar URL for an activity
   */
  static generateGoogleCalendarUrl(activity: ScheduleItem): string {
    const startDate = new Date(`${activity.date}T${activity.start_time}:00`);
    const endDate = new Date(`${activity.date}T${activity.end_time}:00`);
    
    const startISO = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endISO = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const title = encodeURIComponent(activity.activity.name);
    const details = encodeURIComponent(activity.activity.description);
    const location = encodeURIComponent(activity.activity.location);
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startISO}/${endISO}&details=${details}&location=${location}`;
  }

  /**
   * Generate ICS file for a single activity
   */
  static generateICSFile(activity: ScheduleItem): void {
    const startDate = new Date(`${activity.date}T${activity.start_time}:00`);
    const endDate = new Date(`${activity.date}T${activity.end_time}:00`);
    
    const startISO = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endISO = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SXP//Schedule//EN
BEGIN:VEVENT
UID:${activity.activity.id}@sxp.kervinapps.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startISO}
DTEND:${endISO}
SUMMARY:${activity.activity.name}
DESCRIPTION:${activity.activity.description}
LOCATION:${activity.activity.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activity.activity.name.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Generate ICS file for multiple activities (weekly schedule)
   */
  static generateWeeklyICS(activities: ScheduleItem[]): void {
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SXP//Weekly Schedule//EN`;

    activities.forEach(activity => {
      const startDate = new Date(`${activity.date}T${activity.start_time}:00`);
      const endDate = new Date(`${activity.date}T${activity.end_time}:00`);
      
      const startISO = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const endISO = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      
      icsContent += `
BEGIN:VEVENT
UID:${activity.activity.id}@sxp.kervinapps.com
DTSTAMP:${now}
DTSTART:${startISO}
DTEND:${endISO}
SUMMARY:${activity.activity.name}
DESCRIPTION:${activity.activity.description}
LOCATION:${activity.activity.location}
END:VEVENT`;
    });

    icsContent += `
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sxp_weekly_schedule.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
