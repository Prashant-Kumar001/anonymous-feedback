import { NextResponse, NextRequest } from "next/server";
import VisitorModel from "@/models/Visitor";
import UserModel from "@/models/User";
import { connectDB } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const username = searchParams.get('username');

        if (!username) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Username is required"
                },
                { status: 400 }
            );
        }

        const user = await UserModel.findOne({ username });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User not found"
                },
                { status: 404 }
            );
        }

        const visitor = await VisitorModel.findOne({ profileId: user._id });

        if (!visitor) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Visitor not found"
                },
                { status: 404 }
            );
        }


        return NextResponse.json(
            {
                success: true,
                data: {
                    visitorCount: visitor.count,
                    username: user.username
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching visitor count:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch visitor count"
            },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const username = searchParams.get('username');

        if (!username) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Username is required"
                },
                { status: 400 }
            );
        }



        const user = await UserModel.findOne({ username });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User not found"
                },
                { status: 404 }
            );
        }


        const visitor = await VisitorModel.findOne({ profileId: user._id });

        if (!visitor) {
            const newVisitor = new VisitorModel({
                profileId: user._id,
                count: 1,
            });
            await newVisitor.save();
        } else {
            visitor.count += 1;
            await visitor.save();
        }


        return NextResponse.json(
            {
                success: true,
                data: {
                    visitorCount: visitor.count
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error updating visitor count:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to update visitor count"
            },
            { status: 500 }
        );
    }
}