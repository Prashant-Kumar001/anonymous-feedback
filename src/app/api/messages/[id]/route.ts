import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            {
                message: "Unauthorized",
                error: "Unauthorized"
            },
            { status: 401 });
    }

    if (!session.user) {
        return NextResponse.json(
            {
                message: "Unauthorized",
                error: "Unauthorized"
            },
            { status: 401 });
    }

    const user: User = session.user;
    const userId = user._id;
    const param = await params;
    const messageId = param.id;
    await connectDB();

    try {
        const res = await UserModel.updateOne(
            { _id: userId },
            { $pull: { messages: { _id: messageId } } },
        );
        if (res.matchedCount === 0) {
            return NextResponse.json(
                {
                    message: "message not found",
                },
                { status: 404 });
        }
        return NextResponse.json(
            {
                message: "Message deleted successfully"
            },
            { status: 200 }
        );
    } catch {
        return NextResponse.json(
            {
                message: "Failed to delete message"
            },
            { status: 500 }
        );
    }
}
