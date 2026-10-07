
const express = require('express');
const router = express.Router();
const { completeConsultation, getPatientConsultations, getConsultationByAppointment } = require('../controllers/consultationController');

router.post('/', completeConsultation);
router.get('/patient/:patientId', getPatientConsultations);
router.get('/appointment/:appointmentId', getConsultationByAppointment);

module.exports = router;
