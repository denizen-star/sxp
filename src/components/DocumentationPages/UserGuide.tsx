/**
 * User Guide Page
 */

import React from 'react';
import DocumentationViewer from '../DocumentationViewer/DocumentationViewer';

const UserGuide: React.FC = () => {
  const content = `
    <h1>User Guide</h1>
    
    <h2>Getting Started</h2>
    <p>Welcome to SXP (Smart eXperience Platform)! This guide will help you get the most out of your personalized schedule optimization experience.</p>
    
    <h2>Creating Your Account</h2>
    <ol>
      <li>Visit the SXP homepage</li>
      <li>Click "Create Account" or "Sign Up"</li>
      <li>Enter your email address and create a secure password</li>
      <li>Verify your email address by clicking the link sent to your inbox</li>
      <li>Complete your profile setup</li>
    </ol>
    
    <h2>Selecting Your Persona</h2>
    <p>Your persona determines how your schedule is optimized. Choose from:</p>
    <ul>
      <li><strong>Student</strong> - Optimized for academic schedules and study time</li>
      <li><strong>Professional</strong> - Focused on work-life balance and productivity</li>
      <li><strong>Entrepreneur</strong> - Flexible scheduling for business owners</li>
      <li><strong>Parent</strong> - Family-focused time management</li>
      <li><strong>Retiree</strong> - Leisure and health-focused scheduling</li>
    </ul>
    
    <h2>Creating Your First Schedule</h2>
    <ol>
      <li>Navigate to the Schedule Viewer</li>
      <li>Click "Create New Schedule"</li>
      <li>Set your availability preferences</li>
      <li>Add your regular activities and commitments</li>
      <li>Let SXP optimize your time allocation</li>
      <li>Review and adjust as needed</li>
    </ol>
    
    <h2>Understanding Your Schedule</h2>
    <p>Your optimized schedule includes:</p>
    <ul>
      <li><strong>Time blocks</strong> - Dedicated time for specific activities</li>
      <li><strong>Buffer time</strong> - Built-in flexibility for unexpected events</li>
      <li><strong>Priority indicators</strong> - Visual cues for high-importance tasks</li>
      <li><strong>Energy levels</strong> - Scheduling based on your natural rhythms</li>
    </ul>
    
    <h2>Customizing Your Experience</h2>
    <h3>Time Preferences</h3>
    <ul>
      <li>Set your preferred working hours</li>
      <li>Define break durations and frequency</li>
      <li>Specify time zones and availability</li>
    </ul>
    
    <h3>Activity Categories</h3>
    <ul>
      <li>Work and professional tasks</li>
      <li>Personal and family time</li>
      <li>Health and wellness activities</li>
      <li>Learning and development</li>
      <li>Leisure and recreation</li>
    </ul>
    
    <h2>Tips for Success</h2>
    <blockquote>
      <p><strong>Start Small:</strong> Begin with a few key activities and gradually add more complexity to your schedule.</p>
    </blockquote>
    
    <blockquote>
      <p><strong>Be Realistic:</strong> Set achievable goals and allow for flexibility in your planning.</p>
    </blockquote>
    
    <blockquote>
      <p><strong>Review Regularly:</strong> Check your schedule weekly and adjust based on what's working.</p>
    </blockquote>
    
    <h2>Troubleshooting</h2>
    <h3>Common Issues</h3>
    <ul>
      <li><strong>Schedule conflicts:</strong> Use the conflict resolution tool to automatically resolve overlapping activities</li>
      <li><strong>Time optimization:</strong> Adjust your preferences if the algorithm isn't meeting your needs</li>
      <li><strong>Data sync:</strong> Ensure you're connected to the internet for real-time updates</li>
    </ul>
    
    <h2>Getting Help</h2>
    <p>If you need assistance:</p>
    <ul>
      <li>Check the FAQ section for common questions</li>
      <li>Contact support through the help center</li>
      <li>Join our community forum for tips and discussions</li>
    </ul>
  `;

  return (
    <DocumentationViewer
      title="User Guide"
      content={content}
      category="User"
      lastUpdated="January 19, 2025"
    />
  );
};

export default UserGuide;
