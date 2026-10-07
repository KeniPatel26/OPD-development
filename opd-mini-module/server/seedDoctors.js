require('dotenv').config();
const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing doctors to avoid duplicates
    await Doctor.deleteMany();

    await Doctor.create([
      { name: 'Dr. Amit Shah', specialization: 'General Physician' },
      { name: 'Dr. Neha Patel', specialization: 'Cardiologist' },
      { name: 'Dr. Raj Mehta', specialization: 'Dermatologist' }
    ]);
    
    console.log('Doctors seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
