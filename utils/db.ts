import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  socials: [String],
  location: { type: String },
  bio: { type: String },
  followers: { type: Number },
  following: { type: Number },
  Achievements: [String],
  Organizations: [String],
});

// Schema for individual roadmap sections
const roadmapSectionSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  dayRange: { type: String, required: true },
  focusArea: { type: String, required: true },
  topics: [String],
  resources: [
    {
      title: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  completed: { type: Boolean, default: false },
});

// Schema for the entire roadmap
const roadmapSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  markdownContent: { type: String, required: true }, // Store original MD content
  sections: [roadmapSectionSchema], // Parse MD into structured sections
  versions: [
    {
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      prompt: String,
    },
  ],
});

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  if (!process.env.MONGO_KEY) {
    throw new Error("MongoDB connection string missing");
  }

  return mongoose.connect(process.env.MONGO_KEY);
};

// Export models
export const User = mongoose.models.User || model("User", userSchema);
export const Roadmap =
  mongoose.models.Roadmap || model("Roadmap", roadmapSchema);
export { connectDB };
