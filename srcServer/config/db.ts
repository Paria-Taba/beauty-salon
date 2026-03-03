import mongoose from "mongoose"

export const connectDB = async () => {
  try {
	console.log("MONGO_URI =", process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI as string)
    console.log("MongoDB connected")
  } catch (error) {
    console.error("MongoDB connection failed. Retrying in 5s...")
    setTimeout(() => connectDB(), 5000)
  }
}