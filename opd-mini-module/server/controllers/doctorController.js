const Doctor = require('../models/Doctor');

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort('name');
    res.json(doctors);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
