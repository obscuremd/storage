import mongoose, { models } from "mongoose";

const FolderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    title: { type: String, required: true },
    status: { type: String, default: "active" },
    files: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Folder = models.Folder || mongoose.model("Folder", FolderSchema);
