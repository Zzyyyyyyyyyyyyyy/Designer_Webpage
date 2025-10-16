import { useState } from "react";
import { MessageCircle, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface Question {
  id: string;
  question: string;
  askedBy: string;
  askedDate: string;
  answer?: Answer;
  helpful: number;
  notHelpful: number;
  isExpanded?: boolean;
}

interface Answer {
  text: string;
  answeredBy: string;
  answeredDate: string;
  isVerified?: boolean;
}

interface ProductQAProps {
  productId?: string;
}

export function ProductQA({ productId }: ProductQAProps) {
  const [showAskDialog, setShowAskDialog] = useState(false);
  const [questionInput, setQuestionInput] = useState("");
  const [sortBy, setSortBy] = useState<"helpful" | "newest">("helpful");
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  // BACKEND API PLACEHOLDER: Fetch product Q&A data
  // TODO: Replace with actual API call to /api/products/:id/questions
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      question: "What is the fabric composition of this item?",
      askedBy: "Sarah M.",
      askedDate: "2024-01-15",
      answer: {
        text: "This garment is made from 100% premium Italian wool with a polyester lining for added comfort and durability. The wool is sourced from sustainable farms and processed using eco-friendly methods.",
        answeredBy: "Design Team",
        answeredDate: "2024-01-16",
        isVerified: true,
      },
      helpful: 24,
      notHelpful: 2,
    },
    {
      id: "2",
      question: "Does this run true to size?",
      askedBy: "Michael R.",
      askedDate: "2024-01-10",
      answer: {
        text: "Yes, this item runs true to size. We recommend ordering your usual size for the best fit. If you prefer a more relaxed fit, consider sizing up.",
        answeredBy: "Customer Service",
        answeredDate: "2024-01-11",
        isVerified: true,
      },
      helpful: 45,
      notHelpful: 5,
    },
    {
      id: "3",
      question: "Can this be machine washed?",
      askedBy: "Jennifer L.",
      askedDate: "2024-01-08",
      answer: {
        text: "We recommend dry cleaning for best results. However, if you need to wash at home, use cold water on a gentle cycle and lay flat to dry. Avoid using a dryer as it may cause shrinkage.",
        answeredBy: "Care Specialist",
        answeredDate: "2024-01-09",
        isVerified: true,
      },
      helpful: 32,
      notHelpful: 3,
    },
    {
      id: "4",
      question: "Is this suitable for all seasons?",
      askedBy: "David K.",
      askedDate: "2024-01-05",
      answer: {
        text: "This piece is designed for fall and winter wear. The premium wool fabric provides excellent warmth while remaining breathable. For spring and summer, you might find it too warm.",
        answeredBy: "Style Advisor",
        answeredDate: "2024-01-06",
        isVerified: true,
      },
      helpful: 18,
      notHelpful: 1,
    },
  ]);

  const handleToggleExpand = (questionId: string) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleVote = (questionId: string, vote: "helpful" | "notHelpful") => {
    // BACKEND API PLACEHOLDER: Submit vote
    // TODO: Implement POST /api/questions/:id/vote with { vote }
    console.log(`Voted ${vote} on question ${questionId}`);

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            helpful: vote === "helpful" ? q.helpful + 1 : q.helpful,
            notHelpful: vote === "notHelpful" ? q.notHelpful + 1 : q.notHelpful,
          };
        }
        return q;
      })
    );
  };

  const handleAskQuestion = () => {
    if (questionInput.trim()) {
      // BACKEND API PLACEHOLDER: Submit new question
      // TODO: Implement POST /api/products/:id/questions with { question }
      console.log("Submitting question:", questionInput);
      setQuestionInput("");
      setShowAskDialog(false);
    }
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    if (sortBy === "helpful") {
      return b.helpful - a.helpful;
    } else {
      return new Date(b.askedDate).getTime() - new Date(a.askedDate).getTime();
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          Questions & Answers
        </h2>
        <Dialog open={showAskDialog} onOpenChange={setShowAskDialog}>
          <DialogTrigger asChild>
            <button className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors">
              Ask a Question
            </button>
          </DialogTrigger>
          <DialogContent className="bg-black border-gray-900 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl">Ask a Question</DialogTitle>
              <DialogDescription className="text-gray-400">
                Have a question about this product? Ask away and we'll get back to you soon.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <textarea
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Type your question here..."
                className="w-full h-32 px-4 py-3 bg-black border border-gray-900 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-700 resize-none"
                maxLength={500}
              />
              <p className="text-sm text-gray-500 mt-2 text-right">
                {questionInput.length}/500 characters
              </p>
            </div>
            <DialogFooter>
              <button
                onClick={() => setShowAskDialog(false)}
                className="px-4 py-2 bg-black border border-gray-900 text-white rounded-lg hover:bg-gray-900/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAskQuestion}
                disabled={!questionInput.trim()}
                className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Question
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSortBy("helpful")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            sortBy === "helpful"
              ? "bg-white text-black"
              : "bg-black border border-gray-900 text-gray-400 hover:text-white hover:border-gray-700"
          }`}
        >
          Most Helpful
        </button>
        <button
          onClick={() => setSortBy("newest")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            sortBy === "newest"
              ? "bg-white text-black"
              : "bg-black border border-gray-900 text-gray-400 hover:text-white hover:border-gray-700"
          }`}
        >
          Newest
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {sortedQuestions.map((q) => {
          const isExpanded = expandedQuestions.has(q.id);
          const shouldTruncate = q.answer && q.answer.text.length > 150;

          return (
            <div
              key={q.id}
              className="bg-black border border-gray-900 rounded-xl p-6 hover:border-gray-700 transition-colors"
            >
              {/* Question */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-gray-900/80 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                  {q.askedBy.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{q.question}</h3>
                  <p className="text-sm text-gray-400">
                    Asked by {q.askedBy} • {formatDate(q.askedDate)}
                  </p>
                </div>
              </div>

              {/* Answer */}
              {q.answer && (
                <div className="ml-11 bg-gray-900/80 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {q.answer.isVerified && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs font-semibold rounded">
                        Verified Answer
                      </span>
                    )}
                    <span className="text-sm text-gray-400">
                      {q.answer.answeredBy} • {formatDate(q.answer.answeredDate)}
                    </span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {shouldTruncate && !isExpanded
                      ? `${q.answer.text.substring(0, 150)}...`
                      : q.answer.text}
                  </p>
                  {shouldTruncate && (
                    <button
                      onClick={() => handleToggleExpand(q.id)}
                      className="text-white hover:underline text-sm mt-2 flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>
                          Show less <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Show more <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Voting */}
              <div className="ml-11 flex items-center gap-4">
                <span className="text-sm text-gray-400">Was this helpful?</span>
                <button
                  onClick={() => handleVote(q.id, "helpful")}
                  className="flex items-center gap-2 px-3 py-1.5 bg-black border border-gray-900 rounded-lg hover:border-gray-700 transition-colors group"
                >
                  <ThumbsUp className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                  <span className="text-sm text-gray-400 group-hover:text-white">
                    {q.helpful}
                  </span>
                </button>
                <button
                  onClick={() => handleVote(q.id, "notHelpful")}
                  className="flex items-center gap-2 px-3 py-1.5 bg-black border border-gray-900 rounded-lg hover:border-gray-700 transition-colors group"
                >
                  <ThumbsDown className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                  <span className="text-sm text-gray-400 group-hover:text-white">
                    {q.notHelpful}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {questions.length === 0 && (
        <div className="bg-black border border-gray-900 rounded-xl p-12 text-center">
          <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No questions yet</h3>
          <p className="text-gray-400 mb-6">
            Be the first to ask a question about this product!
          </p>
          <button
            onClick={() => setShowAskDialog(true)}
            className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Ask a Question
          </button>
        </div>
      )}
    </div>
  );
}

// BACKEND API PLACEHOLDER: Product Q&A
// TODO: Implement GET /api/products/:id/questions for fetching Q&A data
// TODO: Implement POST /api/products/:id/questions for submitting new questions
// TODO: Implement POST /api/questions/:id/vote for voting on questions
// TODO: Implement POST /api/questions/:id/answer for staff to answer questions
// TODO: Add pagination for large number of questions
// TODO: Add search/filter functionality for questions
// TODO: Add notification system for when questions are answered
