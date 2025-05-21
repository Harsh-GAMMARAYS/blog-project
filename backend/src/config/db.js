const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    const mongoUri = isProd ? process.env.MONGODB_URI_PROD : process.env.MONGODB_URI_DEV;
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 