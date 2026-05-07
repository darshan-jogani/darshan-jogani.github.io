import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './lib/theme.jsx';
import Preloader from './components/Preloader.jsx';
import PortfolioPage from './pages/PortfolioPage.jsx';
import LabPage from './pages/LabPage.jsx';

function AppRoutes() {
  const { pathname } = useLocation();
  const isLab = pathname.startsWith('/lab');

  return (
    <>
      {!isLab && <Preloader />}
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/lab" element={<LabPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}
