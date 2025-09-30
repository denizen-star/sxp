import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import PersonaSelector from './components/PersonaSelector/PersonaSelector';
import ScheduleViewer from './components/ScheduleViewer/ScheduleViewer';
import NavigationGuide from './components/NavigationGuide/NavigationGuide';
import { AuthDemo, EnhancedSignup, EmailTest, EmailVerification, UserManagement, AuthActivity } from './modules/authentication-module';
import DatabaseQuery from './modules/authentication-module/components/DatabaseQuery/DatabaseQuery';
import { useStore } from './store/useStore';
import { DesignSystemProvider, useDesignSystem, ModernDropdownMenu } from './design-system';
import './App.css';

// Design system theme is now imported from design-system/theme.ts

function AppContent() {
  const { colors } = useDesignSystem();
  
  const {
    selectedPersona,
    personas,
    currentSchedule,
    isLoading,
    setSelectedPersona,
    loadPersonas,
  } = useStore();

  useEffect(() => {
    loadPersonas();
  }, [loadPersonas]);

  const handlePersonaSelect = (persona: any) => {
    setSelectedPersona(persona);
  };


  return (
    <Box sx={{ flexGrow: 1 }}>
      <ModernDropdownMenu />

      <Box 
        component="main"
        tabIndex={-1}
        sx={{ 
          minHeight: '100vh', 
          backgroundColor: colors.background.default, // #FFFFFF from Navigation Guide
          py: 0,
          outline: 'none',
          '&:focus': {
            outline: 'none'
          }
        }}
      >
        <Routes>
              <Route 
                path="/" 
                element={
                  <PersonaSelector
                    personas={personas}
                    selectedPersona={selectedPersona}
                    onPersonaSelect={handlePersonaSelect}
                    loading={isLoading}
                  />
                } 
              />
              <Route 
                path="/navigation-guide" 
                element={<NavigationGuide />} 
              />
              <Route 
                path="/schedule" 
                element={
                  selectedPersona ? (
                    <ScheduleViewer
                      schedule={currentSchedule}
                      persona={selectedPersona}
                      loading={isLoading}
                    />
                  ) : (
                    <Navigate to="/" replace />
                  )
                } 
              />
              <Route 
                path="/auth-activity" 
                element={
                  selectedPersona ? (
                    <AuthActivity showStats={true} maxEvents={100} />
                  ) : (
                    <Navigate to="/" replace />
                  )
                } 
              />
              <Route 
                path="/auth-demo" 
                element={<AuthDemo />} 
              />
              <Route 
                path="/signup" 
                element={<EnhancedSignup />} 
              />
              <Route 
                path="/email-test" 
                element={<EmailTest />} 
              />
              <Route 
                path="/verify-email/:token" 
                element={<EmailVerification />} 
              />
              <Route 
                path="/users" 
                element={
                  selectedPersona ? (
                    <UserManagement />
                  ) : (
                    <Navigate to="/" replace />
                  )
                } 
              />
              <Route 
                path="/database-query" 
                element={<DatabaseQuery />} 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <DesignSystemProvider>
      <Router>
        <AppContent />
      </Router>
    </DesignSystemProvider>
  );
}

export default App;
