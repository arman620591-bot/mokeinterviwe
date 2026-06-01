"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Code2,
  Database,
  FileCode2,
  Gauge,
  Layers3,
  RotateCcw,
  Send,
  Server,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

const questions = [
  {
    skill: "React",
    icon: Code2,
    question: "Which hook is used to run side effects after a component renders?",
    options: ["useMemo", "useEffect", "useRef", "useReducer"],
    answer: "useEffect",
    explanation: "useEffect runs side effects such as fetching data, subscriptions, or DOM updates after render.",
  },
  {
    skill: "JavaScript",
    icon: FileCode2,
    question: "What does the spread operator do in JavaScript?",
    options: [
      "Deletes items from an array",
      "Expands iterable values or object properties",
      "Stops function execution",
      "Converts strings to numbers",
    ],
    answer: "Expands iterable values or object properties",
    explanation: "The spread operator expands arrays, objects, and other iterable values into another expression.",
  },
  {
    skill: "Backend",
    icon: Server,
    question: "Which HTTP status code is best for a successful resource creation?",
    options: ["200", "201", "400", "500"],
    answer: "201",
    explanation: "201 Created indicates that a new resource was successfully created.",
  },
  {
    skill: "Database",
    icon: Database,
    question: "Why do we add an index to a database field?",
    options: [
      "To make all writes faster",
      "To improve lookup and sort performance",
      "To encrypt the database",
      "To remove duplicate rows automatically",
    ],
    answer: "To improve lookup and sort performance",
    explanation: "Indexes help databases find and sort records faster, especially on frequently queried fields.",
  },
  {
    skill: "API",
    icon: Layers3,
    question: "What should an API return when required input is missing?",
    options: ["400 Bad Request", "201 Created", "301 Redirect", "204 No Content"],
    answer: "400 Bad Request",
    explanation: "400 Bad Request is appropriate when the client sends invalid or incomplete data.",
  },
  {
    skill: "React",
    icon: Code2,
    question: "In React, why should list items have stable keys?",
    options: [
      "To make CSS load faster",
      "To help React identify changed, added, or removed items",
      "To make state global",
      "To stop component rendering",
    ],
    answer: "To help React identify changed, added, or removed items",
    explanation: "Keys help React reconcile lists accurately and avoid incorrect UI updates.",
  },
  {
    skill: "Problem Solving",
    icon: Gauge,
    question: "What is the best first step when debugging a production bug?",
    options: [
      "Rewrite the whole feature",
      "Reproduce and isolate the issue",
      "Delete logs",
      "Change unrelated code",
    ],
    answer: "Reproduce and isolate the issue",
    explanation: "A reliable reproduction helps you understand the cause before changing code.",
  },
  {
    skill: "Security",
    icon: Server,
    question: "Where should secret API keys be stored in a Next.js app?",
    options: [
      "In public client-side code",
      "In environment variables on the server",
      "Inside localStorage",
      "Inside README.md",
    ],
    answer: "In environment variables on the server",
    explanation: "Secrets should stay server-side in environment variables and never be exposed to the browser.",
  },
  {
    skill: "Database",
    icon: Database,
    question: "What does a unique constraint prevent?",
    options: [
      "Slow network requests",
      "Duplicate values in a field",
      "Null values only",
      "Frontend rendering errors",
    ],
    answer: "Duplicate values in a field",
    explanation: "A unique constraint ensures no two records use the same value for that constrained field.",
  },
  {
    skill: "Interview",
    icon: BarChart3,
    question: "What makes a technical interview answer stronger?",
    options: [
      "Only saying the final answer",
      "Explaining tradeoffs and reasoning clearly",
      "Avoiding examples",
      "Using as many buzzwords as possible",
    ],
    answer: "Explaining tradeoffs and reasoning clearly",
    explanation: "Interviewers look for clear reasoning, examples, tradeoffs, and communication.",
  },
];

const recommendations = {
  React: "Review hooks, component state, props, keys, forms, and rendering behavior.",
  JavaScript: "Practice array/object methods, async code, closures, spread/rest, and destructuring.",
  Backend: "Practice status codes, validation, API design, authentication, and error handling.",
  Database: "Review schemas, indexes, unique constraints, filtering, sorting, and query design.",
  API: "Practice request validation, response formats, status codes, and failure handling.",
  "Problem Solving": "Practice reproducing bugs, breaking problems down, and explaining your approach.",
  Security: "Review environment variables, server-only secrets, authentication, and input validation.",
  Interview: "Practice structured answers using situation, action, result, and technical tradeoffs.",
};

function getLevel(percent) {
  if (percent >= 85) return "Advanced";
  if (percent >= 60) return "Intermediate";
  return "Beginner";
}

