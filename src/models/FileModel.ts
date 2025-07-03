import mongoose, { models } from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    email: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true },
    description: { type: String, required: true },
    status: { type: String, default: "active" },
    folder: { type: String, default: "" },
  },
  { timestamps: true }
);

export const File = models.File || mongoose.model("File", FileSchema);
