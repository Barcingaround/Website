import { Routes, Route, Navigate } from 'react-router-dom';
import WizardShell from './components/wizard/WizardShell';

export default function App() {
  return (
    <Routes>
      <Route path="/build-your-board" element={<WizardShell />} />
      <Route path="/" element={<Navigate to="/build-your-board" replace />} />
    </Routes>
  );
}
