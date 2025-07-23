const validator = require("validator");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken');
require('dotenv').config();
//API for adding doctors
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      address,
    } = req.body;
    const imageFile = req.file;
    // checking for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }
    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    // validating strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }
    // hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;
    //creating docData object
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      address,
      date: Date.now(),
    };
    //saving to db
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor Added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
//API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token,message:"Logged in successfully" });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//Api to get all doctors
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-passowrd");
    res.json({ success: true, doctors });
  }
  catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
//API TO GET ALL APPOINTMENTS LIST
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({
      success: true,
      appointments
    })
  }
  catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
//api to cancel an appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    console.log(appointmentId);
    //extract the appointment data
    const appointmentData = await appointmentModel.findById(appointmentId);
    const cancelledAppointment = await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
    //releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(item => item !== slotTime);
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({
      success: true,
      message:"appointment cancelled"
    })
  }
  catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
//API TO GET DASHBOARD DATA FOR ADMIN
const dashboardData = async (req, res) => {
  try {
     const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});
    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    res.json({ success: true, dashData });
  }
  catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
module.exports.addDoctor = addDoctor;
module.exports.loginAdmin = loginAdmin;
module.exports.allDoctors = allDoctors;
module.exports.appointmentsAdmin = appointmentsAdmin;
module.exports.cancelAppointment = cancelAppointment;
module.exports.dashboardData = dashboardData;
