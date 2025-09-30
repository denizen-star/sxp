/**
 * Contributing Guide Page
 */

import React from 'react';
import DocumentationViewer from '../DocumentationViewer/DocumentationViewer';

const ContributingGuide: React.FC = () => {
  const content = `
    <h1>Contributing Guide</h1>
    
    <h2>Welcome Contributors!</h2>
    <p>Thank you for your interest in contributing to SXP! This guide will help you get started with contributing to our open-source project.</p>
    
    <h2>Getting Started</h2>
    
    <h3>Prerequisites</h3>
    <ul>
      <li>Node.js 18+ and npm</li>
      <li>Git</li>
      <li>Basic knowledge of React and TypeScript</li>
      <li>Familiarity with modern web development practices</li>
    </ul>
    
    <h3>Development Setup</h3>
    <ol>
      <li>Fork the repository on GitHub</li>
      <li>Clone your fork locally:
        <pre>git clone https://github.com/your-username/sxp.git
cd sxp</pre>
      </li>
      <li>Install dependencies:
        <pre>npm install</pre>
      </li>
      <li>Create a new branch for your feature:
        <pre>git checkout -b feature/your-feature-name</pre>
      </li>
      <li>Start the development server:
        <pre>npm start</pre>
      </li>
    </ol>
    
    <h2>Contribution Guidelines</h2>
    
    <h3>Code Style</h3>
    <ul>
      <li>Follow the existing code style and patterns</li>
      <li>Use TypeScript for all new code</li>
      <li>Write meaningful variable and function names</li>
      <li>Add comments for complex logic</li>
      <li>Keep functions small and focused</li>
    </ul>
    
    <h3>Commit Messages</h3>
    <p>Use clear, descriptive commit messages following this format:</p>
    <pre>type(scope): description

Examples:
feat(auth): add email verification
fix(schedule): resolve timezone issue
docs(api): update endpoint documentation
style(ui): improve button styling</pre>
    
    <h3>Pull Request Process</h3>
    <ol>
      <li>Ensure your code passes all tests</li>
      <li>Update documentation if needed</li>
      <li>Add tests for new functionality</li>
      <li>Create a descriptive pull request</li>
      <li>Link any related issues</li>
    </ol>
    
    <h2>Areas for Contribution</h2>
    
    <h3>Frontend Development</h3>
    <ul>
      <li>UI/UX improvements</li>
      <li>Component development</li>
      <li>Accessibility enhancements</li>
      <li>Performance optimizations</li>
      <li>Mobile responsiveness</li>
    </ul>
    
    <h3>Backend Development</h3>
    <ul>
      <li>API endpoint development</li>
      <li>Database optimization</li>
      <li>Authentication improvements</li>
      <li>Email service integration</li>
      <li>Security enhancements</li>
    </ul>
    
    <h3>Documentation</h3>
    <ul>
      <li>API documentation</li>
      <li>User guides</li>
      <li>Code comments</li>
      <li>Tutorial creation</li>
      <li>Translation</li>
    </ul>
    
    <h3>Testing</h3>
    <ul>
      <li>Unit test development</li>
      <li>Integration testing</li>
      <li>End-to-end testing</li>
      <li>Performance testing</li>
      <li>Bug reporting and fixing</li>
    </ul>
    
    <h2>Development Workflow</h2>
    
    <h3>Feature Development</h3>
    <ol>
      <li>Check existing issues and discussions</li>
      <li>Create an issue for significant features</li>
      <li>Fork and create a feature branch</li>
      <li>Implement your changes</li>
      <li>Write tests for your code</li>
      <li>Update documentation</li>
      <li>Submit a pull request</li>
    </ol>
    
    <h3>Bug Fixes</h3>
    <ol>
      <li>Identify and reproduce the bug</li>
      <li>Create a test that demonstrates the issue</li>
      <li>Implement the fix</li>
      <li>Ensure the test passes</li>
      <li>Submit a pull request with the fix</li>
    </ol>
    
    <h2>Testing Guidelines</h2>
    
    <h3>Unit Tests</h3>
    <ul>
      <li>Test individual functions and components</li>
      <li>Aim for high code coverage</li>
      <li>Test edge cases and error conditions</li>
      <li>Use descriptive test names</li>
    </ul>
    
    <h3>Integration Tests</h3>
    <ul>
      <li>Test component interactions</li>
      <li>Test API endpoints</li>
      <li>Test user workflows</li>
      <li>Test error handling</li>
    </ul>
    
    <h3>Running Tests</h3>
    <pre># Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testNamePattern="ComponentName"</pre>
    
    <h2>Code Review Process</h2>
    
    <h3>Review Criteria</h3>
    <ul>
      <li>Code quality and readability</li>
      <li>Test coverage and quality</li>
      <li>Documentation updates</li>
      <li>Performance implications</li>
      <li>Security considerations</li>
    </ul>
    
    <h3>Review Process</h3>
    <ol>
      <li>Automated checks must pass</li>
      <li>At least one maintainer review required</li>
      <li>Address all feedback before merging</li>
      <li>Squash commits if requested</li>
      <li>Update branch before merging</li>
    </ol>
    
    <h2>Community Guidelines</h2>
    
    <h3>Code of Conduct</h3>
    <ul>
      <li>Be respectful and inclusive</li>
      <li>Provide constructive feedback</li>
      <li>Help others learn and grow</li>
      <li>Follow the golden rule</li>
    </ul>
    
    <h3>Communication</h3>
    <ul>
      <li>Use clear, professional language</li>
      <li>Ask questions when unsure</li>
      <li>Provide context for issues</li>
      <li>Be patient with responses</li>
    </ul>
    
    <h2>Getting Help</h2>
    
    <h3>Resources</h3>
    <ul>
      <li>GitHub Issues for bug reports</li>
      <li>GitHub Discussions for questions</li>
      <li>Documentation for technical details</li>
      <li>Community forum for general help</li>
    </ul>
    
    <h3>Contact</h3>
    <ul>
      <li>Email: contributors@sxp.com</li>
      <li>GitHub: @sxp-maintainers</li>
      <li>Discord: SXP Community Server</li>
    </ul>
    
    <h2>Recognition</h2>
    <p>Contributors are recognized in our:</p>
    <ul>
      <li>Contributors section in README</li>
      <li>Release notes for significant contributions</li>
      <li>Community highlights</li>
      <li>Annual contributor appreciation</li>
    </ul>
    
    <p>Thank you for contributing to SXP! Together, we're building a better scheduling experience for everyone.</p>
  `;

  return (
    <DocumentationViewer
      title="Contributing Guide"
      content={content}
      category="Development"
      lastUpdated="January 19, 2025"
    />
  );
};

export default ContributingGuide;
