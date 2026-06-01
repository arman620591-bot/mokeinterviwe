const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const safetySettings=[
  {
      category:HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold:HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
      category:HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold:HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
      category:HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold:HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
      category:HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold:HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  }
];

export const chatSession = model.startChat({
    generationConfig,
    safetySettings,
  });

export function parseGeminiJsonResponse(responseText, fallbackMessage) {
  const cleanedText = responseText.replace(/```json\s*|```/g, "").trim();

  const arrayStart = cleanedText.indexOf("[");
  const arrayEnd = cleanedText.lastIndexOf("]");
  if (arrayStart !== -1 && arrayEnd !== -1) {
    return JSON.parse(cleanedText.slice(arrayStart, arrayEnd + 1));
  }

  const objectStart = cleanedText.indexOf("{");
  const objectEnd = cleanedText.lastIndexOf("}");
  if (objectStart !== -1 && objectEnd !== -1) {
    const parsed = JSON.parse(cleanedText.slice(objectStart, objectEnd + 1));
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (Array.isArray(parsed.questions)) {
      return parsed.questions;
    }
    if (Array.isArray(parsed.interviewQuestions)) {
      return parsed.interviewQuestions;
    }
  }

  throw new Error(fallbackMessage || "Gemini response was not valid JSON");
}