import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import PostHogProvider from './providers/PostHogProvider';
import NotificationContainer from './components/NotificationContainer';
import HeroSection from './components/HeroSection';
import WhatYouGetSection from './components/WhatYouGetSection';
import AIMasterclassTVSection from './components/AIMasterclassTVSection';
import SocialProofSection from './components/SocialProofSection';
import FreeSyllabusPreviewSection from './components/FreeSyllabusPreviewSection';
import UpgradePathsSection from './components/UpgradePathsSection';
import MeetTheInstructorsSection from './components/MeetTheInstructorsSection';
import ValuePropositionSection from './components/ValuePropositionSection';
import ImagePreviews from './components/ImagePreviews';
import FAQSection from './components/FAQSection';
import FinalCallSection from './components/FinalCallSection';
import Footer from './components/Footer';
import QuizExample from './components/QuizExample';
import CoursePage from './pages/CoursePage';
import CourseListingPage from './pages/CourseListingPage';
import SuccessPage from './pages/SuccessPage';
import AuthCallback from './components/AuthCallback';
import { trackLanding } from './utils/utmTracking';
import { usePageTimeTracking } from './hooks/usePageTimeTracking';
import { useScrollTracking } from './hooks/useScrollTracking';
import { initGA, trackPageView } from './utils/googleAnalytics';
import { getUserId } from './utils/userIdentification';
import { identifyUser } from './utils/analytics';
import ReactGA from 'react-ga4';

function LandingPage() {
  // Track page time and scroll depth
  usePageTimeTracking({ pageName: 'landing_page' });
  useScrollTracking({ pageName: 'landing_page' });

  return (
    <div className="App">
      <HeroSection />
      <WhatYouGetSection />
      <AIMasterclassTVSection />
      <FreeSyllabusPreviewSection />
      <SocialProofSection />
      <MeetTheInstructorsSection />
      <ValuePropositionSection />
      <ImagePreviews />
      <UpgradePathsSection />
      <FAQSection />
      <FinalCallSection />
      <Footer />
    </div>
  );
}

function QuizPage() {
  usePageTimeTracking({ pageName: 'quiz_page' });
  useScrollTracking({ pageName: 'quiz_page' });
  
  return <QuizExample />;
}

// Component to track route changes and capture UTM params
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // Initialize Google Analytics on mount
    initGA();
    
    // Get or create user ID and set in both platforms
    const userId = getUserId();
    
    // Identify user in PostHog
    identifyUser(userId);
    
    // Set user ID in Google Analytics
    const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;
    if (measurementId) {
      ReactGA.gtag('config', measurementId, {
        user_id: userId,
      });
    }
  }, []);

  useEffect(() => {
    // Capture UTM parameters and track landing on initial load
    trackLanding();
    
    // Track page view in Google Analytics
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

function App() {
  return (
    <PostHogProvider>
      <NotificationProvider>
        <Router>
          <RouteTracker />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/course" element={<CoursePage />} />
            <Route path="/course-listing" element={<CourseListingPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/auth/verify" element={<AuthCallback />} />
          </Routes>
          <NotificationContainer />
        </Router>
      </NotificationProvider>
    </PostHogProvider>
  );
}

export default App;
