import { NextResponse } from "next/server";
import { generateGeminiText, parseJsonFromAiText } from "@/lib/gemini-server";

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\n|;|,(?=\s*[A-Z])/)
      .map((item) => item.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean);
  }

  return [];
}

function getWords(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

function createFallbackFeedback(question, userAnswer) {
  const questionWords = new Set(getWords(question));
  const answerWords = getWords(userAnswer);
  const uniqueAnswerWords = new Set(answerWords);
  const matchedWords = [...uniqueAnswerWords].filter((word) => questionWords.has(word));
  const lengthScore = Math.min(4, Math.floor(answerWords.length / 18));
  const relevanceScore = Math.min(4, matchedWords.length);
  const detailScore = answerWords.length >= 35 ? 2 : answerWords.length >= 18 ? 1 : 0;
  const rating = Math.max(1, Math.min(10, 2 + lengthScore + relevanceScore + detailScore));

  return {
    rating,
    feedback:
      rating >= 7
        ? "Good answer. You included relevant experience and enough detail to show practical understanding."
        : "Your answer was saved, but AI feedback was unavailable. Add more specific examples, tools, impact, and reasoning to improve this response.",
    strengths:
      answerWords.length >= 18
        ? ["Provides a meaningful answer", "Mentions relevant experience"]
        : ["Answer was provided"],
    areasForImprovement: [
      "Add a concrete project example",
      "Explain your role, decisions, and results",
    ],
  };
}

export async function POST(request) {
  let question = "";
  let userAnswer = "";

  try {
    const body = await request.json();
    question = body.question;
    userAnswer = body.userAnswer;

    if (!question || !userAnswer) {
      return NextResponse.json(
        { message: "question and userAnswer are required" },
        { status: 400 }
      );
    }

    const prompt = [
      "You are an interview evaluator.",
      `Question: ${question}`,
      `Candidate answer: ${userAnswer}`,
      "Return ONLY valid JSON with this shape:",
      '{"rating":7,"feedback":"...","strengths":["..."],"areasForImprovement":["..."]}',
      "rating must be a number between 1 and 10.",
      "feedback must be concise and constructive.",
      "strengths and areasForImprovement must each contain 2 to 4 short strings.",
      "Do not wrap the JSON in markdown fences."
    ].join("\n");

    const text = await generateGeminiText(prompt);
    let parsed;

    try {
      parsed = parseJsonFromAiText(text);
    } catch (parseError) {
      console.error("Feedback JSON parse failed:", parseError);
      return NextResponse.json(createFallbackFeedback(question, userAnswer), {
        status: 200,
      });
    }

    const numericRating = Number(parsed?.rating);
    const safeRating = Number.isFinite(numericRating)
      ? Math.min(10, Math.max(1, numericRating))
      : 1;

    const feedback = String(parsed?.feedback || "").trim();
    const strengths = normalizeList(parsed?.strengths);
    const areasForImprovement = normalizeList(
      parsed?.areasForImprovement || parsed?.areas_for_improvement || parsed?.improvements
    );

    if (!feedback) {
      return NextResponse.json(createFallbackFeedback(question, userAnswer), {
        status: 200,
      });
    }

    return NextResponse.json(
      { rating: safeRating, feedback, strengths, areasForImprovement },
      { status: 200 }
    );
  } catch (error) {
    console.error("Feedback generation failed:", error);

    if (question && userAnswer) {
      return NextResponse.json(createFallbackFeedback(question, userAnswer), {
        status: 200,
      });
    }

    return NextResponse.json(
      { message: "Failed to generate feedback", error: error.message },
      { status: 500 }
    );
  }
}
