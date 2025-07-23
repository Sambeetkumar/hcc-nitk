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
const allowedOrigins = [
    'https://hcc-nitk-js2d.vercel.app/',
   'https://hcc-nitk-qz4f.vercel.app/',
  'http://localhost:5174',// for local development
  'http://localhost:5173' // for local development
];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const message = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(message), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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