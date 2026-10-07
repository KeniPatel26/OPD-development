
const express = require('express');
const router = express.Router();
const { completeConsultation, getPatientConsultations } = require('../controllers/consultationController');

router.post('/', completeConsultation);
router.get('/patient/:patientId', getPatientConsultations);

module.exports = router;
