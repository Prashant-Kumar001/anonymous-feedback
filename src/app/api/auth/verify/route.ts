import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { username, VCode: otp } = await req.json();

  console.log({
    username,
    otp,
  })

  if (!username) {
    return NextResponse.json(
      {
        success: false,
        error: "validation error",
        message: "Username is required",
      },
      { status: 400 }
    );
  }

  if (!otp) {
    return NextResponse.json(
      {
        success: false,
        error: "validation error",
        message: "OTP is required",
      },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    const user = await User.findOne({ username });

    console.log(user);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "",
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const now = new Date();

    if (user.VCode !== otp) {
      return NextResponse.json(
        {
          success: false,
          error: "otp error",
          message: "Invalid OTP",
        },
        { status: 400 }
      );
    }

    if (!user.VCodeExpiration || user.VCodeExpiration < now) {
      return NextResponse.json(
        {
          success: false,
          error: "OTP error",
          message: "OTP has expired",
        },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.VCode = '000000';
    user.VCodeExpiration = new Date(0o0);
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
