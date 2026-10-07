
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPatients, createPatient, getPatientConsultations } from '../services/api';

export default function Patients() {
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
    }
  });

  const { data: history = [] } = useQuery({
    queryKey: ['history', historyPatient?._id],
    queryFn: () => getPatientConsultations(historyPatient._id),
    enabled: !!historyPatient
  });

  return (
    <div>
      <h2>Register Patient</h2>
      <form onSubmit={e => { e.preventDefault(); mutation.mutate(form); }} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input type="number" placeholder="Age" value={form.age} onChange={e => setForm({...form, age: e.target.value})} required />
        <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
        <button type="submit">Register</button>
      </form>

      <h2>Patients List</h2>
      <input 
        placeholder="Search by name or phone..." 
        value={search} 
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
          {patients.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.gender}</td>
              <td>{p.age}</td>
              <td>{p.phone}</td>
              <td>
                <button onClick={() => setHistoryPatient(p)}>History</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {historyPatient && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid black' }}>
          <h3>Consultation History - {historyPatient.name} <button onClick={() => setHistoryPatient(null)}>Close</button></h3>
          <ul>
            {history.map(h => (
              <li key={h._id}>
                {new Date(h.completedAt).toLocaleDateString()} | {h.doctor} | BP: {h.bloodPressure} | Temp: {h.temperature} | {h.notes}
              </li>
            ))}
            {history.length === 0 && <li>No history found.</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
