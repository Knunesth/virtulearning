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

// Simple placeholders for pages until we build them

import { Dashboard } from '../pages/Dashboard';
import { Resume } from '../pages/student/Resume';
import { Ranking } from '../pages/student/Ranking';
import { Quiz } from '../pages/student/Quiz';
import { Profile } from '../pages/student/Profile';
import { MyCourses } from '../pages/student/MyCourses';

const AdminPanel = () => <div><h1 className="text-2xl font-bold mb-4">Painel Administrativo</h1></div>;

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/apply" element={<TeacherApplication />} />
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
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
      </Route>
    </Routes>
  );
};
