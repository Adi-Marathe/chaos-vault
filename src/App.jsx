import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ProgressProvider } from './hooks/useProgress';
import TopBar from './components/TopBar/TopBar';
import PageTransition from './components/PageTransition/PageTransition';
import Landing from './pages/Landing/Landing';
import WorldMap from './pages/WorldMap/WorldMap';
import Level from './pages/Level/Level';
import Result from './pages/Result/Result';
import MobileNotSupported from './components/MobileNotSupported/MobileNotSupported';
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Landing />} />
          <Route path="/map" element={<WorldMap />} />
          <Route path="/play/:levelId" element={<Level />} />
          <Route path="/result/:levelId" element={<Result />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ProgressProvider>
        <MobileNotSupported />
        <div className="app-content">
          <TopBar />
          <AnimatedRoutes />
        </div>
      </ProgressProvider>
    </BrowserRouter>
  );
}
