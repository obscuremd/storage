import { connectMongoDb } from "@/lib/mongoDb";
import { File } from "@/models/FileModel";
import { Folder } from "@/models/FolderModel";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const POST = async (req: NextRequest) => {
  try {
    await connectMongoDb();
    const { title, files, email, status } = await req.json();

    // 🔍 validating required fields
    if (!title || !email)
      return NextResponse.json(
        { message: "must have a title" },
        { status: 400 }
      );
    if (!files.length || files.length === 0)
      return NextResponse.json(
        { message: "must have at least 1 file in your folder" },
        { status: 400 }
      );

    // 🔒 check for duplicate title by the same user
    const existingFolder = await Folder.findOne({ title, email });
    if (existingFolder) {
      return NextResponse.json(
        { message: "You already have a folder with this title" },
        { status: 400 }
      );
    }

    // 📄 validate the existence of a file
    const fileDocs = await File.find({ _id: { $in: files } });

    if (fileDocs.length !== files.length) {
      return NextResponse.json(
        { message: "one or more files do not exist" },
        { status: 400 }
      );
    }

    // ⚠️ validate the status of a file and whether it belongs to a folder
    const inValidFiles = fileDocs.filter(
      (file) => file.status !== "active" || file.folder
    );

    if (inValidFiles.length > 0) {
      return NextResponse.json({
        message: "Some Files are inactive or already assineged to a folder",
        invalidFileIds: inValidFiles.map((f) => f._id),
      });
    }

    const newlyCreatedFolder = await Folder.create({
      title,
      files,
      email,
      status,
    });
    await File.updateMany(
      { _id: { $in: files } },
      { $set: { folder: newlyCreatedFolder._id } }
    );
    return NextResponse.json(
      { message: "Folder created successfully", data: newlyCreatedFolder },
      { status: 201 }
    );
  } catch (error) {
    NextResponse.json({ message: error, error }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectMongoDb();
    const searchParams = req.nextUrl.searchParams;

    const email = searchParams.get("email");
    const id = searchParams.get("id");
    const title = searchParams.get("title");

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { message: "invalid folder id" },
          { status: 400 }
        );
      }

      const folder = await Folder.findById(id);
      if (!folder) {
        return NextResponse.json(
          { message: "folder not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: "folder found", folder },
        { status: 200 }
      );
    }

    const filter: {
      email?: string;
      title?: string;
    } = {};

    if (email) filter.email = email;
    if (title) filter.title = title;

    const folders = await Folder.find(filter);

    return NextResponse.json(
      { message: "folders found", folders },
      { status: 200 }
    );
  } catch (error) {
    NextResponse.json({ message: error, error }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    await connectMongoDb();
    const id = req.nextUrl.searchParams.get("id");
    const data = await req.json();
    const { addFiles = [], removeFiles = [], ...rest } = data;

    const folder = await Folder.findById(id);
    if (!folder) {
      return NextResponse.json(
        { message: "Folder not found" },
        { status: 404 }
      );
    }

    // save existing files
    const existingFileIds = folder.files.map((fileId: string) =>
      fileId.toString()
    );

    // add files
    const updatedFileSet = new Set([
      ...existingFileIds,
      ...addFiles.map(String),
    ]);

    // remove files
    for (const fileId of removeFiles) {
      updatedFileSet.delete(fileId.toString());
    }

    // final Files array
    const updateFiles = Array.from(updatedFileSet);

    const updatedFolder = await Folder.findByIdAndUpdate(
      id,
      {
        ...rest,
        files: updateFiles,
      },
      { new: true }
    );

    return NextResponse.json(
      { message: "folder Updated Successfully", updatedFolder },
      { status: 200 }
    );
  } catch (error) {
    NextResponse.json({ message: error, error }, { status: 500 });
  }
};
