
const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  bloodPressure: { type: String },
  temperature: { type: String },
  notes: { type: String },
  status: { type: String, default: 'Completed' },
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Consultation', consultationSchema);
