const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');

exports.loginDoctor = async (req, res) => {
  try {
    const { doctorId, password } = req.body;
    
    if (!doctorId || !password) {
      return res.status(400).json({ error: 'Please provide doctor and password' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || doctor.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // For a simple assignment, we can just return the doctor object 
    // and let the frontend store it to know who is logged in.
    const token = jwt.sign({ id: doctor._id, role: 'doctor' }, 'secret_key', { expiresIn: '1d' });

    res.json({
      token,
      user: {
        _id: doctor._id,
        name: doctor.name,
        role: 'doctor',
        specialization: doctor.specialization
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
