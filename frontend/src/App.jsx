import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackgroundMedia from './components/BackgroundMedia';
import EvaAssistant from './components/EvaAssistant';
import MobileBottomBar from './components/MobileBottomBar';
import WelcomeAssessmentModal from './components/WelcomeAssessmentModal';
import DragonflyAnimation from './components/DragonflyAnimation';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NutritionPage from './pages/NutritionPage';
import BreathePage from './pages/BreathePage';
import BookingPage from './pages/BookingPage';
import AssessmentPage from './pages/AssessmentPage';
import BreathingAssessmentPage from './pages/BreathingAssessmentPage';
import QuestionnairePage from './pages/QuestionnairePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ContactPage from './pages/ContactPage';
import TestimonialsPage from './pages/TestimonialsPage';
import NotFoundPage from './pages/NotFoundPage';

function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Prevent browser from automatically restoring previous scroll positions on back/forward or route switch
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (!hash) {
      // Temporarily bypass smooth-scrolling to ensure page snaps immediately to top
      const html = document.documentElement;
      const originalScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';

      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      html.scrollTop = 0;

      // Second frame check after React finishes render/paint to guarantee top position
      const rafId = requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        html.scrollTop = 0;
        html.style.scrollBehavior = originalScrollBehavior;
      });

      return () => cancelAnimationFrame(rafId);
    } else {
      const targetId = hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [pathname, search, hash]);

  return null;
}

function AppContent() {
  const { pathname } = useLocation();
  const isAuthPage = pathname === '/auth' || pathname === '/login';
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      <BackgroundMedia />
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/breathe" element={<BreathePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/breathing-assessment" element={<BreathingAssessmentPage />} />
        <Route path="/functional-breathing-assessment" element={<BreathingAssessmentPage />} />
        <Route path="/questionnaire" element={<QuestionnairePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {!isAuthPage && !isAdminPage && <Footer />}
      {!isAdminPage && <EvaAssistant />}
      {!isAuthPage && !isAdminPage && <MobileBottomBar />}
      <WelcomeAssessmentModal />
      <DragonflyAnimation />
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
