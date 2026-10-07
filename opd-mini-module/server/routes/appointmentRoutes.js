
const express = require('express');
const router = express.Router();
const { createAppointment, getTodayAppointments, getAppointment } = require('../controllers/appointmentController');

router.post('/', createAppointment);
router.get('/today', getTodayAppointments);
router.get('/:id', getAppointment);

module.exports = router;
