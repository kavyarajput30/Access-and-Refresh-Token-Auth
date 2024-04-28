import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const Connection_instance = await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo DB Connected", Connection_instance.connection.host);
  } catch (err) {
    console.log("MONGO DB CONNECTION ERROR", err);
    process.exit(1);
  }
};


export default connectDB;