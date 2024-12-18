const mongoose = require('mongoose');
require('dotenv').config();

const testMongoConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connection successful!');
    process.exit(0); // Exit process after success
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit process after failure
  }
};

testMongoConnection();
