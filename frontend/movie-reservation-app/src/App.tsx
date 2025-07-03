import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ui/Toast';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';

// Lazy loading de páginas para mejorar performance
const HomePage = React.lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const MovieDetailPage = React.lazy(() => import('./pages/MovieDetailPage').then(module => ({ default: module.MovieDetailPage })));
const SeatSelectionPage = React.lazy(() => import('./pages/SeatSelectionPage').then(module => ({ default: module.SeatSelectionPage })));
const PaymentPage = React.lazy(() => import('./pages/PaymentPage').then(module => ({ default: module.PaymentPage })));
const ConfirmationPage = React.lazy(() => import('./pages/ConfirmationPage').then(module => ({ default: module.ConfirmationPage })));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));

// Componente de loading
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    <span className="ml-3 text-gray-600">Cargando...</span>
  </div>
);

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const { authModalOpen, authModalTab, closeAuthModal, toasts, removeToast } = useUIStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-16">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movie/:id" element={<MovieDetailPage />} />
              <Route path="/seats/:showtimeId" element={<SeatSelectionPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/confirmation/:transactionId" element={<ConfirmationPage />} />
              
              {/* Protected Routes */}
              {isAuthenticated && (
                <>
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/admin/*" element={<AdminDashboard />} />
                </>
              )}
            </Routes>
          </Suspense>
        </main>
        
        {/* Auth Modal */}
        <AuthModal 
          isOpen={authModalOpen}
          onClose={closeAuthModal}
          defaultTab={authModalTab}
        />

        {/* Toast Notifications */}
        <ToastContainer 
          toasts={toasts}
          onRemove={removeToast}
        />
      </div>
    </Router>
  );
}

export default App;
