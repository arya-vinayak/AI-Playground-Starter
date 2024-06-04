"use server";

import { createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { openai,createOpenAI } from "@ai-sdk/openai";




const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const model = groq("llama3-8b-8192");

export async function continueConversation(messages: CoreMessage[]) {
  "use server";
  const result = await streamText({
    // model: openai("gpt-3.5-turbo-instruct"),
    model,
    messages,
  });
  const data = { test: "hello" };
  const stream = createStreamableValue(result.textStream);
  return { message: stream.value, data };
}
