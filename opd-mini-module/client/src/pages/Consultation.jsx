import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAppointment, createConsultation } from '../services/api';
import Swal from 'sweetalert2';

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
      Swal.fire({
        icon: 'success',
        title: 'Consultation Completed',
        text: 'The consultation notes have been saved.',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        navigate('/appointments');
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error Saving Consultation',
        text: error.response?.data?.error || error.message
      });
    }
  });

  if (isLoading) return <div className="container"><p>Loading...</p></div>;
  if (!appointment) return <div className="container"><p>Appointment not found</p></div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Complete Consultation?',
      text: 'Are you sure you want to mark this consultation as completed?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--success)',
      cancelButtonColor: 'var(--text-muted)',
      confirmButtonText: 'Yes, complete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate({
          ...form,
          appointment: appointment._id,
          patient: appointment.patient._id,
          doctor: appointment.doctor
        });
      }
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card">
        <h2 className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
          Consultation
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/appointments')}>Back</button>
        </h2>
        
        <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Patient</p>
              <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{appointment.patient.name}</p>
              <p style={{ fontSize: '0.9rem' }}>{appointment.patient.age} yrs • {appointment.patient.gender}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Appointment Details</p>
              <p style={{ fontWeight: 500 }}>{appointment.doctor?.name || appointment.doctor}</p>
              <p style={{ fontSize: '0.9rem' }}>{new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-row" style={{ flexWrap: 'nowrap' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Blood Pressure (mmHg)</label>
              <input className="form-control" placeholder="e.g. 120/80" value={form.bloodPressure} onChange={e => setForm({...form, bloodPressure: e.target.value})} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Temperature (°F)</label>
              <input className="form-control" placeholder="e.g. 98.6" value={form.temperature} onChange={e => setForm({...form, temperature: e.target.value})} required />
            </div>
          </div>
          <div className="form-group">
            <label>Consultation Notes & Prescription</label>
            <textarea className="form-control" placeholder="Enter symptoms, diagnosis, and medications..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} required rows={5} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" className="btn" style={{ background: 'var(--success)', color: 'white', fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Complete Consultation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
