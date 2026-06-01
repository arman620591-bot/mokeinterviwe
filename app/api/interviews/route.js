import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import MockInterview from "@/models/MockInterview";

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === "";
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const interviews = await MockInterview.find({ createdBy: email }).sort({
      createdAt: -1,
      _id: -1,
    });

    return NextResponse.json({ interviews }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to load interviews", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      mockId,
      jsonMockResp,
      jobPosition,
      jobDesc,
      jobExperience,
      createdBy,
      createdAt,
    } = body;

    if (
      isBlank(mockId) ||
      !jsonMockResp ||
      isBlank(jobPosition) ||
      isBlank(jobDesc) ||
      isBlank(jobExperience) ||
      isBlank(createdBy)
    ) {
      return NextResponse.json(
        { message: "Missing interview payload" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const interview = await MockInterview.create({
      mockId: String(mockId).trim(),
      jsonMockResp,
      jobPosition: String(jobPosition).trim(),
      jobDesc: String(jobDesc).trim(),
      jobExperience: String(jobExperience).trim(),
      createdBy: String(createdBy).trim().toLowerCase(),
      createdAt,
    });

    return NextResponse.json({ interview }, { status: 201 });
  } catch (error) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { message: "Interview already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create interview", error: error.message },
      { status: 500 }
    );
  }
}
