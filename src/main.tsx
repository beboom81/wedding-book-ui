import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
import './styles/common.css';
import './styles/animation.css';
import './styles/guest.css';
import './styles/admin.css';

import { ThemeProvider } from './context/ThemeContext';
import { LangProvider } from './context/LangContext';
import GuestPage from './pages/GuestPage';
import DashboardPage from './pages/DashboardPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LangProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<GuestPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </HashRouter>
      </LangProvider>
    </ThemeProvider>
  </StrictMode>,
);
