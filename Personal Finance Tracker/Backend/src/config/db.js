import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const localFallback = 'mongodb://127.0.0.1:27017/finance-tracker';

    let mongoUri = isProduction
      ? (process.env.MONGO_URI_PROD || process.env.MONGO_URI || localFallback)
      : (process.env.MONGO_URI_DEV || process.env.MONGO_URI || localFallback);

    if (typeof mongoUri !== 'string' || mongoUri.trim() === '') {
      mongoUri = localFallback;
    }

    // Check if Atlas connection string contains placeholder <db_username> or <db_password>
    if (mongoUri.includes('<db_username>') || mongoUri.includes('<db_password>')) {
      console.warn(
        `\n[MongoDB Notice] MONGO_URI_PROD contains placeholder '<db_username>'.\n` +
        `Replace <db_username> with your actual MongoDB Atlas database username in .env to connect to Atlas.\n` +
        `Falling back to local database: ${localFallback}\n`
      );
      mongoUri = localFallback;
    }

    const targetLabel = mongoUri.includes('mongodb.net') ? 'MongoDB Atlas Cluster' : 'Local MongoDB Instance';
    console.log(`[MongoDB] Connecting to ${targetLabel}...`);

    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB] Successfully Connected to MongoDB Atlas (${conn.connection.host})`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Error] Connection failure: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
