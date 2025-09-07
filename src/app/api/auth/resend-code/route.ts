import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { verify } from "@/helpers/verify";

export async function POST(req: Request) {
    const { username } = await req.json();

    if (!username) {
        return NextResponse.json(
            {
                success: false,
                error: "validation error",
                message: "Username is required"
            },
            { status: 400 }
        );
    }

    await connectDB();

    try {
        const ISuser = await User.findOne({ username, isVerified: true });
        if (ISuser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "This user with this username is already verified"
                },
                { status: 409 }
            );
        }


        const VCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 30);

        const user = await User.findOneAndUpdate(
            { username },
            { $set: { VCode, VCodeExpiration: expiryTime } },
            { new: true }
        );

        if(!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            );
        }


        const res = await verify(user.email, username, VCode);

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
                message: "opt sent successfully"
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
