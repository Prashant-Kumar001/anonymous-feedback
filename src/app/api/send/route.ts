import UserModel from "@/models/User";
import { Message } from "@/models/User";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await connectDB();
    const { username, content } = await req.json();

    try {
        const user = await UserModel.findOne({ username });


        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "you are not registered"
                },
                { status: 404 }
            );
        }
        if (!user.isExcepting) {
            return NextResponse.json(
                {
                    success: false,
                    error: "you are not excepting",
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
                message: "message sent successfully",
            },
            { status: 200 }
        );

    } catch{
        return NextResponse.json(
            {   
                success: false, 
                error: "something went wrong"   
            },
            { status: 500 }
        );
    }
}
