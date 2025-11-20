import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

export interface Answer {
  id: string;
  question_id: string;
  user_id: string;
  answer: string;
  upvotes_count: number;
  is_seller: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    username: string;
    avatar_url?: string;
  };
}

export interface Question {
  id: string;
  product_id: string;
  user_id: string;
  question: string;
  upvotes_count: number;
  answers_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    username: string;
    avatar_url?: string;
  };
  answers?: Answer[];
}

interface QuestionsContextType {
  getProductQuestions: (productId: string) => Promise<Question[]>;
  askQuestion: (productId: string, question: string) => Promise<void>;
  answerQuestion: (questionId: string, answer: string, isSeller?: boolean) => Promise<void>;
  upvoteQuestion: (questionId: string) => Promise<void>;
  upvoteAnswer: (answerId: string) => Promise<void>;
  deleteQuestion: (questionId: string) => Promise<void>;
  deleteAnswer: (answerId: string) => Promise<void>;
  loading: boolean;
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

export function QuestionsProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getProductQuestions = useCallback(async (productId: string): Promise<Question[]> => {
    setLoading(true);
    const { data, error } = await supabase
      .from("questions")
      .select(
        `
        *,
        users:user_id (
          username,
          avatar_url
        ),
        answers (
          *,
          users:user_id (
            username,
            avatar_url
          )
        )
      `
      )
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    setLoading(false);

    if (error) {
      console.error("Error fetching questions:", error);
      return [];
    }

    return (data || []).map((question: any) => ({
      id: question.id,
      product_id: question.product_id,
      user_id: question.user_id,
      question: question.question,
      upvotes_count: question.upvotes_count,
      answers_count: question.answers_count,
      created_at: question.created_at,
      updated_at: question.updated_at,
      user: question.users
        ? {
            username: question.users.username,
            avatar_url: question.users.avatar_url,
          }
        : undefined,
      answers: question.answers
        ? question.answers.map((answer: any) => ({
            id: answer.id,
            question_id: answer.question_id,
            user_id: answer.user_id,
            answer: answer.answer,
            upvotes_count: answer.upvotes_count,
            is_seller: answer.is_seller,
            created_at: answer.created_at,
            updated_at: answer.updated_at,
            user: answer.users
              ? {
                  username: answer.users.username,
                  avatar_url: answer.users.avatar_url,
                }
              : undefined,
          }))
        : [],
    }));
  }, []);

  const askQuestion = useCallback(
    async (productId: string, question: string) => {
      if (!user) {
        console.error("Must be authenticated to ask questions");
        return;
      }

      setLoading(true);
      const { error } = await supabase.from("questions").insert({
        user_id: user.id,
        product_id: productId,
        question,
      });

      setLoading(false);

      if (error) {
        console.error("Error asking question:", error);
        throw error;
      }
    },
    [user]
  );

  const answerQuestion = useCallback(
    async (questionId: string, answer: string, isSeller = false) => {
      if (!user) {
        console.error("Must be authenticated to answer questions");
        return;
      }

      setLoading(true);
      const { error } = await supabase.from("answers").insert({
        user_id: user.id,
        question_id: questionId,
        answer,
        is_seller: isSeller,
      });

      setLoading(false);

      if (error) {
        console.error("Error answering question:", error);
        throw error;
      }
    },
    [user]
  );

  const upvoteQuestion = useCallback(async (questionId: string) => {
    setLoading(true);
    const { error } = await supabase.rpc("increment_question_upvotes", {
      question_id: questionId,
    });

    setLoading(false);

    if (error) {
      console.error("Error upvoting question:", error);
    }
  }, []);

  const upvoteAnswer = useCallback(async (answerId: string) => {
    setLoading(true);
    const { error } = await supabase.rpc("increment_answer_upvotes", {
      answer_id: answerId,
    });

    setLoading(false);

    if (error) {
      console.error("Error upvoting answer:", error);
    }
  }, []);

  const deleteQuestion = useCallback(
    async (questionId: string) => {
      if (!user) return;

      setLoading(true);
      const { error } = await supabase.from("questions").delete().eq("id", questionId).eq("user_id", user.id);

      setLoading(false);

      if (error) {
        console.error("Error deleting question:", error);
        throw error;
      }
    },
    [user]
  );

  const deleteAnswer = useCallback(
    async (answerId: string) => {
      if (!user) return;

      setLoading(true);
      const { error } = await supabase.from("answers").delete().eq("id", answerId).eq("user_id", user.id);

      setLoading(false);

      if (error) {
        console.error("Error deleting answer:", error);
        throw error;
      }
    },
    [user]
  );

  const value: QuestionsContextType = {
    getProductQuestions,
    askQuestion,
    answerQuestion,
    upvoteQuestion,
    upvoteAnswer,
    deleteQuestion,
    deleteAnswer,
    loading,
  };

  return <QuestionsContext.Provider value={value}>{children}</QuestionsContext.Provider>;
}

export function useQuestions() {
  const context = useContext(QuestionsContext);
  if (context === undefined) {
    throw new Error("useQuestions must be used within a QuestionsProvider");
  }
  return context;
}
