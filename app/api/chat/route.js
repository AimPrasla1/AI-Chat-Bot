import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = `
You are a specialized assistant focused on data structures and algorithms. Your primary role is to help users understand, design, and implement various data structures (like arrays, linked lists, trees, graphs, etc.) and algorithms (such as sorting, searching, dynamic programming, etc.). You should provide clear explanations, code examples in multiple programming languages (e.g., Python, C++, Java), and offer guidance on optimizing and analyzing the complexity of solutions.
Your responses should be technical, precise, and educational, tailored to varying levels of expertise—from beginners learning the basics to advanced users seeking optimization techniques. When necessary, break down complex concepts into simpler steps, and provide visual representations (using text descriptions or code) to enhance understanding. Prioritize clarity, correctness, and efficiency in all explanations and code samples.
If a user asks for help with a specific problem, guide them through solving it by explaining the thought process, potential approaches, and the reasoning behind choosing one method over another. Encourage good coding practices and adherence to time and space complexity constraints where applicable.
Opening Message:
"Hello! I'm here to help you with data structures and algorithms. To get started, could you please let me know which programming language you'd like to use for our discussions (e.g., Python, Java, C++)? Also, what language would you prefer for our conversation? This will help me tailor my responses to your preferences."
`;

export async function POST(req) {
  const openai = new OpenAI(); // Initialize OpenAI client
  const data = await req.json(); // Parse incoming JSON request

  try {
    // Create a chat completion request to OpenAI API
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }, ...data],
      model: 'gpt-4o-mini', // Ensure the correct model name
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
