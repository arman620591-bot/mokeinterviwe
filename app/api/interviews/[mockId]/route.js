import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import MockInterview from "@/models/MockInterview";
import UserAnswer from "@/models/UserAnswer";

export async function GET(_request, { params }) {
  try {
    await connectToDatabase();

    const interview = await MockInterview.findOne({ mockId: params.mockId });

    if (!interview) {
      return NextResponse.json(
        { message: "Interview not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ interview }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to load interview", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    await connectToDatabase();

    const interview = await MockInterview.findOne({ mockId: params.mockId });

    if (!interview) {
      return NextResponse.json(
        { message: "Interview not found" },
        { status: 404 }
      );
    }

    if (email && interview.createdBy !== email) {
      return NextResponse.json(
        { message: "You can only delete your own interviews" },
        { status: 403 }
      );
    }

    await UserAnswer.deleteMany({ mockIdRef: params.mockId });
    await MockInterview.deleteOne({ mockId: params.mockId });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete interview", error: error.message },
      { status: 500 }
    );
  }
}
