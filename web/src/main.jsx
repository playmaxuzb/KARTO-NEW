import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { LangProvider } from './i18n.jsx';
import './styles.css';
import Site from './Site.jsx';
const DEMO = import.meta.env.VITE_DEMO === '1';
const CustomerApp = lazy(() => import('./CustomerApp.jsx'));
const Staff = lazy(() => import('./Staff.jsx'));
const Admin = lazy(() => import('./Admin.jsx'));
const DemoHub = lazy(() => import('./demo/DemoHub.jsx'));
if (DEMO) { const { installDemoServer } = await import('./demo/mockServer.js'); installDemoServer(); document.documentElement.classList.add('demo'); }

function DemoBack() {
  const loc = useLocation(); const nav = useNavigate();
  if (loc.pathname === '/') return null;
  return <button type="button" className="demo-back" onClick={() => { nav('/'); window.scrollTo(0, 0); }}>☰ Demo</button>;
}
const Router = DEMO ? MemoryRouter : BrowserRouter;
createRoot(document.getElementById('root')).render(
  <LangProvider>
    <Router>
      {DEMO && <DemoBack />}
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={DEMO ? <DemoHub /> : <Site />} />
          {DEMO && <Route path="/site" element={<Site />} />}
          <Route path="/app/*" element={<CustomerApp />} />
          <Route path="/staff/*" element={<Staff />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </Suspense>
    </Router>
  </LangProvider>
);
if (!DEMO && 'serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('/sw.js').catch(() => {});
