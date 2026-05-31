import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { DeviceFrame } from './presentation/components/device/DeviceFrame';
import { RequireAuth } from './presentation/components/RequireAuth';
import { Home } from './presentation/screens/Home';
import { JobEntry } from './presentation/screens/JobEntry';
import { SignIn } from './presentation/screens/SignIn';
import { Submitted } from './presentation/screens/Submitted';

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <FramedRoutes />
    </BrowserRouter>
  );
}

function FramedRoutes() {
  const { pathname } = useLocation();
  // Sign-in has a navy header → inverse status bar for legibility
  const inverseStatus = pathname === '/';

  return (
    <DeviceFrame inverseStatusBar={inverseStatus}>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/entry"
          element={
            <RequireAuth>
              <JobEntry />
            </RequireAuth>
          }
        />
        <Route
          path="/submitted"
          element={
            <RequireAuth>
              <Submitted />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DeviceFrame>
  );
}
