import mongoose from "mongoose";

const MockInterviewSchema = new mongoose.Schema(
  {
    mockId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    jsonMockResp: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    jobPosition: {
      type: String,
      required: true,
    },
    jobDesc: {
      type: String,
      required: true,
    },
    jobExperience: {
      type: String,
      required: true,
    },
    createdBy: {
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

export default mongoose.models.MockInterview || mongoose.model("MockInterview", MockInterviewSchema);
