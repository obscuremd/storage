import { NextRequest, NextResponse } from "next/server";
import { File } from "@/models/FileModel";
import { connectMongoDb } from "@/lib/mongoDb";
import mongoose from "mongoose";

export const POST = async (req: NextRequest) => {
  try {
    await connectMongoDb();
    const { title, email, url, type, size, description } = await req.json();

    if (!title || !email || !url || !type || !size) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await File.create({ title, email, url, type, size, description });
    return NextResponse.json(
      { message: "File uploaded successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectMongoDb();

    const searchParams = req.nextUrl.searchParams;

    const id = searchParams.get("id");
    const email = searchParams.get("email");
    const title = searchParams.get("title");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    // Fetch single file by ID
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { message: "Invalid file ID" },
          { status: 400 }
        );
      }

      const file = await File.findById(id);
      if (!file) {
        return NextResponse.json(
          { message: "File not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ file });
    }

    // Build dynamic query filter
    const filter: {
      email?: string;
      type?: string;
      status?: string;
      title?: string;
    } = {};
    if (email) filter.email = email;
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (title) filter.title = title;

    // Pagination logic
    const page = parseInt(pageParam || "1");
    const limit = parseInt(limitParam || "10");
    const skip = (page - 1) * limit;

    const files = await File.find(filter).skip(skip).limit(limit);
    const total = await File.countDocuments(filter);

    return NextResponse.json({
      files,
      page,
      totalPages: Math.ceil(total / limit),
      totalFiles: total,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    connectMongoDb();
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }

    const data = await req.json(); // Parse body
    const user = await File.findByIdAndUpdate(id, data, { new: true });
    if (!user) {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    } else {
      return NextResponse.json(
        { message: "File updated successfully", user },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
};
