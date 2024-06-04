/**
 * This page utilizes the useChat hook, which will, by default, use the POST API route you created earlier (/api/chat).
 * The hook provides functions and state for handling user input and form submission.
 * 
 * The useChat hook provides the following utility functions and state variables:
 * 
 *  messages - The current chat messages (an array of objects with id, role, and content properties).
 *  {string} input - The current value of the user's input field.
 *  {function} handleInputChange - A function to handle user interactions (typing into the input field).
 *  {function} handleSubmit - A function to handle form submission.
 *  {boolean} isLoading - A boolean that indicates whether the API request is in progress.
 */
// "use client";

// import { useChat } from "ai/react";

// export default function Chat() {
//   const { messages, input, handleInputChange, handleSubmit } = useChat();
//   return (
//     <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
//       {messages.map((m) => (
//         <div key={m.id} className="whitespace-pre-wrap">
//           {m.role === "user" ? "User: " : "AI: "}
//           {m.content}
//         </div>
//       ))}

//       <form onSubmit={handleSubmit}>
//         <input
//           className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl bg-white text-black"
//           value={input}
//           placeholder="Say something..."
//           onChange={handleInputChange}
//         />
//       </form>
//     </div>
//   );
// }




/*
So far, you have used Vercel AI SDK's UI package to connect your frontend to your API route. This package is framework agnostic and provides simple abstractions for quickly building chat-like interfaces with LLMs.

The Vercel AI SDK also has a package (ai/rsc) specifically designed for frameworks that support the React Server Component architecture. With ai/rsc, you can build AI applications that go beyond pure text.



Let's look at how your implementation has changed. Without useChat, you have to manage your own state using the useState hook to manage the user's input and messages, respectively. The biggest change in your implementation is how you manage the form submission behaviour:

Define a new variable to house the existing messages and append the user's message.
Update the messages state by passing newMessages to the setMessages function.
Clear the input state with setInput("").
Call your Server Action just like any other asynchronous function, passing the newMessages variable declared in the first step. This function will return a streamable value.
Use an asynchronous for-loop in conjunction with the readStreamableValue function to iterate over the stream returned by the Server Action and read its value.
Finally, update the messages state with the content streamed via the Server Action.
*/
"use client";

import { type CoreMessage } from "ai";
import { useState } from "react";
import { continueConversation } from "./actions";
import { readStreamableValue } from "ai/rsc";



// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default function Chat() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState("");
  const [data, setData] = useState<any>();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {messages.map((m, i) => (
        <div key={i} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.content as string}
        </div>
      ))}

      <form
        action={async () => {
          const newMessages: CoreMessage[] = [
            ...messages,
            { content: input, role: "user" },
          ];

          setMessages(newMessages);
          setInput("");

          const result = await continueConversation(newMessages);
          setData(result.data);

          for await (const content of readStreamableValue(result.message)) {
            setMessages([
              ...newMessages,
              {
                role: "assistant",
                content: content as string,
              },
            ]);
          }
        }}
      >
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}