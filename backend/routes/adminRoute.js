const express = require('express');
const { addDoctor,loginAdmin,allDoctors,appointmentsAdmin, cancelAppointment, dashboardData } = require('../controllers/adminController');
const upload = require('../middlewares/multer');
const authAdmin = require('../middlewares/authAdmin');
const { changeAvailability } = require('../controllers/doctorController');

const adminRouter = express.Router();

adminRouter.post('/add-doctor',authAdmin,upload.single('image'), addDoctor);
adminRouter.post('/login', loginAdmin);
adminRouter.get('/all-doctors', authAdmin, allDoctors);
adminRouter.post('/change-availability', authAdmin, changeAvailability);
adminRouter.get('/appointments', authAdmin, appointmentsAdmin);
adminRouter.post('/cancel-appointment', authAdmin, cancelAppointment);
adminRouter.get('/dashboard', authAdmin, dashboardData);
module.exports = adminRouter;