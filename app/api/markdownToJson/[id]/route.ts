import { NextResponse } from "next/server";
import { connectDB, Roadmap } from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

// Get a specific roadmap by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await mongoose.models.User.findOne({
      email: session.user.email,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const roadmapId = params.id;
    console.log("Getting roadmap with ID:", roadmapId);

    // Get a specific roadmap by ID
    const roadmap = await Roadmap.findOne({
      _id: roadmapId,
      userId: user._id,
    });

    if (!roadmap) {
      console.log("Roadmap not found");
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    // Format the response to match the expected format in the roadmap/[id]/page.tsx
    return NextResponse.json({
      _id: roadmap._id,
      userId: roadmap.userId,
      title: roadmap.title,
      description: roadmap.description,
      createdAt: roadmap.createdAt,
      lastUpdated: roadmap.lastUpdated,
      markdownContent: roadmap.markdownContent,
      sections: roadmap.sections,
      versions: roadmap.versions,
      language: "TypeScript", // Default values for fields that might not be in your DB schema
      languageColor: "#3178c6",
    });
  } catch (error) {
    console.error("Error getting roadmap:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Update a section's completion status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const roadmapId = params.id;
    const { sectionIndex, completed } = await request.json();

    // Get user ID
    const user = await mongoose.models.User.findOne({
      email: session.user.email,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the roadmap and update the section
    const roadmap = await Roadmap.findOne({
      _id: roadmapId,
      userId: user._id,
    });

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    // Update the section's completion status
    const updatedSections = [...roadmap.sections];
    if (updatedSections[sectionIndex]) {
      updatedSections[sectionIndex].completed = completed;
    }

    // Save the updated roadmap
    roadmap.sections = updatedSections;
    roadmap.lastUpdated = new Date();
    await roadmap.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
