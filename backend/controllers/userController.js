const validator = require("validator");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const doctorModel = require("../models/doctorModel");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const appointmentModel = require("../models/appointmentModel");
require("dotenv").config();
//API TO REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //checking all fields
    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "missing details",
      });
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
    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    //creating new user entry in db
    const newUser = await userModel.create(userData);
    //creating a userToeken
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
//API FOR USER LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;//userid decoded from token using authUser middleware
    const useData = await userModel.findById(userId).select("-password");

    res.json({ success: true, user: useData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//api to update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address,
      dob,
      gender,
    });

    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//API TO BOOK APPOINTMENT
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    //retrieving doctor data
    const docData = await doctorModel.findById({ _id: docId }).select("-password")
    //check if doctor is available or not
    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }
    //fetch the slots_booked object
    let slots_booked = docData.slots_booked;

    // checking for slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");
    //removing the old slots_booked object as we will update with updated one
    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      slotTime,
      slotDate,
      date: Date.now(),
    };
    //creating a new appointment
    const newAppointment = await appointmentModel.create(appointmentData);

    // save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Booked" });
  }
  catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
//API TO GET APPOINTMENT LIST
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//api to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    //verify appointment user
    if (appointmentData.userId != userId) {
      return res.json({
        success: false,
        message:"unauthorised access"
      })
    }
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
module.exports.registerUser = registerUser;
module.exports.loginUser = loginUser;
module.exports.getProfile = getProfile;
module.exports.updateProfile = updateProfile;
module.exports.bookAppointment = bookAppointment;
module.exports.listAppointment = listAppointment;
module.exports.cancelAppointment = cancelAppointment;
