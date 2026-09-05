import mongoose from 'mongoose';
import dns from 'dns';

// Ensure Node.js resolves MongoDB Atlas SRV records via public DNS servers (fixes querySrv ECONNREFUSED errors)
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore if DNS custom servers setting is prohibited in execution environment
}

const ATLAS_URI_DEFAULT = 'mongodb+srv://xasancloud_db_user:Hassan123456@personalfinance.zmxevnl.mongodb.net/personal-finance?retryWrites=true&w=majority&appName=PersonalFinance';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI_PROD || process.env.MONGO_URI || ATLAS_URI_DEFAULT;

    if (!mongoUri || typeof mongoUri !== 'string' || mongoUri.trim() === '') {
      throw new Error(
        'MongoDB connection error: Neither MONGO_URI_PROD nor MONGO_URI environment variable is provided.'
      );
    }

    const isAtlas = mongoUri.includes('mongodb.net');
    console.log(`[MongoDB] Connecting to ${isAtlas ? 'MongoDB Atlas Cloud Cluster' : 'Database'}...`);

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`[MongoDB] Successfully Connected to MongoDB (${conn.connection.host})`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Error] Connection failure: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
