import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI_PROD || process.env.MONGO_URI;

    if (!mongoUri || typeof mongoUri !== 'string' || mongoUri.trim() === '') {
      throw new Error(
        'MongoDB connection error: Neither MONGO_URI_PROD nor MONGO_URI environment variable is provided.'
      );
    }

    console.log('[MongoDB] Connecting to database...');

    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB] Successfully Connected to MongoDB (${conn.connection.host})`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Error] Connection failure: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
