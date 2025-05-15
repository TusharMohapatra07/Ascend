import { NextResponse } from "next/server";
import { connectDB, Roadmap } from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

// Get all roadmaps for the current user
export async function GET(req: Request) {
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

    // Get all roadmaps for the user
    const roadmaps = await Roadmap.find({ userId: user._id }).sort({
      lastUpdated: -1,
    });

    // Format the response to include language and languageColor fields
    const formattedRoadmaps = roadmaps.map((roadmap) => ({
      _id: roadmap._id,
      name: roadmap.title.replace(/\s+/g, "-").toLowerCase(), // Generate a name based on title
      title: roadmap.title,
      description: roadmap.description,
      createdAt: roadmap.createdAt,
      lastUpdated: roadmap.lastUpdated,
      language: "TypeScript", // Default language
      languageColor: "#3178c6", // Default color
      stars: 0, // Default values
      forks: 0,
      sections: roadmap.sections || [],
    }));

    return NextResponse.json(formattedRoadmaps);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
