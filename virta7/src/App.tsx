import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ChildDataProvider } from './contexts/ChildDataContext';
import { AuthProvider, useAuth, roleHome } from './contexts/AuthContext';
import type { AuthRole } from './types/backend';
import { Login } from './routes/auth/Login';
import { Register } from './routes/auth/Register';
import { AdminDashboard } from './routes/admin/AdminDashboard';
import { TutorDashboard } from './routes/tutor/TutorDashboard';
import { ManageChild } from './routes/tutor/ManageChild';
import { AppShell } from './components/layout/AppShell';
import { AppBackground } from './components/layout/AppBackground';
import { Greeting } from './routes/Greeting';
import { Home } from './routes/Home';
import { VirtaGo } from './routes/VirtaGo';
import { Missions } from './routes/Missions';
import { Tasks } from './routes/Tasks';
import { Timetable } from './routes/Timetable';
import { Stars } from './routes/Stars';
import { Diary } from './routes/Diary';
import { DiaryEntryForm } from './routes/DiaryEntryForm';
import { Profile } from './routes/Profile';

function RootRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? roleHome(user.role) : '/login'} replace />;
}

function RequireRole({ role, children }: { role: AuthRole; children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={roleHome(user.role)} replace />;
  return children;
}

function ChildApp() {
  return (
    <RequireRole role="child">
      <ChildDataProvider>
        <AppShell />
      </ChildDataProvider>
    </RequireRole>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route
        path="/greeting"
        element={
          <RequireRole role="child">
            <Greeting />
          </RequireRole>
        }
      />

      <Route element={<ChildApp />}>
        <Route path="/home" element={<Home />} />
        <Route path="/virta-go" element={<VirtaGo />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/diary/new" element={<DiaryEntryForm />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/stars" element={<Stars />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/admin/dashboard"
        element={
          <RequireRole role="admin">
            <AdminDashboard />
          </RequireRole>
        }
      />
      <Route
        path="/tutor/dashboard"
        element={
          <RequireRole role="tutor">
            <TutorDashboard />
          </RequireRole>
        }
      />
      <Route
        path="/tutor/child/:childId"
        element={
          <RequireRole role="tutor">
            <ManageChild />
          </RequireRole>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <LanguageProvider>
          <AppBackground />
          <AppRoutes />
        </LanguageProvider>
      </AccessibilityProvider>
    </AuthProvider>
  );
}

export default App;
