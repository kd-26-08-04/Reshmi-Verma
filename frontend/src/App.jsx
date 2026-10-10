import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackgroundMedia from './components/BackgroundMedia';
import EvaAssistant from './components/EvaAssistant';
import MobileBottomBar from './components/MobileBottomBar';

// Pages
import HomePage from './pages/HomePage';
import NutritionPage from './pages/NutritionPage';
import BreathePage from './pages/BreathePage';
import BookingPage from './pages/BookingPage';
import AssessmentPage from './pages/AssessmentPage';
import QuestionnairePage from './pages/QuestionnairePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const { pathname } = useLocation();
  const isAuthPage = pathname === '/auth' || pathname === '/login';

  return (
    <>
      <ScrollToTop />
      <BackgroundMedia />
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/breathe" element={<BreathePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/questionnaire" element={<QuestionnairePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {!isAuthPage && <Footer />}
      <EvaAssistant />
      {!isAuthPage && <MobileBottomBar />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