function getScoreMessage(percent) {
  if (percent >= 85) return "Excellent work. You are ready for stronger mock interview practice.";
  if (percent >= 60) return "Good progress. A little focused revision will raise your confidence quickly.";
  return "Keep practicing. Start with fundamentals and repeat the assessment after revision.";
}

export default function SkillAssessmentPage() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const score = useMemo(() => {
    return questions.reduce((total, item, index) => {
      return total + (answers[index] === item.answer ? 1 : 0);
    }, 0);
  }, [answers]);

  const percent = Math.round((score / questions.length) * 100);
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  const weakSkills = useMemo(() => {
    const missed = questions.filter((item, index) => answers[index] !== item.answer);
    const uniqueSkills = [...new Set(missed.map((item) => item.skill))];
    return uniqueSkills.slice(0, 4);
  }, [answers]);

  const handleSelect = (questionIndex, option) => {
    if (submitted) {
      return;
    }

    setAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const handleSubmit = () => {
    if (answeredCount < questions.length) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetAssessment = () => {
    setAnswers({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-24">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Skill Assessment
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
              Complete your technical skill quiz
            </h1>
            <p className="mt-3 max-w-2xl text-gray-600">
              Answer all questions, submit once, and see your score with targeted improvement areas.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Start Mock Interview
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {submitted && (
          <div className="mb-6 rounded-lg border border-indigo-100 bg-white p-6 shadow-sm">
            <div className="grid gap-5 md:grid-cols-[1fr_220px] md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                  Your Result
                </p>
                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {score}/{questions.length} correct
                </h2>
                <p className="mt-2 text-gray-600">{getScoreMessage(percent)}</p>
              </div>
              <div className="rounded-lg bg-indigo-50 p-5 text-center">
                <p className="text-sm font-semibold text-indigo-700">Score</p>
                <p className="mt-1 text-4xl font-bold text-indigo-700">{percent}%</p>
                <p className="mt-1 text-sm text-gray-600">{getLevel(percent)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            {questions.map((item, index) => {
              const Icon = item.icon;
              const selected = answers[index];
              const isCorrect = selected === item.answer;

              return (
                <div key={`${item.skill}-${item.question}`} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-start gap-3">
                    <div className="rounded-md bg-indigo-50 p-2 text-indigo-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-gray-900">
                          Question {index + 1}
                        </h2>
                        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                          {item.skill}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-gray-700">{item.question}</p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {item.options.map((option) => {
                      const optionIsSelected = selected === option;
                      const optionIsCorrect = submitted && option === item.answer;
                      const optionIsWrong = submitted && optionIsSelected && option !== item.answer;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleSelect(index, option)}
                          className={`flex min-h-12 items-center justify-between rounded-md border px-4 py-3 text-left text-sm transition ${
                            optionIsCorrect
                              ? "border-green-500 bg-green-50 text-green-900"
                              : optionIsWrong
                              ? "border-red-500 bg-red-50 text-red-900"
                              : optionIsSelected
                              ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                              : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-gray-50"
                          } ${submitted ? "cursor-default" : ""}`}
                        >
                          <span>{option}</span>
                          {optionIsCorrect && <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />}
                          {optionIsWrong && <XCircle className="h-5 w-5 shrink-0 text-red-600" />}
                          {!submitted && optionIsSelected && (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-indigo-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div className={`mt-4 rounded-md p-3 text-sm ${isCorrect ? "bg-green-50 text-green-900" : "bg-amber-50 text-amber-900"}`}>
                      <p className="font-semibold">
                        {isCorrect ? "Correct" : `Correct answer: ${item.answer}`}
                      </p>
                      <p className="mt-1 leading-5">{item.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="h-fit rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Answered</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {answeredCount}/{questions.length}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-indigo-600" />
              </div>

              <div className="mb-5">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-500">{submitted ? "Final Score" : "Progress"}</span>
                  <span className="font-semibold text-gray-900">
                    {submitted ? `${percent}%` : `${progressPercent}%`}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all"
                    style={{ width: `${submitted ? percent : progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="rounded-md bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Level</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {submitted ? getLevel(percent) : "Submit to view"}
                </p>
              </div>

              {submitted && (
                <div className="mt-5 space-y-3">
                  <h3 className="font-semibold text-gray-900">Improve Next</h3>
                  {(weakSkills.length ? weakSkills : ["Interview"]).map((skill) => (
                    <div key={skill} className="rounded-md border border-gray-200 p-3">
                      <p className="text-sm font-semibold text-gray-900">{skill}</p>
                      <p className="mt-1 text-xs leading-5 text-gray-600">{recommendations[skill]}</p>
                    </div>
                  ))}
                </div>
              )}

              {!submitted ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Submit Assessment
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resetAssessment}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retake Assessment
                </button>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
