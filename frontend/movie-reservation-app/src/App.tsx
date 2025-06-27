import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { SeatSelectionPage } from './pages/SeatSelectionPage';
import { PaymentPage } from './pages/PaymentPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const { authModalOpen, authModalTab, closeAuthModal } = useUIStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-16">
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
        </main>
        
        {/* Auth Modal */}
        <AuthModal 
          isOpen={authModalOpen}
          onClose={closeAuthModal}
          defaultTab={authModalTab}
        />
      </div>
    </Router>
  );
}

export default App;
