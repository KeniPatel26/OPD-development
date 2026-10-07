
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const getPatients = (search) => api.get('/patients', { params: { search } }).then(res => res.data);
export const createPatient = (data) => api.post('/patients', data).then(res => res.data);

export const getTodayAppointments = (doctorId) => api.get('/appointments/today', { params: { doctorId } }).then(res => res.data);
export const createAppointment = (data) => api.post('/appointments', data).then(res => res.data);
export const getAppointment = (id) => api.get(`/appointments/${id}`).then(res => res.data);

export const loginDoctor = (data) => api.post('/auth/login', data).then(res => res.data);

export const createConsultation = (data) => api.post('/consultations', data).then(res => res.data);
export const getPatientConsultations = (patientId) => api.get(`/consultations/patient/${patientId}`).then(res => res.data);
export const getConsultationByAppointment = (appointmentId) => api.get(`/consultations/appointment/${appointmentId}`).then(res => res.data);

export const getDoctors = () => api.get('/doctors').then(res => res.data);

export default api;
