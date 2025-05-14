import { NextRequest, NextResponse } from "next/server";

// This is a mock API endpoint to fetch a roadmap by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In a real app, you would fetch this from a database
    // This is just mock data for demonstration purposes
    return NextResponse.json({
      _id: params.id,
      userId: "user123",
      title: "AI Development Roadmap",
      description:
        "Comprehensive guide to becoming an AI developer, from basics to advanced topics",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      markdownContent:
        "# AI Development Roadmap\n\nA comprehensive guide to becoming an AI developer.",
      language: "TypeScript",
      languageColor: "#3178c6",
      sections: [
        {
          title: "Foundations of AI",
          content:
            "Build fundamental knowledge of AI concepts, algorithms, and mathematics behind machine learning.",
          dayRange: "Days 1-14",
          focusArea: "Theory",
          topics: ["Linear Algebra", "Calculus", "Probability", "Statistics"],
          resources: [
            {
              title: "Mathematics for Machine Learning",
              url: "https://mml-book.github.io/",
            },
            {
              title: "AI For Everyone (Coursera)",
              url: "https://www.coursera.org/learn/ai-for-everyone",
            },
          ],
          completed: true,
        },
        {
          title: "Programming Skills",
          content:
            "Develop Python programming skills required for AI development, focusing on libraries and tools.",
          dayRange: "Days 15-30",
          focusArea: "Programming",
          topics: ["Python", "NumPy", "Pandas", "Data Visualization"],
          resources: [
            {
              title: "Python for Data Science",
              url: "https://pythonfordatascience.org/",
            },
            { title: "NumPy Tutorials", url: "https://numpy.org/learn/" },
          ],
          completed: true,
        },
        {
          title: "Machine Learning Basics",
          content:
            "Learn fundamental machine learning algorithms and techniques for data analysis.",
          dayRange: "Days 31-60",
          focusArea: "ML Algorithms",
          topics: [
            "Regression",
            "Classification",
            "Clustering",
            "Model Evaluation",
          ],
          resources: [
            {
              title: "Scikit-learn Documentation",
              url: "https://scikit-learn.org/",
            },
            {
              title: "Machine Learning by Andrew Ng",
              url: "https://www.coursera.org/learn/machine-learning",
            },
          ],
          completed: false,
        },
        {
          title: "Deep Learning",
          content:
            "Explore neural networks and deep learning frameworks for advanced AI applications.",
          dayRange: "Days 61-90",
          focusArea: "Neural Networks",
          topics: [
            "Neural Networks",
            "Backpropagation",
            "TensorFlow",
            "PyTorch",
          ],
          resources: [
            {
              title: "Deep Learning Book",
              url: "https://www.deeplearningbook.org/",
            },
            {
              title: "TensorFlow Tutorials",
              url: "https://www.tensorflow.org/tutorials",
            },
          ],
          completed: false,
        },
        {
          title: "Advanced AI Topics",
          content:
            "Study specialized AI topics including NLP, computer vision, and reinforcement learning.",
          dayRange: "Days 91-120",
          focusArea: "Specialized AI",
          topics: ["NLP", "Computer Vision", "Reinforcement Learning", "GANs"],
          resources: [
            {
              title: "CS224n: Natural Language Processing",
              url: "https://web.stanford.edu/class/cs224n/",
            },
            {
              title: "CS231n: Convolutional Networks",
              url: "https://cs231n.github.io/",
            },
          ],
          completed: false,
        },
      ],
      versions: [
        {
          content: "# Initial AI Roadmap",
          timestamp: new Date().toISOString(),
          prompt: "Create an AI development roadmap",
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching roadmap:", error);
    return new NextResponse("Error fetching roadmap", { status: 500 });
  }
}

// Handler for updating roadmap section completion status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    // In a real app, you would update this in your database
    // For now, just return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating roadmap:", error);
    return new NextResponse("Error updating roadmap", { status: 500 });
  }
}
