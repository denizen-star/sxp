/**
 * SXP Modules Page
 */

import React from 'react';
import DocumentationViewer from '../DocumentationViewer/DocumentationViewer';

const SxpModules: React.FC = () => {
  const content = `
    <h1>SXP Modules</h1>
    
    <h2>Module Architecture Overview</h2>
    <p>SXP is built using a modular architecture that allows for easy extension and maintenance. Each module is self-contained with its own components, services, and functionality.</p>
    
    <h2>Core Modules</h2>
    
    <h3>Authentication Module</h3>
    <p><strong>Purpose:</strong> Handles user authentication, registration, and session management.</p>
    <p><strong>Components:</strong></p>
    <ul>
      <li><code>AuthDemo</code> - Authentication demonstration</li>
      <li><code>EnhancedSignup</code> - User registration form</li>
      <li><code>EmailTest</code> - Email functionality testing</li>
      <li><code>EmailVerification</code> - Email verification process</li>
      <li><code>UserManagement</code> - User account management</li>
      <li><code>AuthActivity</code> - Authentication activity tracking</li>
      <li><code>DatabaseQuery</code> - Database query interface</li>
    </ul>
    <p><strong>Services:</strong></p>
    <ul>
      <li><code>authTrackingService</code> - Authentication tracking</li>
      <li><code>sendGridEmailService</code> - Email delivery via SendGrid</li>
      <li><code>simpleEmailService</code> - Basic email functionality</li>
      <li><code>tokenService</code> - JWT token management</li>
      <li><code>urlService</code> - URL generation and validation</li>
      <li><code>userDatabase</code> - User data management</li>
    </ul>
    
    <h3>Persona Module</h3>
    <p><strong>Purpose:</strong> Manages user personas and lifestyle preferences.</p>
    <p><strong>Components:</strong></p>
    <ul>
      <li><code>PersonaSelector</code> - Persona selection interface</li>
    </ul>
    <p><strong>Data:</strong></p>
    <ul>
      <li><code>onboarding-funnel-questions.xml</code> - Onboarding questionnaire data</li>
    </ul>
    
    <h3>Schedule Module</h3>
    <p><strong>Purpose:</strong> Handles schedule creation, optimization, and management.</p>
    <p><strong>Components:</strong></p>
    <ul>
      <li><code>ScheduleViewer</code> - Schedule display and interaction</li>
    </ul>
    <p><strong>Services:</strong></p>
    <ul>
      <li><code>calendarService</code> - Calendar integration</li>
      <li><code>conflictResolutionService</code> - Schedule conflict resolution</li>
      <li><code>creativeSuggestionsService</code> - AI-powered suggestions</li>
      <li><code>exportService</code> - Schedule export functionality</li>
    </ul>
    
    <h2>Design System Module</h2>
    
    <h3>Core Components</h3>
    <ul>
      <li><code>Alert</code> - Notification and alert components</li>
      <li><code>Breadcrumb</code> - Navigation breadcrumbs</li>
      <li><code>Container</code> - Layout container component</li>
      <li><code>DropdownMenu</code> - Dropdown menu component</li>
      <li><code>EmptyStates</code> - Empty state displays</li>
      <li><code>ErrorBoundary</code> - Error handling component</li>
      <li><code>FormField</code> - Form input components</li>
      <li><code>FormGroup</code> - Form grouping component</li>
      <li><code>FormLayout</code> - Form layout management</li>
      <li><code>List</code> - List display components</li>
      <li><code>LoadingStates</code> - Loading state components</li>
      <li><code>ModernDropdownMenu</code> - Enhanced dropdown menu</li>
      <li><code>Pagination</code> - Pagination controls</li>
      <li><code>Section</code> - Content section component</li>
      <li><code>Sidebar</code> - Sidebar navigation</li>
      <li><code>Spacer</code> - Spacing utility component</li>
      <li><code>Table</code> - Data table component</li>
      <li><code>TabSystem</code> - Tab navigation system</li>
    </ul>
    
    <h3>Theme System</h3>
    <ul>
      <li><code>theme.ts</code> - Design system theme configuration</li>
      <li><code>provider.tsx</code> - Theme provider component</li>
      <li><code>hooks.ts</code> - Design system hooks</li>
    </ul>
    
    <h2>Service Modules</h2>
    
    <h3>Activity Tracking Service</h3>
    <p><strong>Purpose:</strong> Tracks user activities and provides analytics.</p>
    <p><strong>Features:</strong></p>
    <ul>
      <li>User activity logging</li>
      <li>Performance metrics collection</li>
      <li>Usage analytics</li>
      <li>Behavioral insights</li>
    </ul>
    
    <h3>Calendar Service</h3>
    <p><strong>Purpose:</strong> Manages calendar integration and scheduling.</p>
    <p><strong>Features:</strong></p>
    <ul>
      <li>Calendar synchronization</li>
      <li>Event management</li>
      <li>Time zone handling</li>
      <li>Recurring event support</li>
    </ul>
    
    <h3>Conflict Resolution Service</h3>
    <p><strong>Purpose:</strong> Resolves scheduling conflicts automatically.</p>
    <p><strong>Features:</strong></p>
    <ul>
      <li>Conflict detection</li>
      <li>Automatic resolution suggestions</li>
      <li>Priority-based scheduling</li>
      <li>Constraint handling</li>
    </ul>
    
    <h3>Creative Suggestions Service</h3>
    <p><strong>Purpose:</strong> Provides AI-powered scheduling suggestions.</p>
    <p><strong>Features:</strong></p>
    <ul>
      <li>Smart time allocation</li>
      <li>Productivity optimization</li>
      <li>Personalized recommendations</li>
      <li>Learning from user behavior</li>
    </ul>
    
    <h3>Export Service</h3>
    <p><strong>Purpose:</strong> Handles data export functionality.</p>
    <p><strong>Features:</strong></p>
    <ul>
      <li>Multiple export formats (CSV, JSON, PDF)</li>
      <li>Custom export templates</li>
      <li>Batch export processing</li>
      <li>Data formatting options</li>
    </ul>
    
    <h2>State Management</h2>
    
    <h3>Store Module</h3>
    <p><strong>Purpose:</strong> Centralized state management using Zustand.</p>
    <p><strong>Features:</strong></p>
    <ul>
      <li>Global state management</li>
      <li>Persistent state storage</li>
      <li>State synchronization</li>
      <li>Performance optimization</li>
    </ul>
    
    <h2>Type Definitions</h2>
    
    <h3>Types Module</h3>
    <p><strong>Purpose:</strong> TypeScript type definitions for the entire application.</p>
    <p><strong>Features:</strong></p>
    <ul>
      <li>Interface definitions</li>
      <li>Type safety</li>
      <li>Code documentation</li>
      <li>Development experience</li>
    </ul>
    
    <h2>Module Integration</h2>
    
    <h3>Module Communication</h3>
    <ul>
      <li>Event-based communication</li>
      <li>Shared state management</li>
      <li>Service layer abstraction</li>
      <li>Dependency injection</li>
    </ul>
    
    <h3>Module Dependencies</h3>
    <ul>
      <li>Design System → All modules</li>
      <li>Authentication → All modules</li>
      <li>Schedule → Persona, Services</li>
      <li>Services → Store, Types</li>
    </ul>
    
    <h2>Adding New Modules</h2>
    
    <h3>Module Structure</h3>
    <pre>src/modules/your-module/
├── components/          # React components
├── services/           # Business logic
├── hooks/             # Custom hooks
├── types/             # TypeScript types
├── utils/             # Utility functions
├── data/              # Static data
└── index.ts           # Module exports</pre>
    
    <h3>Best Practices</h3>
    <ul>
      <li>Keep modules self-contained</li>
      <li>Use clear naming conventions</li>
      <li>Implement proper error handling</li>
      <li>Write comprehensive tests</li>
      <li>Document module interfaces</li>
    </ul>
    
    <h2>Module Testing</h2>
    
    <h3>Testing Strategy</h3>
    <ul>
      <li>Unit tests for individual components</li>
      <li>Integration tests for module interactions</li>
      <li>End-to-end tests for user workflows</li>
      <li>Performance tests for critical paths</li>
    </ul>
    
    <h3>Testing Commands</h3>
    <pre># Test specific module
npm test -- --testPathPattern="modules/your-module"

# Test with coverage
npm run test:coverage -- --testPathPattern="modules/your-module"

# Run integration tests
npm run test:integration</pre>
  `;

  return (
    <DocumentationViewer
      title="SXP Modules"
      content={content}
      category="Technical"
      lastUpdated="January 19, 2025"
    />
  );
};

export default SxpModules;
