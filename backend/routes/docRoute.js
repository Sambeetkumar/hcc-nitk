const express = require('express');
const { doctorList, doctorLogin, appointmentsDoctor, appointmentComplete, appointmentCancel,doctorDashboard,doctorProfile, updateDoctorProfile } = require('../controllers/doctorController');
const authDoctor = require('../middlewares/authDoctor');

const doctorRouter = express.Router();

doctorRouter.get('/list', doctorList);
doctorRouter.post('/login', doctorLogin);
doctorRouter.post('/appointments', authDoctor, appointmentsDoctor)
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete);
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel);
doctorRouter.post("/dashboard", authDoctor, doctorDashboard);
doctorRouter.post("/profile", authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);
module.exports = doctorRouter;