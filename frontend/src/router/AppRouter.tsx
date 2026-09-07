import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { AdminDashboard } from '../pages/AdminDashboard';
import { EventDetail } from '../pages/EventDetail';
import { PhotoReview } from '../pages/PhotoReview';
import { TeamManagement } from '../pages/TeamManagement';
import { MemberDashboard } from '../pages/MemberDashboard';
import { CustomerGallery } from '../pages/CustomerGallery';

const ProtectedLayout: React.FC<{ allowedRoles?: string[] }> = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/member'} replace />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const RootRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/member'} replace />;
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer Unauthenticated Gallery Route */}
      <Route path="/gallery/:slug" element={<CustomerGallery />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedLayout allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/events" element={<AdminDashboard />} />
        <Route path="/admin/events/:eventId" element={<EventDetail />} />
        <Route path="/admin/events/:eventId/photos" element={<PhotoReview />} />
        <Route path="/admin/team" element={<TeamManagement />} />
      </Route>

      {/* Protected Team Member Routes */}
      <Route element={<ProtectedLayout allowedRoles={['TEAM_MEMBER', 'ADMIN']} />}>
        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/member/events" element={<MemberDashboard />} />
        <Route path="/member/events/:eventId" element={<EventDetail />} />
        <Route path="/member/uploads" element={<MemberDashboard />} />
      </Route>

      {/* Root Fallback */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
};
