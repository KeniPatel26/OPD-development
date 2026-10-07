
const Appointment = require('../models/Appointment');

exports.createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTodayAppointments = async (req, res) => {
  try {
    const { doctorId } = req.query;
    const start = new Date();
    start.setHours(0,0,0,0);
    const end = new Date();
    end.setHours(23,59,59,999);
    
    const query = { appointmentDate: { $gte: start, $lte: end } };
    if (doctorId) {
      query.doctor = doctorId;
    }
    
    const appointments = await Appointment.find(query)
      .populate('patient', 'name age phone')
      .populate('doctor', 'name specialization');
    res.json(appointments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('patient', 'name age phone gender').populate('doctor', 'name specialization');
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
