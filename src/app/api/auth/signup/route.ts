import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { verify } from "@/helpers/verify";

export async function POST(req: Request) {
  const { username, email, password } = await req.json();
  console.log({
    username,
    email,
    password
  })

  await connectDB();

  try {
    const ISuser = await User.findOne({ username, isVerified: true });

    console.log(ISuser)

    if (ISuser) {
      return NextResponse.json(
        {
          success: false,
          message: "This username is already taken"
        },
        { status: 409 }
      );
    }
    

    const ISexitUserBYemail = await User.findOne({ email });

    const VCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 30);

    if (ISexitUserBYemail) {
      if (ISexitUserBYemail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "This email is already registered"
          },
          { status: 409 }
        );
      } else {
        ISexitUserBYemail.password = await bcryptjs.hash(password, 10);
        ISexitUserBYemail.VCode = VCode;
        ISexitUserBYemail.VCodeExpiration = expiryTime;
        await ISexitUserBYemail.save();
      }
    } else {
      const HashPassword = await bcryptjs.hash(password, 10);
      const user = new User({
        username,
        email,
        password: HashPassword,
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
