import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPatients, createPatient, getPatientConsultations } from '../services/api';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

export default function Patients() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', gender: '', age: '', phone: '' });
  const [historyPatient, setHistoryPatient] = useState(null);
  const queryClient = useQueryClient();

  const { data: patients = [] } = useQuery({
    queryKey: ['patients', search],
    queryFn: () => getPatients(search)
  });

  const mutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setForm({ name: '', gender: '', age: '', phone: '' });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Patient registered successfully.',
        timer: 2000,
        showConfirmButton: false
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.error || error.message
      });
    }
  });

  const { data: history = [] } = useQuery({
    queryKey: ['history', historyPatient?._id],
    queryFn: () => getPatientConsultations(historyPatient._id),
    enabled: !!historyPatient
  });

  const handleRegister = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Confirm Registration',
      text: `Are you sure you want to register ${form.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--primary)',
      cancelButtonColor: 'var(--text-muted)',
      confirmButtonText: 'Yes, register!'
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate(form);
      }
    });
  };

  return (
    <div>
      {user?.role !== 'doctor' && (
      <div className="card">
        <h2 className="card-title">Register Patient</h2>
        <form onSubmit={handleRegister} className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-control" placeholder="e.g. Rahul Patel" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select className="form-control" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="form-group">
            <label>Age</label>
            <input className="form-control" type="number" placeholder="e.g. 25" value={form.age} onChange={e => setForm({...form, age: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input className="form-control" placeholder="e.g. 9876543210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
          </div>
          <div className="form-group" style={{ justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" style={{ height: '44px' }}>Register Patient</button>
          </div>
        </form>
      </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title" style={{ marginBottom: 0 }}>Patients List</h2>
          <div className="search-bar" style={{ margin: 0 }}>
            <input 
              className="form-control"
              placeholder="Search by name or phone..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="table-container" style={{ marginTop: '1.5rem' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? patients.map(p => (
                <tr key={p._id}>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td>{p.gender}</td>
                  <td>{p.age}</td>
                  <td>{p.phone}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => setHistoryPatient(p)}>
                      View History
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {historyPatient && (
        <div className="history-modal-overlay" onClick={() => setHistoryPatient(null)}>
          <div className="history-modal" onClick={e => e.stopPropagation()}>
            <div className="history-modal-header">
              <h3>Consultation History: <span style={{ color: 'var(--primary)' }}>{historyPatient.name}</span></h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setHistoryPatient(null)}>Close</button>
            </div>
            
            {history.length > 0 ? (
              history.map(h => (
                <div key={h._id} className="history-item">
                  <div className="history-item-header">
                    <strong>{new Date(h.completedAt).toLocaleDateString()}</strong>
                    <span>{h.doctor?.name || h.doctor}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', margin: '0.5rem 0' }}>
                    <span className="badge badge-warning">BP: {h.bloodPressure}</span>
                    <span className="badge badge-warning">Temp: {h.temperature}°F</span>
                  </div>
                  <p style={{ color: 'var(--text-main)', marginTop: '0.5rem' }}>{h.notes}</p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No previous consultation history.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
