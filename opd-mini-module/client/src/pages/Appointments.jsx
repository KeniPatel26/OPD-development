import React, { useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  getPatients,
  getTodayAppointments,
  createAppointment,
  getDoctors,
  getConsultationByAppointment,
} from '../services/api';

import { useAuth } from '../context/AuthContext';

import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Appointments() {
  const [form, setForm] = useState({
    patient: '',
    doctor: '',
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: '',
  });

  const { user } = useAuth();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch patients
  const {
    data: patients = [],
    isLoading: patientsLoading,
  } = useQuery({
    queryKey: ['patients'],
    queryFn: () => getPatients(''),
  });

  // Fetch doctors
  const {
    data: doctors = [],
    isLoading: doctorsLoading,
  } = useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctors,
  });

  // Fetch today's appointments
  const {
    data: appointments = [],
    isLoading: appointmentsLoading,
  } = useQuery({
    queryKey: ['appointments', user?._id],
    queryFn: () => getTodayAppointments(user?.role === 'doctor' ? user._id : undefined),
  });

  // Create appointment mutation
  const mutation = useMutation({
    mutationFn: createAppointment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['appointments'],
      });

      setForm({
        ...form,
        patient: '',
        doctor: '',
        appointmentTime: '',
      });

      Swal.fire({
        icon: 'success',
        title: 'Appointment Booked',
        text: 'The appointment has been successfully scheduled.',
        timer: 2000,
        showConfirmButton: false,
      });
    },

    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text:
          error.response?.data?.error ||
          error.message ||
          'Something went wrong while booking the appointment.',
      });
    },
  });

  // Handle appointment booking
  const handleBook = (e) => {
    e.preventDefault();

    const patientName =
      patients.find((p) => p._id === form.patient)?.name ||
      'the patient';

    const doctorName =
      doctors.find((d) => d._id === form.doctor)?.name ||
      'the doctor';

    Swal.fire({
      title: 'Confirm Booking',
      text: `Book appointment for ${patientName} with ${doctorName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--primary)',
      cancelButtonColor: 'var(--text-muted)',
      confirmButtonText: 'Yes, book it!',
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate(form);
      }
    });
  };

  const handleViewSummary = async (appointmentId) => {
    try {
      const consultation = await getConsultationByAppointment(appointmentId);
      if (consultation) {
        Swal.fire({
          title: 'Consultation Summary',
          html: `
            <div style="text-align: left;">
              <p><strong>Doctor:</strong> ${consultation.doctor?.name || 'Unknown'}</p>
              <p><strong>BP:</strong> ${consultation.bloodPressure} | <strong>Temp:</strong> ${consultation.temperature}°F</p>
              <p><strong>Notes:</strong> ${consultation.notes}</p>
              <p><strong>Completed On:</strong> ${new Date(consultation.completedAt).toLocaleString()}</p>
            </div>
          `,
          icon: 'info',
          confirmButtonColor: 'var(--primary)'
        });
      } else {
        Swal.fire('Not Found', 'Consultation summary not available.', 'info');
      }
    } catch (err) {
      Swal.fire('Error', 'Could not fetch summary', 'error');
    }
  };

  return (
    <div>
      {/* =========================
          BOOK APPOINTMENT
      ========================== */}
      {user?.role !== 'doctor' && (
      <div className="card">
        <h2 className="card-title">Book Appointment</h2>

        <form onSubmit={handleBook} className="form-row">
          {/* Patient */}
          <div className="form-group">
            <label>Patient</label>

            <select
              className="form-control"
              value={form.patient}
              onChange={(e) =>
                setForm({
                  ...form,
                  patient: e.target.value,
                })
              }
              required
            >
              <option value="">Select Patient</option>

              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor */}
          <div className="form-group">
            <label>Doctor</label>

            <select
              className="form-control"
              value={form.doctor}
              onChange={(e) =>
                setForm({
                  ...form,
                  doctor: e.target.value,
                })
              }
              required
            >
              <option value="">Select Doctor</option>

              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} ({d.specialization})
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="form-group">
            <label>Date</label>

            <input
              className="form-control"
              type="date"
              value={form.appointmentDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  appointmentDate: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Time */}
          <div className="form-group">
            <label>Time</label>

            <input
              className="form-control"
              type="time"
              value={form.appointmentTime}
              onChange={(e) =>
                setForm({
                  ...form,
                  appointmentTime: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Submit */}
          <div
            className="form-group"
            style={{ justifyContent: 'flex-end' }}
          >
            <button
              type="submit"
              className="btn btn-primary"
              style={{ height: '44px' }}
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? 'Booking...'
                : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
      )}

      {/* =========================
          TODAY'S APPOINTMENTS
      ========================== */}
      <div className="card">
        <h2 className="card-title">Today's Appointments</h2>

        {patientsLoading ||
        doctorsLoading ||
        appointmentsLoading ? (
          <p
            style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'var(--text-muted)',
            }}
          >
            Loading...
          </p>
        ) : (
          <div className="table-container">
            <table className="table">
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
                {appointments.length > 0 ? (
                  appointments.map((a) => (
                    <tr key={a._id}>
                      {/* Patient */}
                      <td style={{ fontWeight: 500 }}>
                        {a.patient?.name || 'Unknown Patient'}
                      </td>

                      {/* Doctor */}
                      <td>
                        {a.doctor?.name ||
                          a.doctor ||
                          'Unknown Doctor'}
                      </td>

                      {/* Time */}
                      <td>{a.appointmentTime}</td>

                      {/* Status */}
                      <td>
                        <span
                          className={`badge ${
                            a.status === 'Completed'
                              ? 'badge-success'
                              : 'badge-warning'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        {a.status !== 'Completed' ? (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              navigate(
                                `/consultation/${a._id}`
                              )
                            }
                          >
                            Consult
                          </button>
                        ) : (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleViewSummary(a._id)}
                          >
                            View Summary
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: 'center',
                        padding: '2rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      No appointments for today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
