import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGO_URL;

const options = {
  autoIndex: false, // Don't build indexes
  serverSelectionTimeoutMS: 7000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

const connectWithRetry = () => {
  mongoose
    .connect(url, options)
    .then(() => {
      console.log('MongoDB is connected');
    })
    .catch((err) => {
      console.log(
        'MongoDB connection unsuccessful, retry after 5 seconds.',
        err
      );
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose default connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log(
    'Mongoose default connection disconnected through app termination'
  );
  process.exit(0);
});
