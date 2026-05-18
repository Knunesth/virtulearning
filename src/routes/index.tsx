import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { HybridLayout } from '../components/layout/HybridLayout';

import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { TeacherApplication } from '../pages/TeacherApplication';
import { Catalog } from '../pages/Catalog';
import { Landing } from '../pages/Landing';
import { TeacherLayout } from '../components/layout/TeacherLayout';
import { TeacherOverview } from '../pages/teacher/TeacherOverview';
import { TeacherCourses } from '../pages/teacher/TeacherCourses';
import { TeacherMessages } from '../pages/teacher/TeacherMessages';
import { TeacherProfile } from '../pages/teacher/TeacherProfile';
import { TeacherCourseBuilder } from '../pages/teacher/TeacherCourseBuilder';

import { Terms } from '../pages/Terms';
import { Privacy } from '../pages/Privacy';
import { Cookies } from '../pages/Cookies';
import { About } from '../pages/About';
import { Enterprise } from '../pages/Enterprise';

import { AdminLayout } from '../components/layout/AdminLayout';
import { AdminOverview } from '../pages/admin/AdminOverview';
import { AdminUsers } from '../pages/admin/AdminUsers';
import { AdminApplications } from '../pages/admin/AdminApplications';
import { AdminProfile } from '../pages/admin/AdminProfile';
import { AdminCourses } from '../pages/admin/AdminCourses';
import { AdminFinancials } from '../pages/admin/AdminFinancials';
import { AdminSettings } from '../pages/admin/AdminSettings';
import { AdminLogs } from '../pages/admin/AdminLogs';

// Simple placeholders for pages until we build them

import { Dashboard } from '../pages/Dashboard';
import { Resume } from '../pages/student/Resume';
import { Ranking } from '../pages/student/Ranking';
import { Quiz } from '../pages/student/Quiz';
import { Profile } from '../pages/student/Profile';
import { MyCourses } from '../pages/student/MyCourses';
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/apply" element={<TeacherApplication />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/about" element={<About />} />
        <Route path="/enterprise" element={<Enterprise />} />
      </Route>

      {/* Hybrid Routes (Adapta para Sidebar se logado) */}
      <Route element={<HybridLayout />}>
        <Route path="/catalog" element={<Catalog />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Private Routes */}
      <Route element={<ProtectedRoute allowedRoles={['aluno', 'professor', 'admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Teacher Routes */}
      <Route element={<ProtectedRoute allowedRoles={['professor', 'admin']} />}>
        <Route element={<TeacherLayout />}>
          <Route path="/teacher" element={<TeacherOverview />} />
          <Route path="/teacher/courses" element={<TeacherCourses />} />
          <Route path="/teacher/courses/:id/builder" element={<TeacherCourseBuilder />} />
          <Route path="/teacher/messages" element={<TeacherMessages />} />
          <Route path="/teacher/profile" element={<TeacherProfile />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/financials" element={<AdminFinancials />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/logs" element={<AdminLogs />} />
        </Route>
      </Route>
    </Routes>
  );
};
