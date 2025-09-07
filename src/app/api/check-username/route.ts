import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { z } from "zod";
import { username as usernameSchema } from "@/schemas/signup";



export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username is required" },
        { status: 400 }
      );
    }

    const checkName = z.object({
      username: usernameSchema,
    });

    const result = checkName.safeParse({ username });


    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return NextResponse.json(
        { success: false, error: usernameError.length > 0 ? usernameError.join(", ") : "Invalid username" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ username, isVerified: true });
    if (user) {
      return NextResponse.json(
        { success: false, error: "This username is already taken" },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error checking username:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
