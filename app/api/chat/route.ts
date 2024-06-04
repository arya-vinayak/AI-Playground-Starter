import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  //extract messages from request and the messages variable contains the history of the conversation , with the necesssary context to make the next generation
  const { messages } = await req.json();
//   console.log(messages);
  //[ { role: 'user', content: 'hey how are you doing today ?' } ]

  //Call streamText, which is imported from the ai package. This function accepts a configuration object that contains a model provider (imported from @ai-sdk/openai) and messages (defined in step 1). You can pass additional settings to further customise the model's behaviour.

  const result = await streamText({
    model: openai("gpt-3.5-turbo-instruct"),
    messages,
  });

  //The streamText function returns a StreamTextResult. This result object contains the toAIStreamResponse function which converts the result to a streamed response object.
  // Finally, return the result to the client to stream the response.
  return result.toAIStreamResponse();
}
