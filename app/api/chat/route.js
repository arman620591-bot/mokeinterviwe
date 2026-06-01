import { NextResponse } from "next/server";
import { generateGeminiChatText } from "@/lib/gemini-server";

function toText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function fallbackReply(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("roadmap") || lowerMessage.includes("plan")) {
    return "Start with fundamentals, practice small questions daily, review mistakes, then do one mock interview each week. Keep answers structured: concept, example, tradeoff, result.";
  }

  if (lowerMessage.includes("react") || lowerMessage.includes("hook")) {
    return "React hooks let function components use React features like state and side effects. Start with useState for changing values, useEffect for work after render, and useMemo only for expensive calculations.";
  }

  if (lowerMessage.includes("api") || lowerMessage.includes("backend") || lowerMessage.includes("status")) {
    return "For API answers, explain the request, validation, response status, and error handling. Example: missing input should usually return 400 Bad Request, while a new record should return 201 Created.";
  }

  if (lowerMessage.includes("database") || lowerMessage.includes("index")) {
    return "Database indexes help reads, filters, and sorting run faster, but they can make writes slightly slower because the database must update the index too. Use them on fields you query often.";
  }

  return "Tell me the topic you are preparing for, and I can explain it simply, make a study plan, or give you interview-style practice questions.";
}

export async function POST(request) {
  try {
    const body = await request.json();
    const message = toText(body?.message);

    if (!message) {
      return NextResponse.json({ message: "Message is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY && !process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return NextResponse.json({ reply: fallbackReply(message), source: "fallback" }, { status: 200 });
    }

    const prompt = [
      "You are an AI chatbot inside MockMate AI, an interview preparation app.",
      "Help students with interview prep, coding topics, resumes, projects, aptitude, and study plans.",
      "Use simple language. Keep answers practical and under 140 words.",
      "Answer directly as plain text. Do not use markdown tables.",
      `Student message: ${message}`,
    ].join("\n");

    try {
      const reply = toText(await generateGeminiChatText(prompt));
      return NextResponse.json(
        { reply: reply || fallbackReply(message), source: reply ? "gemini" : "fallback" },
        { status: 200 }
      );
    } catch (aiError) {
      console.error("Home chatbot AI fallback:", aiError);
      return NextResponse.json({ reply: fallbackReply(message), source: "fallback" }, { status: 200 });
    }
  } catch (error) {
    console.error("Home chatbot error:", error);
    return NextResponse.json(
      { reply: "Please type an interview or coding question, and I will help.", source: "fallback" },
      { status: 200 }
    );
  }
}
