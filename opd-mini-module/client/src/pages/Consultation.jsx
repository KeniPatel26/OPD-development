
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAppointment, createConsultation } from '../services/api';

export default function Consultation() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({ bloodPressure: '', temperature: '', notes: '' });

  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => getAppointment(appointmentId)
  });

  const mutation = useMutation({
    mutationFn: createConsultation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      navigate('/appointments');
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (!appointment) return <div>Not found</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...form,
      appointment: appointment._id,
      patient: appointment.patient._id,
      doctor: appointment.doctor
    });
  };

  return (
    <div>
      <h2>Consultation</h2>
      <div style={{ marginBottom: '20px' }}>
        <strong>Patient:</strong> {appointment.patient.name} ({appointment.patient.age} / {appointment.patient.gender}) <br/>
        <strong>Doctor:</strong> {appointment.doctor} <br/>
        <strong>Date & Time:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()} {appointment.appointmentTime}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input placeholder="Blood Pressure (e.g., 120/80)" value={form.bloodPressure} onChange={e => setForm({...form, bloodPressure: e.target.value})} required />
        <input placeholder="Temperature (e.g., 98.6)" value={form.temperature} onChange={e => setForm({...form, temperature: e.target.value})} required />
        <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} required rows={4} />
        <button type="submit">Complete Consultation</button>
      </form>
    </div>
  );
}
