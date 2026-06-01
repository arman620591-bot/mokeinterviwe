import mongoose from "mongoose";

const UserAnswerSchema = new mongoose.Schema(
  {
    mockIdRef: {
      type: String,
      required: true,
      index: true,
    },
    question: {
      type: String,
      required: true,
    },
    correctAns: {
      type: String,
      default: "",
    },
    userAns: {
      type: String,
      default: "",
    },
    feedback: {
      type: String,
      default: "",
    },
    strengths: {
      type: [String],
      default: [],
    },
    areasForImprovement: {
      type: [String],
      default: [],
    },
    rating: {
      type: String,
      default: "",
    },
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.UserAnswer || mongoose.model("UserAnswer", UserAnswerSchema);
