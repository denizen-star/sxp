/**
 * FAQ Page
 */

import React from 'react';
import DocumentationViewer from '../DocumentationViewer/DocumentationViewer';

const FAQ: React.FC = () => {
  const content = `
    <h1>Frequently Asked Questions</h1>
    
    <h2>General Questions</h2>
    
    <h3>What is SXP?</h3>
    <p>SXP (Smart eXperience Platform) is an AI-powered schedule optimization platform that helps users create personalized, efficient schedules based on their lifestyle persona and preferences.</p>
    
    <h3>How does SXP work?</h3>
    <p>SXP uses advanced algorithms to analyze your preferences, availability, and goals to create optimized schedules. It considers factors like energy levels, priorities, and time constraints to suggest the best time allocation for your activities.</p>
    
    <h3>Is SXP free to use?</h3>
    <p>Yes, SXP offers a free tier with core scheduling features. Premium features and advanced analytics are available with paid plans.</p>
    
    <h2>Account and Registration</h2>
    
    <h3>How do I create an account?</h3>
    <p>Click "Sign Up" on the homepage, enter your email and password, then verify your email address through the link sent to your inbox.</p>
    
    <h3>I didn't receive my verification email. What should I do?</h3>
    <p>Check your spam folder first. If you still don't see it, try requesting a new verification email from the login page. Make sure you're using the correct email address.</p>
    
    <h3>Can I change my email address?</h3>
    <p>Yes, you can update your email address in your account settings. You'll need to verify the new email address before it becomes active.</p>
    
    <h3>How do I delete my account?</h3>
    <p>Go to Account Settings > Privacy & Security > Delete Account. This action is permanent and will remove all your data.</p>
    
    <h2>Personas and Scheduling</h2>
    
    <h3>What are personas?</h3>
    <p>Personas are lifestyle categories that help SXP understand your scheduling needs. We offer Student, Professional, Entrepreneur, Parent, and Retiree personas, each optimized for different lifestyles.</p>
    
    <h3>Can I change my persona?</h3>
    <p>Yes, you can change your persona in your account settings. This will update your schedule optimization preferences.</p>
    
    <h3>How does schedule optimization work?</h3>
    <p>SXP analyzes your activities, priorities, and constraints to suggest optimal time slots. It considers factors like your energy levels, deadlines, and personal preferences to create the most efficient schedule.</p>
    
    <h3>Can I manually adjust my schedule?</h3>
    <p>Absolutely! SXP provides suggestions, but you have full control to modify, add, or remove activities as needed.</p>
    
    <h2>Technical Issues</h2>
    
    <h3>The website is loading slowly. What should I do?</h3>
    <p>Try refreshing the page, clearing your browser cache, or checking your internet connection. If the issue persists, contact support.</p>
    
    <h3>I'm having trouble logging in. What can I do?</h3>
    <p>First, verify your email and password are correct. If you've forgotten your password, use the "Forgot Password" link. For persistent issues, contact support.</p>
    
    <h3>My schedule isn't saving. What's wrong?</h3>
    <p>Ensure you have a stable internet connection and try refreshing the page. If the problem continues, check if you're using a supported browser and try clearing your browser cache.</p>
    
    <h3>Is SXP compatible with my browser?</h3>
    <p>SXP works with Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+. For the best experience, we recommend using the latest version of your preferred browser.</p>
    
    <h2>Data and Privacy</h2>
    
    <h3>Is my data secure?</h3>
    <p>Yes, we use industry-standard encryption to protect your data. All communications are encrypted with HTTPS, and sensitive data is encrypted at rest.</p>
    
    <h3>What data does SXP collect?</h3>
    <p>We collect only the data necessary to provide our services: your account information, schedule preferences, and usage analytics. We never sell your personal data.</p>
    
    <h3>Can I export my data?</h3>
    <p>Yes, you can export your schedule data in various formats (CSV, JSON) from your account settings.</p>
    
    <h3>How long is my data stored?</h3>
    <p>Your data is stored as long as your account is active. When you delete your account, all associated data is permanently deleted within 30 days.</p>
    
    <h2>Features and Functionality</h2>
    
    <h3>Can I sync with my existing calendar?</h3>
    <p>Calendar integration is currently in development and will be available in future updates. You can manually import/export data in the meantime.</p>
    
    <h3>Does SXP work offline?</h3>
    <p>SXP is a web-based application that requires an internet connection. Offline functionality is planned for future releases.</p>
    
    <h3>Can I share my schedule with others?</h3>
    <p>Currently, schedules are private to your account. Team collaboration features are planned for future releases.</p>
    
    <h3>Is there a mobile app?</h3>
    <p>SXP is fully responsive and works great on mobile browsers. Native mobile apps are in development.</p>
    
    <h2>Billing and Subscriptions</h2>
    
    <h3>What's included in the free plan?</h3>
    <p>The free plan includes basic scheduling, one persona, and standard optimization features.</p>
    
    <h3>How do I upgrade to a paid plan?</h3>
    <p>Go to Account Settings > Billing to view available plans and upgrade options.</p>
    
    <h3>Can I cancel my subscription anytime?</h3>
    <p>Yes, you can cancel your subscription at any time from your account settings. You'll retain access until the end of your billing period.</p>
    
    <h3>Do you offer refunds?</h3>
    <p>We offer a 30-day money-back guarantee for new subscriptions. Contact support for refund requests.</p>
    
    <h2>Getting Help</h2>
    
    <h3>How can I contact support?</h3>
    <p>You can reach support through the help center in your account, email us directly, or use the contact form on our website.</p>
    
    <h3>What's the best way to get help?</h3>
    <p>Start with our User Guide and FAQ. For technical issues, include your browser version, operating system, and a description of the problem.</p>
    
    <h3>Do you offer training or tutorials?</h3>
    <p>Yes, we provide comprehensive documentation, video tutorials, and interactive guides to help you get the most out of SXP.</p>
    
    <h2>Still Have Questions?</h2>
    <p>If you can't find the answer you're looking for, please don't hesitate to contact our support team. We're here to help!</p>
  `;

  return (
    <DocumentationViewer
      title="FAQ"
      content={content}
      category="Support"
      lastUpdated="January 19, 2025"
    />
  );
};

export default FAQ;
