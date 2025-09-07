import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
    await connectDB();
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url) as { searchParams: URLSearchParams };
    const { page = "1", limit = "10" } = Object.fromEntries(searchParams.entries());

    if (!session || !session.user) {
        return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const user: User = session.user as User;
    const userId = new mongoose.Types.ObjectId(user._id);

    const pageNum = Number(page);
    const limitNum = Number(limit);

    try {
        // Get total number of messages for pagination info
        const userDoc = await UserModel.findById(userId).select("messages");
        if (!userDoc) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const totalMessages = userDoc.messages.length;
        const totalPages = Math.ceil(totalMessages / limitNum);

        if (totalMessages === 0) {
            return NextResponse.json({ success: false, message: "No messages found" }, { status: 404 });
        }

        // Aggregate paginated messages
        const res = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $skip: (pageNum - 1) * limitNum },
            { $limit: limitNum },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } },
            { $project: { messages: 1 } },
        ]);

        return NextResponse.json(
            {
                success: true,
                message: "Messages found",
                pagination: {
                    totalMessages,
                    totalPages,
                    currentPage: pageNum,
                    hasNextPage: pageNum < totalPages,
                    hasPrevPage: pageNum > 1,
                    nextPage: pageNum < totalPages ? pageNum + 1 : null,
                    prevPage: pageNum > 1 ? pageNum - 1 : null,
                    limit: limitNum,
                },
                messages: res[0]?.messages || [],
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error finding user:", error);
        return NextResponse.json({ message: "Error finding user" }, { status: 500 });
    }
}
