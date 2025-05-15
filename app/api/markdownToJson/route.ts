import { NextResponse } from "next/server";
import { connectDB, Roadmap } from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

// Parse markdown table to extract sections
function parseMdToSections(markdownContent: string) {
  // This is a simplified implementation - you may need a more robust parser
  // depending on how your markdown is structured
  const sections = [];
  const dayRangeRegex = /#### \*\*Day (\d+)–(\d+): ([^\*]+)\*\*/g;
  let match;

  while ((match = dayRangeRegex.exec(markdownContent)) !== null) {
    const dayStart = match[1];
    const dayEnd = match[2];
    const focusArea = match[3].trim();
    const dayRange = `Day ${dayStart}–${dayEnd}`;

    // Find the content for this section until the next section or end
    const sectionStartIndex = match.index;
    const nextSectionMatch = dayRangeRegex.exec(markdownContent);
    const sectionEndIndex = nextSectionMatch
      ? nextSectionMatch.index
      : markdownContent.length;
    dayRangeRegex.lastIndex = match.index + 1; // Reset regex to continue from the current match

    const sectionContent = markdownContent
      .substring(sectionStartIndex, sectionEndIndex)
      .trim();

    // Extract topics and resources
    const topicsRegex = /\*\*([^\*]+)\*\*/g;
    const resourcesRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
    const topics = [];
    const resources = [];

    let topicMatch;
    while ((topicMatch = topicsRegex.exec(sectionContent)) !== null) {
      topics.push(topicMatch[1].trim());
    }

    let resourceMatch;
    while ((resourceMatch = resourcesRegex.exec(sectionContent)) !== null) {
      resources.push({
        title: resourceMatch[1],
        url: resourceMatch[2],
      });
    }

    sections.push({
      title: `${dayRange}: ${focusArea}`,
      content: sectionContent,
      dayRange,
      focusArea,
      topics,
      resources,
      completed: false,
    });
  }

  return sections;
}

// Update a section's completion status
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const roadmapId = pathParts[pathParts.length - 1];

    // If we don't have a roadmap ID, return an error
    if (!roadmapId || roadmapId === "markdownToJson") {
      return NextResponse.json(
        { error: "Roadmap ID required" },
        { status: 400 }
      );
    }

    const { sectionIndex, completed } = await req.json();

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

// Create a new roadmap
export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { title, description, markdownContent, prompt } = await req.json();

    // Get user ID
    const user = await mongoose.models.User.findOne({
      email: session.user.email,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse markdown into sections
    const sections = parseMdToSections(markdownContent);

    // Create new roadmap
    const roadmap = new Roadmap({
      userId: user._id,
      title,
      description,
      markdownContent,
      sections,
      versions: [
        {
          content: markdownContent,
          timestamp: new Date(),
          prompt,
        },
      ],
    });

    await roadmap.save();

    return NextResponse.json({
      success: true,
      roadmapId: roadmap._id,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Get all roadmaps for the current user or a specific roadmap by ID
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

    // Check if an ID is provided in the URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const roadmapId = pathParts[pathParts.length - 1];

    // If the last part of the path is not 'markdownToJson', it's an ID
    if (roadmapId && roadmapId !== "markdownToJson") {
      // Get a specific roadmap by ID
      console.log("roadmapId", roadmapId);
      const roadmap = await Roadmap.findOne({
        
        _id: roadmapId,
        userId: user._id,
      });

      if (!roadmap) {
        return NextResponse.json(
          { error: "Roadmap not found" },
          { status: 404 }
        );
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
        language: "TypeScript", // Add default values for fields that might not be in your DB schema
        languageColor: "#3178c6",
      });
    }

    // Otherwise, get all roadmaps for the user
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
