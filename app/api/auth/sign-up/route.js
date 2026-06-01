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
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password || "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = createPasswordHash(password, salt);
    const nameParts = name.split(" ").filter(Boolean);
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(" ");

    const user = await User.create({
      name,
      firstName,
      lastName,
      email,
      passwordSalt: salt,
      passwordHash,
    });

    return NextResponse.json({ user: toSafeUser(user) }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to create account", error: error.message },
      { status: 500 }
    );
  }
}
