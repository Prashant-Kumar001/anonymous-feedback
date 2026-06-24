import { getServerSession } from "next-auth/next";
import { NextResponse, NextRequest } from "next/server";
import UserModel from "@/models/User";
import { connectDB } from "@/lib/db";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;

        if (!session || !user) {
            return NextResponse.json(
                { 
                    success: false,
                    message: "User not authenticated",
                    error: "unauthorized"
                },
                { status: 401 }
            );
        }

        const userId = user._id;
        const body = await req.json();
        const { isExcepting: accept } = body;

        if (typeof accept !== 'boolean') {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid input",
                    error: "isAccepting must be a boolean value"
                },
                { status: 400 }
            );
        }

        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: userId },
            { $set: { isExcepting: accept } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
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
                message: updatedUser.isExcepting 
                    ? "User is now accepting messages ✅" 
                    : "User is no longer accepting messages ❌",
                data: {
                    isAccepting: updatedUser.isExcepting,
                    updatedAt: new Date().toISOString()
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating user acceptance status:", error);
        return NextResponse.json(
            { 
                success: false,
                message: "Error updating user",
                error: "Internal server error"
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
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

        const foundUser = await UserModel.findOne({ _id: userId });

        if (!foundUser) {
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
                data: {
                    isExcepting: foundUser.isExcepting,
                    username: foundUser.username,
                    email: foundUser.email
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user acceptance status:", error);
        return NextResponse.json(
            { 
                success: false,
                message: "Error fetching user",
                error: "Internal server error"
            },
            { status: 500 }
        );
    }
}