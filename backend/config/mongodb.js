const mongoose = require('mongoose');
require('dotenv').config();
const dbConnect = async () => {
    
    mongoose.connection.on('connected',()=>console.log("Database connected"))
    await mongoose.connect(`${process.env.MONGODB_URL}/hcc-nitk`)
}

module.exports = dbConnect;