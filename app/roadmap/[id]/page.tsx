"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axios from "axios";

import Header from "../../components/header";
import Footer from "../../components/footer";
import ReadmeViewer from "../../components/ReadmeViewer";

interface Resource {
  title: string;
  url: string;
}

interface RoadmapSection {
  title: string;
  content: string;
  dayRange: string;
  focusArea: string;
  topics: string[];
  resources: Resource[];
  completed: boolean;
}

interface Roadmap {
  _id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: string;
  lastUpdated: string;
  markdownContent: string;
  sections: RoadmapSection[];
  versions: {
    content: string;
    timestamp: string;
    prompt?: string;
  }[];
  language: string;
  languageColor: string;
}

export default function RoadmapPage({ params }: { params: { id: string } }) {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<
    Record<number, boolean>
  >({});
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
      return;
    }

    const fetchRoadmap = async () => {
      try {
        // In a production app, you'd fetch this from an API
        const response = await axios.get(`/api/roadmap/${params.id}`);
        setRoadmap(response.data);
      } catch (error) {
        console.error("Error fetching roadmap:", error);
        // Mock data for demonstration
        setRoadmap({
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
              topics: [
                "Linear Algebra",
                "Calculus",
                "Probability",
                "Statistics",
              ],
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
              topics: [
                "NLP",
                "Computer Vision",
                "Reinforcement Learning",
                "GANs",
              ],
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
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [status, router, params.id]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleSectionCompletion = async (index: number) => {
    if (!roadmap) return;

    const updatedRoadmap = { ...roadmap };
    updatedRoadmap.sections[index].completed =
      !updatedRoadmap.sections[index].completed;

    // In a production app, you'd update this via API
    try {
      // await axios.patch(`/api/roadmap/${roadmap._id}`, {
      //   sectionId: index,
      //   completed: updatedRoadmap.sections[index].completed
      // });
      setRoadmap(updatedRoadmap);
    } catch (error) {
      console.error("Error updating section status:", error);
    }
  };

  const calculateProgress = (): number => {
    if (!roadmap || roadmap.sections.length === 0) return 0;

    const completedSections = roadmap.sections.filter(
      (section) => section.completed
    ).length;
    return Math.round((completedSections / roadmap.sections.length) * 100);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-slate-400">Roadmap not found</div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header activeTab="skills" onTabChange={() => {}} />

      <main className="flex-1 max-w-[1280px] mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-100 mb-2">
            {roadmap.title}
          </h1>
          <p className="text-slate-400 mb-4">{roadmap.description}</p>

          <div className="my-6">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Overall Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Roadmap Content Overview */}
        <div className="mb-8">
          <ReadmeViewer content={roadmap.markdownContent} />
        </div>

        {/* Roadmap Sections */}
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Sections</h2>
        <div className="space-y-4">
          {roadmap.sections.map((section, index) => (
            <div
              key={index}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => toggleSection(index)}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSectionCompletion(index);
                    }}
                    className="flex items-center justify-center"
                  >
                    {section.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-500 hover:text-slate-400" />
                    )}
                  </button>
                  <div>
                    <h3
                      className={`text-md font-medium ${
                        section.completed ? "text-slate-300" : "text-slate-100"
                      }`}
                    >
                      {section.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {section.dayRange} • {section.focusArea}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 bg-slate-700/50 rounded-full px-2 py-1">
                    {section.topics.length} topics
                  </span>
                  {expandedSections[index] ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {expandedSections[index] && (
                <div className="p-4 pt-0 border-t border-slate-700/50">
                  <p className="text-sm text-slate-300 my-3">
                    {section.content}
                  </p>

                  {/* Topics */}
                  <div className="my-4">
                    <h4 className="text-xs uppercase text-slate-400 mb-2">
                      Topics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {section.topics.map((topic, i) => (
                        <span
                          key={i}
                          className="text-xs text-slate-300 bg-slate-700/70 rounded-full px-3 py-1"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="mt-4">
                    <h4 className="text-xs uppercase text-slate-400 mb-2">
                      Resources
                    </h4>
                    <div className="space-y-2">
                      {section.resources.map((resource, i) => (
                        <a
                          key={i}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-400 hover:underline"
                        >
                          <BookOpen className="w-4 h-4" />
                          {resource.title}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
