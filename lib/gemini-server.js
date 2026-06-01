import { GoogleGenerativeAI } from "@google/generative-ai";

function getApiKey() {
  const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!key) {
    throw new Error("Missing Gemini API key. Set GEMINI_API_KEY in your environment.");
  }

  return key;
}

function extractJsonText(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty AI response");
  }

  const fenced = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const startObject = rawText.indexOf("{");
  const startArray = rawText.indexOf("[");

  let start = -1;
  if (startObject === -1) {
    start = startArray;
  } else if (startArray === -1) {
    start = startObject;
  } else {
    start = Math.min(startObject, startArray);
  }

  if (start === -1) {
    return rawText.trim();
  }

  const endObject = rawText.lastIndexOf("}");
  const endArray = rawText.lastIndexOf("]");
  const end = Math.max(endObject, endArray);

  if (end < start) {
    return rawText.slice(start).trim();
  }

  return rawText.slice(start, end + 1).trim();
}

export function parseJsonFromAiText(rawText) {
  const jsonText = extractJsonText(rawText);

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    const withoutMarkdown = jsonText
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/i, "")
      .trim();

    try {
      return JSON.parse(withoutMarkdown);
    } catch {
      throw new Error(
        `Failed to parse AI JSON response: ${error.message}. Raw response: ${rawText.slice(0, 500)}`
      );
    }
  }
}

export async function generateGeminiText(prompt) {
  const apiKey = getApiKey();
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateGeminiChatText(prompt) {
  const apiKey = getApiKey();
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 512,
    },
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}
