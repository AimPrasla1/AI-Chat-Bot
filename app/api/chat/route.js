import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = `
You are a college student bot that helps users with various academic queries.
`;

export async function POST(req) {
  const openai = new OpenAI(); // Initialize OpenAI client
  const data = await req.json(); // Parse incoming JSON request

  try {
    // Create a chat completion request to OpenAI API
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }, ...data],
      model: 'gpt-4', // Ensure the correct model name
      stream: true, // Enable streaming
    });

    // Handle streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              const text = encoder.encode(content);
              controller.enqueue(text); // Enqueue the response chunk
            }
          }
        } catch (err) {
          console.error('Error during streaming:', err); // Add error logging
          controller.error(err); // Signal an error to the stream
        } finally {
          controller.close(); // Close the stream when done
        }
      },
    });

    return new NextResponse(stream); // Return the stream as the HTTP response

  } catch (error) {
    console.error('Error with OpenAI API:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch completion' }), { status: 500 });
  }
}
