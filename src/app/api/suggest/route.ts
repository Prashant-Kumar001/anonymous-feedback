import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const runTime = "edge";

export async function POST() {
    try {

        const prompt =
            "create s list of three open-ended and engaging questions formatted as single string. each question should be separated by '||'. these questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience, Avoid universal themes that encourage friendly interaction, For example, your output should be structured like this: 'what is the hobby recently stated? || if could have dinner with any historical figure, who would it be? || what is a simple thing that makes you happy? '. Ensure the questions are intriguing, foster curiosity, and contribute to a positive snd welcoming conversational environment. ";

        const res = await openai.completions.create({
            model: "gpt-3.5-turbo-instruct",
            max_tokens: 400,
            stream: true,
            prompt,
        });


        const stream = new ReadableStream({
            async pull(controller) {
                for await (const chunk of res) {
                    controller.enqueue(chunk);
                }
                controller.close();
            },
        });
        return new Response(stream);
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            const { name, status, headers, message } = error;

            return NextResponse.json(
                {
                    name,
                    status,
                    headers,
                    message,
                },
                {
                    status: 500,
                }
            );
        } else {
            throw error;
        }
    }
}
