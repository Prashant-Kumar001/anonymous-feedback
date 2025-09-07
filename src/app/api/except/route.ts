import { getServerSession } from "next-auth/next";
import { NextResponse, NextRequest } from "next/server";
import UserModel from "@/models/User";
import { connectDB } from "@/lib/db";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
    await connectDB();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
        return NextResponse.json(
            { message: "User not authenticated" },
            { status: 401 }
        );
    }

    const userId = user._id;
    const { isExcepting: accept } = await req.json();

    try {
        const res = await UserModel.findOneAndUpdate(
            { _id: userId },
            { $set: { isExcepting: accept } },
            { new: true }
        );

        if (!res) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                    error: 'failed'
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: res.isExcepting ? "user now is  excepting" : "user now is not excepting",
                res
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { message: "Error updating user" },
            { status: 500 }
        );
    }

}

export async function GET() {

    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json(
            {
                success: false,
                message: "User not authenticated",
                error: "unauthorized"
            },
            { status: 401 }
        );
    }

    const user: User = session.user as User;
    const userId = user._id;

    try {
        const res = await UserModel.findOne({ _id: userId });

        if (!res) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                    error: "User not found"
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                isExcepting: res.isExcepting,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error finding user:", error);
        return NextResponse.json(
            { message: "Error finding user" },
            { status: 500 }
        );
    }

}