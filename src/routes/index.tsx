import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

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

// Simple placeholders for pages until we build them

const Dashboard = () => <div><h1 className="text-2xl font-bold mb-4">Dashboard</h1></div>;
const Studio = () => <div><h1 className="text-2xl font-bold mb-4">Studio do Professor</h1></div>;
const AdminPanel = () => <div><h1 className="text-2xl font-bold mb-4">Painel Administrativo</h1></div>;

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/apply" element={<TeacherApplication />} />
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
          {/* Add more common private routes here like /catalog, /profile */}
        </Route>
      </Route>

      {/* Teacher Routes */}
      <Route element={<ProtectedRoute allowedRoles={['professor', 'admin']} />}>
        <Route element={<TeacherLayout />}>
          <Route path="/teacher" element={<TeacherOverview />} />
          <Route path="/teacher/courses" element={<TeacherCourses />} />
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
