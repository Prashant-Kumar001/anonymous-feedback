import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";

export async function POST(req) {
  await connectDB();

  const { identifier } = await req.json();

  const user = await UserModel.findOne({
    email: identifier,
  }).select("username isVerified");

  if (!user) {
    return NextResponse.json({
      success: false,
      code: "USER_NOT_FOUND",
    });
  }

  if (!user.isVerified) {
    return NextResponse.json({
      success: false,
      code: "UNVERIFIED_USER",
      username: user.username,
    });
  }

  return NextResponse.json({
    success: true,
  });
}