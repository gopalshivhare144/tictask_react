import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import SignupPage from "../features/auth/pages/SignupPage";
import TaskListPage from "../features/tasks/pages/TaskListPage";
import CalendarPage from "../features/calendar/pages/CalendarPage";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import Layout from "../shared/components/Layout";
import { useAuth } from "../shared/hooks/useAuth";
import SettingsPage from "@/features/setting/pages/SettingsPage";
import FocusListPage from "@/features/focus/pages/FocusListPage";
import HabitListPage from "@/features/habit/pages/HabitListPage";

export default function AppRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/tasks" replace /> : <LoginPage />
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? <Navigate to="/tasks" replace /> : <SignupPage />
        }
      />

      {/* Protected Routes */}
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Layout>
              <TaskListPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <Layout>
              <CalendarPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/focus"
        element={
          <ProtectedRoute>
            <Layout>
              <FocusListPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/habit"
        element={
          <ProtectedRoute>
            <Layout>
              <HabitListPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/tasks" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
