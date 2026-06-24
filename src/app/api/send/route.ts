import UserModel from "@/models/User";
import { Message } from "@/models/User";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connectDB();

        const { username, content } = await req.json();

        if (!username || !content) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Username and message content are required"
                },
                { status: 400 }
            );
        }

        if (content.trim().length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Message content cannot be empty"
                },
                { status: 400 }
            );
        }

        if (content.length > 500) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Message cannot exceed 500 characters"
                },
                { status: 400 }
            );
        }

        const user = await UserModel.findOne({ username });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User not found. Please check the username."
                },
                { status: 404 }
            );
        }

        if (!user.isExcepting) {
            return NextResponse.json(
                {
                    success: false,
                    error: "This user is not accepting messages at the moment"
                },
                { status: 403 }
            );
        }

        const message = { content, createAt: new Date()};
        user.messages.push(message as Message);
        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: "Message sent successfully ✨",
                data: {
                    messageId: user.messages[user.messages.length - 1]._id,
                    sentAt: new Date().toISOString()
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error in send message API:", error);

        if (error instanceof Error) {
            if (error.name === "ValidationError") {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Invalid data format"
                    },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json(
            {
                success: false,
                error: "Something went wrong. Please try again later."
            },
            { status: 500 }
        );
    }
}