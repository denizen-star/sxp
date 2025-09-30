# SXP Contributing Guide

## 🤝 Welcome Contributors!

Thank you for your interest in contributing to SXP (Social Experiment Application). This guide will help you get started with contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Documentation](#documentation)

## 📜 Code of Conduct

### **Our Pledge**
We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background, experience level, gender identity, race, ethnicity, religion, or sexual orientation.

### **Expected Behavior**
- Be respectful and inclusive
- Use welcoming and inclusive language
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

### **Unacceptable Behavior**
- Harassment, trolling, or inflammatory comments
- Personal attacks or political discussions
- Spam or off-topic discussions
- Any form of discrimination

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- Git
- Code editor (VS Code recommended)
- Basic understanding of React and TypeScript

### **Fork and Clone**
```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/sxp.git
cd sxp

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/sxp.git
```

### **Install Dependencies**
```bash
# Install dependencies
npm install

# Copy environment variables
cp env.example .env.local
```

### **Development Setup**
```bash
# Start development server
npm start

# Run tests
npm test

# Run linting
npm run lint
```

## 🔄 Development Process

### **Branch Strategy**
- **main** - Production-ready code
- **develop** - Integration branch for features
- **feature/*** - Feature development branches
- **bugfix/*** - Bug fix branches
- **hotfix/*** - Critical bug fixes

### **Creating a Branch**
```bash
# Create and switch to new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b bugfix/issue-description
```

### **Development Workflow**
1. **Create Issue** - Describe the feature or bug
2. **Fork Repository** - Create your fork
3. **Create Branch** - Create feature branch
4. **Make Changes** - Implement your changes
5. **Test Changes** - Ensure all tests pass
6. **Commit Changes** - Write clear commit messages
7. **Push Changes** - Push to your fork
8. **Create PR** - Submit pull request

## 📝 Coding Standards

### **TypeScript Guidelines**
```typescript
// Use explicit types
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Use meaningful variable names
const userProfile: UserProfile = getUserProfile();

// Use const assertions for immutable data
const API_ENDPOINTS = {
  USERS: '/api/users',
  EVENTS: '/api/events'
} as const;
```

### **React Component Guidelines**
```typescript
// Use functional components with hooks
import React, { useState, useEffect } from 'react';

interface PersonaSelectorProps {
  personas: Persona[];
  selectedPersona: Persona | null;
  onPersonaSelect: (persona: Persona) => void;
  loading?: boolean;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  personas,
  selectedPersona,
  onPersonaSelect,
  loading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Component logic here
  }, []);

  return (
    <div className="persona-selector">
      {/* Component JSX */}
    </div>
  );
};
```

### **File Naming Conventions**
- **Components:** PascalCase (e.g., `PersonaSelector.tsx`)
- **Services:** camelCase (e.g., `activityTrackingService.ts`)
- **Types:** PascalCase (e.g., `UserProfile.ts`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

### **Import Organization**
```typescript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party imports
import { Box, Button } from '@mui/material';
import { useRouter } from 'react-router-dom';

// 3. Internal imports
import { PersonaSelector } from './PersonaSelector';
import { useStore } from '../store/useStore';
import { UserProfile } from '../types';
```

## 🔍 Code Quality

### **Testing Requirements**
- **Unit Tests** - Test individual functions and components
- **Integration Tests** - Test component interactions
- **E2E Tests** - Test complete user workflows
- **Test Coverage** - Maintain >80% coverage

### **Testing Examples**
```typescript
// Component testing
import { render, screen, fireEvent } from '@testing-library/react';
import { PersonaSelector } from './PersonaSelector';

