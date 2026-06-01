import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";

function createPasswordHash(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

function toSafeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();
    const password = body.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Account not found. Please sign up first." },
        { status: 404 }
      );
    }

    const passwordHash = createPasswordHash(password, user.passwordSalt);

    if (passwordHash !== user.passwordHash) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({ user: toSafeUser(user) }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to sign in", error: error.message },
      { status: 500 }
    );
  }
}
