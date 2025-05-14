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

// Get all roadmaps for the current user
export async function GET() {
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
    return NextResponse.json(roadmaps);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
