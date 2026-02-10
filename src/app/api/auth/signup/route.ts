import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { verify } from "@/helpers/verify";

export async function POST(req: Request) {
  const { username, email, password } = await req.json();

  await connectDB();

  try {
    const existingUserByUsername = await User.findOne({ username });
    const existingUserByEmail = await User.findOne({ email });

    if (
      existingUserByUsername &&
      existingUserByUsername.email !== email
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "This username is already taken"
        },
        { status: 409 }
      );
    }

    if (existingUserByEmail?.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "This email is already registered"
        },
        { status: 409 }
      );
    }

    const VCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 30);
    const hashedPassword = await bcryptjs.hash(password, 10);

    if (existingUserByEmail) {
      existingUserByEmail.username = username;
      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.VCode = VCode;
      existingUserByEmail.VCodeExpiration = expiryTime;
      await existingUserByEmail.save();
    } else {
      const user = new User({
        username,
        email,
        password: hashedPassword,
        VCode,
        VCodeExpiration: expiryTime,
        isVerified: false,
        isExcepting: true,
        messages: [],
      });
      await user.save();
    }

    const res = await verify(email, username, VCode);

    if (!res.success) {
      return NextResponse.json(
        {
          success: false,
          message: res.message ?? "Error sending email"
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Email sent successfully"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error"
      },
      { status: 500 }
    );
  }
}
