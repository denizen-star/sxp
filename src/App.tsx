import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import PersonaSelector from './components/PersonaSelector/PersonaSelector';
import ScheduleViewer from './components/ScheduleViewer/ScheduleViewer';
import DevelopmentTrack from './components/DevelopmentTrack/DevelopmentTrack';
import ServicesAvailable from './components/ServicesAvailable/ServicesAvailable';
import ApiDocumentation from './components/DocumentationPages/ApiDocumentation';
import UserGuide from './components/DocumentationPages/UserGuide';
import SetupGuide from './components/DocumentationPages/SetupGuide';
import DeploymentGuide from './components/DocumentationPages/DeploymentGuide';
import DevelopmentStatus from './components/DocumentationPages/DevelopmentStatus';
import ContributingGuide from './components/DocumentationPages/ContributingGuide';
import FAQ from './components/DocumentationPages/FAQ';
import SxpModules from './components/DocumentationPages/SxpModules';
import RealDataIntegration from './components/DocumentationPages/RealDataIntegration';
import LandingPage from './components/LandingPage/LandingPage';
import AuthPage from './components/auth/AuthPage';
import AuthEvents from './components/auth/AuthEvents';
import AuthGuard from './components/auth/AuthGuard';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
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
                  <AuthGuard>
                    <LandingPage />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/personas" 
                element={
                  <AuthGuard>
                    <PersonaSelector
                      personas={personas}
                      selectedPersona={selectedPersona}
                      onPersonaSelect={handlePersonaSelect}
                      loading={isLoading}
                    />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/development-track" 
                element={
                  <AuthGuard>
                    <DevelopmentTrack />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/services-available" 
                element={
                  <AuthGuard>
                    <ServicesAvailable />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/docs/api-documentation" 
                element={
                  <AuthGuard>
                    <ApiDocumentation />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/docs/user-guide" 
                element={
                  <AuthGuard>
                    <UserGuide />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/docs/setup-guide" 
                element={
                  <AuthGuard>
                    <SetupGuide />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/docs/deployment-guide" 
                element={
                  <AuthGuard>
                    <DeploymentGuide />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/docs/development-status" 
                element={
                  <AuthGuard>
                    <DevelopmentStatus />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/docs/contributing-guide" 
                element={
                  <AuthGuard>
                    <ContributingGuide />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/docs/faq" 
                element={
                  <AuthGuard>
                    <FAQ />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/docs/sxp-modules" 
                element={
                  <AuthGuard>
                    <SxpModules />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/docs/real-data-integration" 
                element={
                  <AuthGuard>
                    <RealDataIntegration />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/schedule" 
                element={
                  <AuthGuard>
                    {selectedPersona ? (
                      <ScheduleViewer
                        schedule={currentSchedule}
                        persona={selectedPersona}
                        loading={isLoading}
                      />
                    ) : (
                      <Navigate to="/" replace />
                    )}
                  </AuthGuard>
                } 
              />
              <Route 
                path="/auth" 
                element={<AuthPage />} 
              />
              <Route 
                path="/auth-events" 
                element={<AuthEvents />} 
              />
              <Route 
                path="/admin" 
                element={
                  <AuthGuard>
                    <AdminDashboard />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <AuthGuard>
                    <UserManagement />
                  </AuthGuard>
                } 
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
