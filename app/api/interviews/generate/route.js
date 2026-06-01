import { NextResponse } from "next/server";
import { generateGeminiText, parseJsonFromAiText } from "@/lib/gemini-server";

function normalizeQuestions(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.questions)) {
    return payload.questions;
  }

  return [];
}

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === "";
}

export async function POST(request) {
  try {
    const { jobPosition, jobDesc, jobExperience } = await request.json();

    if (isBlank(jobPosition) || isBlank(jobDesc) || isBlank(jobExperience)) {
      return NextResponse.json(
        { message: "jobPosition, jobDesc and jobExperience are required" },
        { status: 400 }
      );
    }

    const prompt = [
      "Generate exactly 5 mock interview questions.",
      `Job position: ${jobPosition}`,
      `Tech stack/job description: ${jobDesc}`,
      `Years of experience: ${jobExperience}`,
      "Return ONLY valid JSON as an array of objects with this shape:",
      '[{"question":"...","answer":"..."}]',
      "No markdown, no comments, no extra keys."
    ].join("\n");

    // If no server-side Gemini key is configured, return a safe sample set
    if (!process.env.GEMINI_API_KEY) {
      const sample = [
        { question: `Tell me about your experience with ${jobDesc}.`, answer: `Discuss relevant projects, frameworks, and outcomes.` },
        { question: `How would you approach a challenging ${jobPosition} problem?`, answer: `Outline steps: understand requirements, design, iterate, test.` },
        { question: `Explain a concept from ${jobDesc} you find important.`, answer: `Describe the concept clearly with examples.` },
        { question: `How do you optimize performance in ${jobDesc}?`, answer: `Discuss profiling, caching, and algorithmic improvements.` },
        { question: `Describe a time you overcame a difficult bug or deadline.`, answer: `Summarize situation, action, and result.` },
      ];

      return NextResponse.json({ questions: sample }, { status: 200 });
    }

    let parsed;
    try {
      const text = await generateGeminiText(prompt);
      parsed = parseJsonFromAiText(text);
    } catch (aiErr) {
      console.error('AI generation failed, returning sample fallback:', aiErr);
      const sample = [
        { question: `Tell me about your experience with ${jobDesc}.`, answer: `Discuss relevant projects, frameworks, and outcomes.` },
        { question: `How would you approach a challenging ${jobPosition} problem?`, answer: `Outline steps: understand requirements, design, iterate, test.` },
        { question: `Explain a concept from ${jobDesc} you find important.`, answer: `Describe the concept clearly with examples.` },
        { question: `How do you optimize performance in ${jobDesc}?`, answer: `Discuss profiling, caching, and algorithmic improvements.` },
        { question: `Describe a time you overcame a difficult bug or deadline.`, answer: `Summarize situation, action, and result.` },
      ];

      return NextResponse.json({ questions: sample }, { status: 200 });
    }
    const questions = normalizeQuestions(parsed)
      .map((item) => ({
        question: String(item?.question || "").trim(),
        answer: String(item?.answer || "").trim(),
      }))
      .filter((item) => item.question && item.answer)
      .slice(0, 5);

    if (questions.length === 0) {
      return NextResponse.json(
        { message: "AI returned an invalid question format" },
        { status: 422 }
      );
    }

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error('Generate route error:', error);
    return NextResponse.json(
      { message: "Failed to generate interview questions", error: error.message },
      { status: 500 }
    );
  }
}
