import { Routes, Route, NavLink } from 'react-router-dom';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Consultation from './pages/Consultation';

import { useAuth } from './context/AuthContext';
import LoginButton from './components/LoginButton';

function App() {
  const { user, login, logout } = useAuth();
  
  return (
    <div>
      <nav className="navbar">
        <NavLink to="/" className="navbar-brand">
          OPD Management
        </NavLink>
        <div className="nav-links">
          <NavLink to="/patients" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Patients</NavLink>
          <NavLink to="/appointments" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Appointments</NavLink>
          <LoginButton user={user} login={login} logout={logout} />
        </div>
      </nav>
      <div className="container">
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