describe('PersonaSelector', () => {
  it('renders persona options', () => {
    const personas = [
      { id: '1', name: 'Innovator', description: 'Creative professional' }
    ];
    
    render(
      <PersonaSelector
        personas={personas}
        selectedPersona={null}
        onPersonaSelect={jest.fn()}
      />
    );
    
    expect(screen.getByText('Innovator')).toBeInTheDocument();
  });
});
```

### **Linting and Formatting**
```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check TypeScript
npm run type-check
```

## 📤 Pull Request Process

### **Before Submitting**
- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Code is properly documented
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Branch is up to date with main

### **PR Template**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

### **Review Process**
1. **Automated Checks** - CI/CD pipeline runs tests
2. **Code Review** - At least 2 reviewers required
3. **Testing** - Manual testing if needed
4. **Approval** - Maintainer approval required
5. **Merge** - Squash and merge to main

## 🐛 Issue Reporting

### **Bug Reports**
When reporting bugs, please include:

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Version: [e.g., 1.0.0]

## Screenshots
If applicable, add screenshots

## Additional Context
Any other relevant information
```

### **Feature Requests**
```markdown
## Feature Description
Clear description of the feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should this feature work?

## Alternatives
Other solutions considered

## Additional Context
Any other relevant information
```

## 📚 Documentation

### **Code Documentation**
```typescript
/**
 * Calculates the mutual benefit score between two users
 * @param user1 - First user profile
 * @param user2 - Second user profile
 * @param context - Matching context (networking, collaboration, etc.)
 * @returns Promise<number> - Mutual benefit score (0-1)
 */
export async function calculateMutualBenefitScore(
  user1: UserProfile,
  user2: UserProfile,
  context: MatchingContext
): Promise<number> {
  // Implementation here
}
```

### **Component Documentation**
```typescript
/**
 * PersonaSelector Component
 * 
 * Allows users to select their professional persona for matching
 * 
 * @example
 * ```tsx
 * <PersonaSelector
 *   personas={personas}
 *   selectedPersona={selectedPersona}
 *   onPersonaSelect={handlePersonaSelect}
 *   loading={false}
 * />
 * ```
 */
export const PersonaSelector: React.FC<PersonaSelectorProps> = ({ ... }) => {
  // Component implementation
};
```

## 🏗️ Project Structure

### **Understanding the Codebase**
```
src/
├── components/           # Reusable UI components
│   ├── PersonaSelector/     # Persona selection component
│   ├── NavigationGuide/      # Navigation component
│   └── ScheduleViewer/       # Schedule viewing component
├── services/            # Business logic and API calls
│   ├── activityTrackingService.ts
│   ├── creativeSuggestionsService.ts
│   └── exportService.ts
├── modules/             # Feature-specific modules
│   ├── authentication-module/  # Authentication system
│   ├── activities-module/      # Activity management
│   └── persona-module/         # Persona management
├── design-system/       # Design system components
├── store/               # State management
├── types/               # TypeScript type definitions
└── App.tsx              # Main application component
```

## 🎯 Contribution Areas

### **High Priority**
- **Matching Algorithm** - Core ML matching logic
- **Event Management** - Event creation and management
- **Analytics Dashboard** - User analytics and insights
- **Mobile Responsiveness** - Mobile-friendly UI

### **Medium Priority**
- **Performance Optimization** - Speed and efficiency
- **Testing** - Test coverage and quality
- **Documentation** - Code and user documentation
- **Accessibility** - WCAG compliance

### **Low Priority**
- **UI/UX Improvements** - Design enhancements
- **Internationalization** - Multi-language support
- **Advanced Features** - Additional functionality

## 📞 Getting Help

### **Communication Channels**
- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Email** - dev-team@sxp.kervinapps.com

### **Resources**
- **Documentation** - Check the docs folder
- **Code Examples** - Look at existing components
- **Community** - Join our developer community

## 🎉 Recognition

### **Contributor Recognition**
- Contributors will be listed in the project README
- Significant contributions will be highlighted
- Regular contributors may be invited to join the core team

### **Contributing Guidelines**
- Be patient and respectful
- Ask questions when unsure
- Help others when you can
- Follow the established processes

---

**Thank you for contributing to SXP!** 🚀

**Last Updated:** December 19, 2024  
**Version:** 1.0.0
