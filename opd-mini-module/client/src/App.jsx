
import { Routes, Route, Link } from 'react-router-dom';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Consultation from './pages/Consultation';

function App() {
  return (
    <div>
      <nav style={{ padding: '1rem', background: '#eee', display: 'flex', gap: '1rem' }}>
        <strong>OPD Management</strong>
        <Link to="/patients">Patients</Link>
        <Link to="/appointments">Appointments</Link>
      </nav>
      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Patients />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/consultation/:appointmentId" element={<Consultation />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
