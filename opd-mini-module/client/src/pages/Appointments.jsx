
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPatients, getTodayAppointments, createAppointment } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Appointments() {
  const [form, setForm] = useState({ patient: '', doctor: '', appointmentDate: new Date().toISOString().split('T')[0], appointmentTime: '' });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: patients = [] } = useQuery({ queryKey: ['patients'], queryFn: () => getPatients('') });
  const { data: appointments = [] } = useQuery({ queryKey: ['appointments'], queryFn: getTodayAppointments });

  const mutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });

  return (
    <div>
      <h2>Book Appointment</h2>
      <form onSubmit={e => { e.preventDefault(); mutation.mutate(form); }} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <select value={form.patient} onChange={e => setForm({...form, patient: e.target.value})} required>
          <option value="">Select Patient</option>
          {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <select value={form.doctor} onChange={e => setForm({...form, doctor: e.target.value})} required>
          <option value="">Select Doctor</option>
          <option value="Dr. Amit Shah">Dr. Amit Shah</option>
          <option value="Dr. Neha Patel">Dr. Neha Patel</option>
          <option value="Dr. Raj Mehta">Dr. Raj Mehta</option>
        </select>
        <input type="date" value={form.appointmentDate} onChange={e => setForm({...form, appointmentDate: e.target.value})} required />
        <input type="time" value={form.appointmentTime} onChange={e => setForm({...form, appointmentTime: e.target.value})} required />
        <button type="submit">Book Appointment</button>
      </form>

      <h2>Today's Appointments</h2>
      <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(a => (
            <tr key={a._id}>
              <td>{a.patient?.name}</td>
              <td>{a.doctor}</td>
              <td>{a.appointmentTime}</td>
              <td>{a.status}</td>
              <td>
                {a.status !== 'Completed' && (
                  <button onClick={() => navigate(`/consultation/${a._id}`)}>Consult</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
