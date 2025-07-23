const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/mongodb');
const connectCloudinary = require('./config/cloudinary');
const adminRouter = require('./routes/adminRoute');
const doctorRouter = require('./routes/docRoute');
const userRouter = require('./routes/userRoute');
require('dotenv').config();
//app config
const app = express();
const PORT = process.env.PORT || 4000;
dbConnect();
connectCloudinary();
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

//api endpoint
app.use('/api/admin', adminRouter);
//doctor endpoint
app.use('/api/doctor', doctorRouter);
//use endpoint
app.use('/api/user', userRouter);
app.get('/', (req, res) =>{
    res.send("api working fine")
})
//start express app
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})