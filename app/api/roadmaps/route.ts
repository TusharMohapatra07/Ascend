import { NextRequest, NextResponse } from "next/server";

// This is a mock API endpoint to fetch all roadmaps for a user
export async function GET(request: NextRequest) {
  try {
    // In a real app, you would fetch these from a database based on the authenticated user
    // This is just mock data for demonstration purposes
    return NextResponse.json([
      {
        _id: "roadmap-ai-dev",
        name: "AI-Development",
        title: "AI Development Roadmap",
        description:
          "Comprehensive guide to becoming an AI developer, from basics to advanced topics",
        language: "TypeScript",
        languageColor: "#3178c6",
        stars: 42,
        forks: 12,
        lastUpdated: new Date().toISOString(),
        sections: [
          {
            title: "Foundations of AI",
            content:
              "Build fundamental knowledge of AI concepts, algorithms, and mathematics behind machine learning.",
            dayRange: "Days 1-14",
            focusArea: "Theory",
            topics: ["Linear Algebra", "Calculus", "Probability", "Statistics"],
            resources: [],
            completed: true,
          },
          {
            title: "Programming Skills",
            content:
              "Develop Python programming skills required for AI development, focusing on libraries and tools.",
            dayRange: "Days 15-30",
            focusArea: "Programming",
            topics: [],
            resources: [],
            completed: true,
          },
          {
            title: "Machine Learning Basics",
            content:
              "Learn fundamental machine learning algorithms and techniques for data analysis.",
            dayRange: "Days 31-60",
            focusArea: "ML Algorithms",
            topics: [],
            resources: [],
            completed: false,
          },
          {
            title: "Deep Learning",
            content:
              "Explore neural networks and deep learning frameworks for advanced AI applications.",
            dayRange: "Days 61-90",
            focusArea: "Neural Networks",
            topics: [],
            resources: [],
            completed: false,
          },
          {
            title: "Advanced AI Topics",
            content:
              "Study specialized AI topics including NLP, computer vision, and reinforcement learning.",
            dayRange: "Days 91-120",
            focusArea: "Specialized AI",
            topics: [],
            resources: [],
            completed: false,
          },
        ],
      },
      {
        _id: "roadmap-ml-fundamentals",
        name: "ML-Fundamentals",
        title: "Machine Learning Fundamentals",
        description:
          "Essential concepts in machine learning from beginner to advanced",
        language: "Python",
        languageColor: "#3572A5",
        stars: 38,
        forks: 8,
        lastUpdated: new Date().toISOString(),
        sections: [
          {
            title: "Data Preprocessing",
            content:
              "Learn techniques for cleaning and preparing data for machine learning models.",
            dayRange: "Days 1-7",
            focusArea: "Data Engineering",
            topics: [
              "Data Cleaning",
              "Feature Engineering",
              "Data Normalization",
            ],
            resources: [],
            completed: true,
          },
          {
            title: "Supervised Learning",
            content:
              "Understanding supervised learning algorithms and their applications.",
            dayRange: "Days 8-21",
            focusArea: "Algorithms",
            topics: ["Regression", "Classification", "Decision Trees"],
            resources: [],
            completed: false,
          },
          {
            title: "Unsupervised Learning",
            content:
              "Exploring unsupervised learning techniques for pattern discovery.",
            dayRange: "Days 22-35",
            focusArea: "Algorithms",
            topics: [
              "Clustering",
              "Dimensionality Reduction",
              "Association Rules",
            ],
            resources: [],
            completed: false,
          },
        ],
      },
      {
        _id: "roadmap-web-dev",
        name: "Web-Development",
        title: "Full Stack Web Development",
        description:
          "Complete path from frontend to backend development using modern technologies",
        language: "JavaScript",
        languageColor: "#f1e05a",
        stars: 29,
        forks: 6,
        lastUpdated: new Date().toISOString(),
        sections: [
          {
            title: "HTML & CSS Fundamentals",
            content:
              "Building solid web foundations with modern HTML5 and CSS3 techniques.",
            dayRange: "Days 1-14",
            focusArea: "Frontend",
            topics: ["HTML5", "CSS3", "Responsive Design"],
            resources: [],
            completed: true,
          },
          {
            title: "JavaScript Essentials",
            content: "Core JavaScript concepts and modern ES6+ features.",
            dayRange: "Days 15-30",
            focusArea: "Frontend",
            topics: ["ES6+", "DOM Manipulation", "Async JavaScript"],
            resources: [],
            completed: true,
          },
          {
            title: "Frontend Frameworks",
            content:
              "Learning popular frontend frameworks for building modern UIs.",
            dayRange: "Days 31-60",
            focusArea: "Frontend",
            topics: ["React", "State Management", "Component Design"],
            resources: [],
            completed: true,
          },
          {
            title: "Backend Development",
            content: "Building robust backend systems and APIs.",
            dayRange: "Days 61-90",
            focusArea: "Backend",
            topics: ["Node.js", "Express", "REST APIs"],
            resources: [],
            completed: false,
          },
          {
            title: "Databases",
            content: "Understanding database design and implementation.",
            dayRange: "Days 91-105",
            focusArea: "Backend",
            topics: ["SQL", "MongoDB", "Database Design"],
            resources: [],
            completed: false,
          },
          {
            title: "DevOps & Deployment",
            content: "Deploying and managing web applications.",
            dayRange: "Days 106-120",
            focusArea: "Infrastructure",
            topics: ["Docker", "CI/CD", "Cloud Services"],
            resources: [],
            completed: false,
          },
        ],
      },
    ]);
  } catch (error) {
    console.error("Error fetching roadmaps:", error);
    return new NextResponse("Error fetching roadmaps", { status: 500 });
  }
}
