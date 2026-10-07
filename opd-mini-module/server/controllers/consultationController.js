
const Consultation = require('../models/Consultation');
const Appointment = require('../models/Appointment');

exports.completeConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.create(req.body);
    await Appointment.findByIdAndUpdate(req.body.appointment, { status: 'Completed' });
    res.status(201).json(consultation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPatientConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ patient: req.params.patientId }).sort('-completedAt').populate('appointment');
    res.json(consultations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
